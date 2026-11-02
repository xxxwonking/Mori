import Foundation
import UIKit
import PhotosUI
import UniformTypeIdentifiers
import AVFoundation
import DCloudUTSFoundation

private protocol MoriCancellable: AnyObject { func cancel() }

/// All UI/task transitions run on main. The registry also accepts calls from UTS worker threads.
public final class MoriIOSUpload {
    private static let lock = NSLock()
    private static var tasks: [String: MoriCancellable] = [:]
    private static var ownedFiles = Set<String>()
    private static let directory = FileManager.default.temporaryDirectory
        .appendingPathComponent("mori-upload-" + UUID().uuidString, isDirectory: true)

    public static func choose(_ options: String, _ success: @escaping (String) -> Void,
                              _ fail: @escaping (String, Bool) -> Void) -> String {
        let id = UUID().uuidString
        let operation = MoriPhotoSelection(id: id, options: options, success: success, fail: fail)
        lock.lock(); tasks[id] = operation; lock.unlock()
        DispatchQueue.main.async { operation.start() }
        return id
    }

    public static func upload(_ path: String, _ name: String, _ options: String,
                              _ progress: @escaping (String) -> Void, _ success: @escaping (String) -> Void,
                              _ fail: @escaping (String) -> Void) -> String {
        let id = UUID().uuidString
        let operation = MoriUploadOperation(id: id, path: path, name: name, options: options,
                                            progress: progress, success: success, fail: fail)
        lock.lock(); tasks[id] = operation; lock.unlock()
        DispatchQueue.main.async { operation.start() }
        return id
    }

    public static func cancel(_ id: String) {
        lock.lock(); let task = tasks[id]; lock.unlock()
        DispatchQueue.main.async { task?.cancel() }
    }

    /// Only files created by this module can be deleted. Caller-owned paths are never removed.
    public static func release(_ path: String) {
        lock.lock(); let owned = ownedFiles.remove(path) != nil; lock.unlock()
        if owned { try? FileManager.default.removeItem(atPath: path) }
    }

    fileprivate static func finish(_ id: String) { lock.lock(); tasks.removeValue(forKey: id); lock.unlock() }
    fileprivate static func temporaryURL(_ ext: String) throws -> URL {
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true, attributes: nil)
        let url = directory.appendingPathComponent(UUID().uuidString)
        return ext.isEmpty ? url : url.appendingPathExtension(ext)
    }
    fileprivate static func own(_ url: URL) { lock.lock(); ownedFiles.insert(url.path); lock.unlock() }
    fileprivate static func file(_ url: URL, name: String) throws -> [String: Any] {
        let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
        return ["path": url.path, "name": name, "size": attributes[.size] as? NSNumber ?? 0,
                "type": UTType(filenameExtension: url.pathExtension)?.preferredMIMEType ?? "application/octet-stream"]
    }
    fileprivate static func parse(_ value: String) throws -> [String: Any] {
        guard let data = value.data(using: .utf8),
              let object = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw NSError(domain: "MoriUpload", code: 1, userInfo: [NSLocalizedDescriptionKey: "上传配置格式无效"])
        }
        return object
    }
    fileprivate static func message(_ text: String) -> NSError {
        NSError(domain: "MoriUpload", code: 1, userInfo: [NSLocalizedDescriptionKey: text])
    }
}

@available(iOS 14.0, *)
private final class MoriPhotoSelection: NSObject, MoriCancellable, PHPickerViewControllerDelegate,
                                         UIImagePickerControllerDelegate, UINavigationControllerDelegate,
                                         UIAdaptivePresentationControllerDelegate {
    let id: String
    let options: String
    let success: (String) -> Void
    let fail: (String, Bool) -> Void
    var controller: UIViewController?
    var progress: [Progress] = []
    var completed = false
    var count = 1
    // Photo-provider callbacks may arrive concurrently and after cancellation.
    let resultLock = NSLock()
    var files: [[String: Any]?] = []
    var readError: String?

    init(id: String, options: String, success: @escaping (String) -> Void, fail: @escaping (String, Bool) -> Void) {
        self.id = id; self.options = options; self.success = success; self.fail = fail
        super.init()
    }
    func start() {
        guard !completed else { return }
        do {
            let config = try MoriIOSUpload.parse(options)
            count = min(9, max(1, (config["count"] as? NSNumber)?.intValue ?? 1))
            let sources = config["sourceType"] as? [String] ?? ["album"]
            let album = sources.contains("album"), camera = sources.contains("camera")
            if album && camera {
                let sheet = UIAlertController(title: "选择照片来源", message: nil, preferredStyle: .actionSheet)
                sheet.addAction(UIAlertAction(title: "系统相册", style: .default) { [weak self, weak sheet] _ in
                    sheet?.dismiss(animated: true) { self?.controller = nil; self?.showAlbum() }
                })
                sheet.addAction(UIAlertAction(title: "拍照", style: .default) { [weak self, weak sheet] _ in
                    sheet?.dismiss(animated: true) { self?.controller = nil; self?.showCamera() }
                })
                sheet.addAction(UIAlertAction(title: "取消", style: .cancel) { _ in self.cancel() })
                present(sheet)
            } else if album { showAlbum() }
            else if camera { showCamera() }
            else { finish(error: "不支持的照片来源", cancelled: false) }
        } catch { finish(error: error.localizedDescription, cancelled: false) }
    }
    func present(_ viewController: UIViewController) {
        guard !completed else { return }
        let host = UTSiOS.getCurrentViewController()
        guard host.viewIfLoaded?.window != nil, host.presentedViewController == nil else {
            finish(error: "当前有其他系统窗口，请关闭后重试", cancelled: false); return
        }
        if let popover = viewController.popoverPresentationController {
            popover.sourceView = host.view
            popover.sourceRect = CGRect(x: host.view.bounds.midX, y: host.view.bounds.midY, width: 1, height: 1)
            popover.permittedArrowDirections = []
        }
        controller = viewController
        host.present(viewController, animated: true)
        viewController.presentationController?.delegate = self
    }
    func showAlbum() {
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = count
        config.preferredAssetRepresentationMode = .current
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = self
        present(picker)
    }
    func showCamera() {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            finish(error: "当前设备没有可用相机", cancelled: false); return
        }
        guard (Bundle.main.object(forInfoDictionaryKey: "NSCameraUsageDescription") as? String)?.isEmpty == false else {
            finish(error: "请配置相机用途说明 NSCameraUsageDescription", cancelled: false); return
        }
        AVCaptureDevice.requestAccess(for: .video) { granted in
            DispatchQueue.main.async {
                guard !self.completed else { return }
                guard granted else { self.finish(error: "没有相机权限，请在系统设置中允许访问", cancelled: false); return }
                let picker = UIImagePickerController()
                picker.sourceType = .camera; picker.mediaTypes = [UTType.image.identifier]; picker.delegate = self
                self.present(picker)
            }
        }
    }
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true); controller = nil
        guard !completed else { return }
        guard !results.isEmpty else { finish(error: "已取消选择", cancelled: true); return }
        files = Array(repeating: nil, count: results.count)
        let group = DispatchGroup()
        for (index, result) in results.enumerated() {
            group.enter()
            let provider = result.itemProvider
            let identifier = provider.registeredTypeIdentifiers.first { UTType($0)?.conforms(to: .image) == true } ?? UTType.image.identifier
            let task = provider.loadFileRepresentation(forTypeIdentifier: identifier) { url, error in
                defer { group.leave() }
                do {
                    guard let source = url else { throw error ?? MoriIOSUpload.message("无法读取照片，请检查 iCloud 下载或网络状态") }
                    // This copy MUST finish inside the provider callback: its URL expires on return.
                    let destination = try MoriIOSUpload.temporaryURL(source.pathExtension)
                    MoriIOSUpload.own(destination)
                    do {
                        // Track the destination before copying so disk-full/partial copies are cleaned too.
                        try FileManager.default.copyItem(at: source, to: destination)
                        let file = try MoriIOSUpload.file(destination, name: source.lastPathComponent)
                        self.resultLock.lock()
                        let discarded = self.completed
                        if !discarded { self.files[index] = file }
                        self.resultLock.unlock()
                        if discarded { MoriIOSUpload.release(destination.path) }
                    } catch { MoriIOSUpload.release(destination.path); throw error }
                } catch {
                    self.resultLock.lock(); self.readError = error.localizedDescription; self.resultLock.unlock()
                }
            }
            progress.append(task)
        }
        group.notify(queue: .main) {
            guard !self.completed else { return }
            self.resultLock.lock(); let error = self.readError; self.resultLock.unlock()
            self.finish(error: error, cancelled: false)
        }
    }
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) { cancel() }
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        picker.dismiss(animated: true); controller = nil
        guard let image = info[.originalImage] as? UIImage else { finish(error: "无法读取拍摄照片", cancelled: false); return }
        DispatchQueue.global(qos: .userInitiated).async {
            var result: [String: Any]?
            var failure: String?
            do {
                guard let data = image.jpegData(compressionQuality: 0.9) else { throw MoriIOSUpload.message("照片编码失败") }
                let destination = try MoriIOSUpload.temporaryURL("jpg")
                try data.write(to: destination, options: .atomic); MoriIOSUpload.own(destination)
                do { result = try MoriIOSUpload.file(destination, name: destination.lastPathComponent) }
                catch { MoriIOSUpload.release(destination.path); throw error }
            } catch { failure = error.localizedDescription }
            DispatchQueue.main.async {
                if self.completed { if let path = result?["path"] as? String { MoriIOSUpload.release(path) }; return }
                self.files = result == nil ? [] : [result]
                self.finish(error: failure, cancelled: false)
            }
        }
    }
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) { cancel() }
    func cancel() {
        guard !completed else { return }
        controller?.dismiss(animated: true); controller = nil
        progress.forEach { $0.cancel() }
        finish(error: "已取消选择", cancelled: true)
    }
    func finish(error: String?, cancelled: Bool) {
        resultLock.lock()
        if completed { resultLock.unlock(); return }
        completed = true
        let selected = files.compactMap { $0 }
        resultLock.unlock()
        MoriIOSUpload.finish(id)
        progress.removeAll()
        do {
            if let message = error { throw MoriIOSUpload.message(message) }
            let data = try JSONSerialization.data(withJSONObject: selected)
            success(String(decoding: data, as: UTF8.self))
        } catch {
            selected.forEach { if let path = $0["path"] as? String { MoriIOSUpload.release(path) } }
            fail(error.localizedDescription, cancelled)
        }
    }
}

private final class MoriUploadOperation: NSObject, MoriCancellable, URLSessionDataDelegate, URLSessionTaskDelegate {
    let id: String, path: String, name: String, options: String
    let progress: (String) -> Void, success: (String) -> Void, fail: (String) -> Void
    var stopped = false
    var session: URLSession?
    var task: URLSessionUploadTask?
    var body: URL?
    var response = Data()
    init(id: String, path: String, name: String, options: String, progress: @escaping (String) -> Void,
         success: @escaping (String) -> Void, fail: @escaping (String) -> Void) {
        self.id = id; self.path = path; self.name = name; self.options = options
        self.progress = progress; self.success = success; self.fail = fail
        super.init()
    }
    func start() {
        guard !stopped else { return }
        DispatchQueue.global(qos: .utility).async {
            do {
                let (request, body) = try self.prepare()
                DispatchQueue.main.async {
                    if self.stopped { try? FileManager.default.removeItem(at: body); return }
                    self.body = body
                    let session = URLSession(configuration: .ephemeral, delegate: self, delegateQueue: .main)
                    self.session = session
                    self.task = session.uploadTask(with: request, fromFile: body)
                    self.task?.resume()
                }
            } catch { DispatchQueue.main.async { self.finish(error.localizedDescription) } }
        }
    }
    static func quote(_ value: String) -> String {
        value.replacingOccurrences(of: "\r", with: "").replacingOccurrences(of: "\n", with: "")
            .replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "\"", with: "\\\"")
    }
    func prepare() throws -> (URLRequest, URL) {
        let config = try MoriIOSUpload.parse(options)
        guard let address = config["url"] as? String, let url = URL(string: address),
              ["http", "https"].contains(url.scheme?.lowercased() ?? "") else { throw MoriIOSUpload.message("请配置有效的 HTTP 上传地址") }
        let source = path.hasPrefix("file://") ? URL(string: path) : URL(fileURLWithPath: path)
        guard let source = source, source.isFileURL, FileManager.default.isReadableFile(atPath: source.path) else {
            throw MoriIOSUpload.message("本地照片不可读，请重新选择；不能直接上传相册资源标识")
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.timeoutInterval = max(1, (config["timeout"] as? NSNumber)?.doubleValue ?? 60000) / 1000
        for (key, value) in config["header"] as? [String: Any] ?? [:] { request.setValue(String(describing: value), forHTTPHeaderField: key) }
        let boundary = "Mori-" + UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        let body = try MoriIOSUpload.temporaryURL("multipart")
        guard FileManager.default.createFile(atPath: body.path, contents: nil) else { throw MoriIOSUpload.message("无法创建上传临时文件") }
        do {
            let output = try FileHandle(forWritingTo: body)
            defer { try? output.close() }
            func write(_ value: String) throws { try output.write(contentsOf: Data(value.utf8)) }
            for (key, value) in config["formData"] as? [String: Any] ?? [:] {
                let text: String
                if let string = value as? String { text = string }
                else if JSONSerialization.isValidJSONObject(value) { text = String(decoding: try JSONSerialization.data(withJSONObject: value), as: UTF8.self) }
                else { text = value is NSNull ? "" : String(describing: value) }
                try write("--\(boundary)\r\nContent-Disposition: form-data; name=\"\(Self.quote(key))\"\r\n\r\n\(text)\r\n")
            }
            let field = Self.quote(config["name"] as? String ?? "file")
            let filename = Self.quote(name.isEmpty ? source.lastPathComponent : name)
            let mime = UTType(filenameExtension: source.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
            try write("--\(boundary)\r\nContent-Disposition: form-data; name=\"\(field)\"; filename=\"\(filename)\"\r\nContent-Type: \(mime)\r\n\r\n")
            let input = try FileHandle(forReadingFrom: source)
            defer { try? input.close() }
            while true { let chunk = try input.read(upToCount: 64 * 1024) ?? Data(); if chunk.isEmpty { break }; try output.write(contentsOf: chunk) }
            try write("\r\n--\(boundary)--\r\n")
            return (request, body)
        } catch { try? FileManager.default.removeItem(at: body); throw error }
    }
    func urlSession(_ session: URLSession, task: URLSessionTask, didSendBodyData bytesSent: Int64,
                    totalBytesSent: Int64, totalBytesExpectedToSend: Int64) {
        guard !stopped, totalBytesExpectedToSend > 0 else { return }
        progress(String(min(100, max(0, Int(Double(totalBytesSent) * 100 / Double(totalBytesExpectedToSend))))))
    }
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard !stopped else { return }
        guard response.count + data.count <= 2 * 1024 * 1024 else { finish("服务器响应过大"); return }
        response.append(data)
    }
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        guard !stopped else { return }
        if let error = error { finish(error.localizedDescription); return }
        guard let result = task.response as? HTTPURLResponse else { finish("服务器未返回 HTTP 响应"); return }
        guard (200..<300).contains(result.statusCode) else { finish("上传失败（HTTP \(result.statusCode)）"); return }
        guard let text = String(data: response, encoding: .utf8) else { finish("服务器响应不是 UTF-8 文本"); return }
        stop(); success(text)
    }
    func finish(_ message: String) { guard !stopped else { return }; stop(); fail(message) }
    func cancel() { stop() }
    func stop() {
        guard !stopped else { return }
        stopped = true; task?.cancel(); session?.invalidateAndCancel(); task = nil; session = nil
        if let body = body { try? FileManager.default.removeItem(at: body) }; body = nil
        MoriIOSUpload.finish(id)
    }
}
