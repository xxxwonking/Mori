# Mori Upload iOS

Mori UI 的 iOS 系统相册、临时文件和前台上传适配。配合 `mori-ui` 使用，由 `APP-IOS` 条件编译接入；组件属性、事件和实例方法不变。原生实现已提供，尚无 iOS 编译或真机验收证据。

完整业务页面示例、服务端协议、直接调用 API 与排障见 [iOS 上传插件使用指南](https://github.com/xxxwonking/Mori/blob/master/docs/ios-upload.md)。以下说明随模块分发，便于复制后查阅。

## 接入

1. 将 `mori-ui` 和 `mori-upload-ios` 两个完整目录放在目标 uni-app x 工程的 `uni_modules/` 下。不要只复制 `.uvue` 文件。
2. 使用 HBuilderX 5.31+ 的 UTS 插件构建流程；本模块最低部署版本为 iOS 14，宿主 uni-app x／Vapor 的最低版本要求也必须满足。首次加入或修改 Swift、config.json、Info.plist 后重新制作包含本模块的自定义基座或重新打包，普通热更新不包含原生变更。
3. `utssdk/app-ios/Info.plist` 提供 `NSCameraUsageDescription`，发布前按业务用途调整文案并核对最终包的合并结果。只用相册时，组件传 `:source-type="['album']"`。PHPicker 不请求整个照片库的读写授权；业务其他代码直接访问照片库或保存照片时，仍需独立配置对应权限。
4. 在 `mori-upload` 配置真实 `upload-url`，用 `resolveUrl` 检查业务响应并返回远端 URL。HTTPS、证书、ATS 和鉴权由宿主与服务端配置。

## 行为

- 相册使用 PHPicker；等待所选资源（含 iCloud 下载）可读，在 `loadFileRepresentation` 回调返回前复制到应用临时目录。任一文件读取失败会拒绝本批并清理已复制文件，允许重新选择。
- 相册保留提供者返回的格式与扩展名，不保证原始相机文件逐字节一致，也不把 HEIC 伪装成 JPEG。拍照通过 UIImagePickerController 获取图像，实际编码为 JPEG，质量参数 0.9。后端须支持所上传格式，或由业务在自定义选择器中转换。
- 上传使用 URLSession 和磁盘 multipart 文件，支持字段名、请求头、表单字段、超时、进度与取消。仅前台会话；响应限 2 MiB UTF-8 文本。HTTP 非 2xx 发错误，业务成功由 `resolveUrl` 判断。
- 默认选出的复制文件由组件持有，用于预览与重试。删除、清空、外部移除、卸载或远端 URL 替换后释放；待检查文件在取消／禁用时释放。模块只删除自己登记创建的文件，不删除自定义 `chooseFiles` 提供的文件。
- 临时文件不能跨页面卸载或进程重启持久保存。在 `afterRead` 自行异步上传时须保持组件与文件有效，或由业务先另存副本。自定义选择器需返回应用可读的绝对路径或合法 `file://` URL，不能直接返回 `ph://` 相册标识或未复制的安全作用域 URL。

不包含文档选择、保存到相册、HEIC 转码、后台续传或持久任务恢复。文件预览仍使用宿主 `uni.previewImage`。

## 验证

仓库根目录执行 `node tests/upload-ios.mjs` 检查 UTS 路由与桥接契约，`node tests/extension-components.mjs` 检查真实组件状态和文件生命周期；两者已纳入 `npm run test:unit`。测试桥接替身不执行 Swift。

原生验收需在可构建 iOS 的环境制作自定义基座，接入真实设备和测试服务，检查本地照片、仅在 iCloud 的照片、HEIC、中文路径、拍照权限拒绝／允许、取消读取、删除上传中项目、重试和卸载。记录设备、系统、工具链、网络响应与临时文件清理结果。当前 Windows 环境无 Xcode、iOS SDK、签名或设备。

实现依据：[UTS 原生混编](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin-hybrid.html)、[iOS 插件配置](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-for-ios.html)、[UTSiOS](https://doc.dcloud.net.cn/uni-app-x/uts/utsios.html)、[PHPicker](https://developer.apple.com/documentation/photosui/phpickerviewcontroller)、[文件表示读取](https://developer.apple.com/documentation/foundation/nsitemprovider/loadfilerepresentation(fortypeidentifier:completionhandler:))。
