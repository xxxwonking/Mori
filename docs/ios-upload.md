# iOS 上传插件使用指南

`mori-upload-ios` 为 Mori UI 提供 iOS 系统相册选择、可读临时文件和前台上传。页面通常直接使用 `mori-upload`，组件会在 APP-IOS 自动调用插件；H5、微信及其他平台继续走对应的 uni API。

插件源码已实现，目前的验证包括桥接替身测试、组件状态测试、H5／微信构建和浏览器选图。**iOS 原生编译、iCloud／相机读取和真实设备上传仍待验收。** 最新证据见 [兼容记录](compatibility.md)，完整组件参数见 [Upload](components/upload.md)。

## 1. 安装两个模块

目标必须是 uni-app x 工程，页面使用 `.uvue` 和 UTS。将以下两个目录完整复制到业务工程：

```text
业务工程/
└── uni_modules/
    ├── mori-ui/
    └── mori-upload-ios/
        ├── package.json
        ├── README.md
        └── utssdk/
            ├── interface.uts
            └── app-ios/
                ├── index.uts
                ├── MoriIOSUpload.swift
                ├── config.json
                └── Info.plist
```

`mori-ui/package.json` 已声明 `mori-upload-ios` 依赖；手动复制时仍需把两个目录都带上。当前未发布 npm 包或插件市场版本，不使用 `npm install mori-upload-ios` 安装。工作台和官网示例不需要复制。

使用 HBuilderX 5.31+ 及匹配的 uni-app x／UTS 编译环境。原生模块的 `deploymentTarget` 为 iOS 14；宿主框架若要求更高版本，应用和设备需满足较高者。主题初始化沿用 [使用手册](user-guide.md) 的 `initMoriTheme()` 接入步骤。

## 2. 配置权限并制作基座

相册通过 PHPicker 只读取用户选中的照片，不请求整个照片库的读写授权。业务另外直接访问或保存到照片库时，相关权限需由业务独立配置。

拍照会请求相机权限。插件的 `utssdk/app-ios/Info.plist` 已包含以下用途说明，发布前按实际业务调整，并核对最终应用包中的合并结果：

```xml
<key>NSCameraUsageDescription</key>
<string>用于拍摄您选择上传的照片</string>
```

在 HBuilderX 中为业务工程配置自己的 AppID、签名与 iOS 运行环境，制作包含本插件的自定义调试基座，再使用该基座运行。正式交付时重新打包。首次加入插件，或修改 Swift、`config.json`、`Info.plist` 后，均需重建基座／安装包；只刷新页面或热更新 UTS 页面不会更新原生二进制与权限配置。

仅选择相册照片时传 `:source-type="['album']"`；相册和拍照都开放时传 `:source-type="['album', 'camera']"`。后者会显示系统来源面板。

## 3. 页面接入示例

下面是手动提交的完整页面示例。先把 `upload-url` 替换成真实服务地址；示例约定服务返回 `{"url":"https://你的域名/photo.jpg"}`，实际字段不同就修改 `resolveUrl`。

```vue
<template>
  <view>
    <mori-upload
      ref="upload"
      v-model="files"
      :source-type="['album']"
      :max-count="3"
      :max-size="10485760"
      :auto-upload="false"
      upload-url="https://你的业务域名.example/upload"
      name="file"
      :header="requestHeaders"
      :form-data="extraFields"
      :resolve-url="resolveUrl"
      @success="onUploaded"
      @error="onError"
      @cancel="onCancel"
    />
    <mori-button label="开始上传" @click="upload?.submit()" />
    <mori-button label="清空列表" @click="upload?.clear()" />
    <text>{{ message }}</text>
  </view>
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriUploadFile, MoriUploadInstance } from '@/uni_modules/mori-ui/upload.uts'

const files = ref<MoriUploadFile[]>([])
const upload = ref<MoriUploadInstance | null>(null)
const message = ref('请选择照片')
// 从业务登录态设置请求头，不在源码中写入真实凭据。
const requestHeaders = ref<UTSJSONObject>({} as UTSJSONObject)
const extraFields = { scene: 'profile' } as UTSJSONObject

function resolveUrl(response: string): string {
  const result = JSON.parseObject(response)
  if (result == null) throw new Error('响应不是 JSON 对象')
  const url = result['url'] as string | null
  if (url == null || url.length == 0) throw new Error('服务器没有返回文件地址')
  return url
}
function onUploaded(file: MoriUploadFile, response: string) {
  message.value = file.name + ' 上传完成'
  // 此时 file.url 是 resolveUrl 返回的远端地址，可保存到业务记录。
}
function onError(error: string) { message.value = error }
function onCancel() { message.value = '已取消选择' }
</script>
```

需要选中即上传时，移除 `:auto-upload="false"` 并保留有效 `upload-url`。只需选图和预览时不配置 `upload-url`，通过 `afterRead` 接收已接纳文件。失败条目支持重试，程序也可调用 `upload?.retry(file.id)`；完整事件与方法见 [Upload API](components/upload.md)。

## 4. 服务端协议

| 配置 | 含义与约定 |
|---|---|
| uploadUrl | HTTP POST 上传端点；建议使用正常证书的 HTTPS |
| name | multipart 文件字段名，默认 `file` |
| header | 请求头，例如从登录态取得的鉴权头；不要手写 multipart boundary |
| formData | 额外 multipart 字段；建议用字符串保持跨端一致，iOS 对象／数组值编码为 JSON |
| timeout | 毫秒，默认 60000 |
| resolveUrl | 检查业务响应并返回文件 URL；空字符串或抛错使条目进入 error |

iOS 使用 URLSession 和磁盘 multipart 临时文件，响应限 2 MiB UTF-8 文本。HTTP 非 2xx 视为请求失败；HTTP 2xx 是否代表业务成功，需要在 `resolveUrl` 中按服务协议判断。省略 `resolveUrl` 时，成功条目仍保留本地路径，不应将它作为服务器地址存入数据库。

相册保留提供者返回的格式，HEIC 不会被伪装成 JPEG；拍照结果实际编码为 JPEG，质量参数 0.9。后端必须支持收到的格式，或由业务在自定义选择器中完成真实转换。ATS、证书、鉴权、微信合法域名和 H5 CORS 仍需针对部署环境配置。

## 5. 文件生命周期与自定义选择

相册资源可能仅在 iCloud，插件会等待提供者返回文件，在临时 URL 失效前复制到应用可读的目录，再返回路径。如果本批任何文件读取失败，会拒绝整批并清理已经复制的文件。

默认选出的副本由组件管理：用于预览和重试，在拒绝、删除、clear、外部模型移除、卸载或远端 URL 替换时释放。禁用会取消待完成的选择，但正在上传的任务继续；删除／clear／卸载会中断上传。用户取消系统选择器触发 `cancel`，不触发 `error`。

`afterRead` 中自行异步上传时，应保持组件和文件有效，或先由业务另存副本再离开页面。临时路径不能跨卸载或进程重启持久回显。

通过 `chooseFiles: () => Promise<MoriPickedFile[]>` 可替换选择过程；返回真实的 `{ path, name, size, type }`。iOS 路径必须是应用可读的绝对路径或合法 `file://` URL，不能直接使用 `ph://` 相册标识、提供者已经失效的 URL 或未复制的安全作用域资源。自定义文件归调用方清理，组件不删除它们。通过 `beforeRead` 可异步检查并拒绝整批。

## 6. 直接调用插件 API

定制原生接入时，可在 APP-IOS 条件编译范围内从 `@/uni_modules/mori-upload-ios` 导入下列导出。普通组件页面无需直接调用，也不应在 H5／微信分支无条件导入。

| 导出 | 参数与结果 |
|---|---|
| chooseIOSImages(options, success, fail) | options 为 JSON 字符串，含 `count`（1–9）与 `sourceType`；立即返回任务 ID。success 接收 JSON 数组字符串，数组项含 path／name／size／type；fail 接收 message、cancelled |
| uploadIOSFile(filePath, fileName, options, progress, success, fail) | options 为 JSON 字符串，含 url／name／header／formData／timeout；立即返回任务 ID。progress 接收百分比字符串，success 接收原始响应，fail 接收错误字符串 |
| cancelIOSTask(id) | 取消选择或上传任务；取消上传不保证再发失败回调，调用方主动收敛等待状态 |
| releaseIOSFile(path) | 释放本模块创建的副本；不会删除未登记的外部文件 |

直接调用时由调用方保存任务 ID，在卸载时取消任务，忽略迟到回调，并在不再预览／上传后释放所有返回的副本。传给上传的文件须保留到上传结束；释放照片副本与取消任务是两个不同操作。类型与实现以 [接口定义](../uni_modules/mori-upload-ios/utssdk/interface.uts) 和 [原生入口](../uni_modules/mori-upload-ios/utssdk/app-ios/index.uts) 为准。

## 7. 常见问题

| 现象 | 检查与处理 |
|---|---|
| 找不到 mori-upload-ios 或原生类 | 核对两个目录是否完整，确认在 uni-app x 工程运行，并重建含插件的自定义基座 |
| 修改配置后仍是旧行为 | 重新制作并安装基座／包，核对实际运行的基座与合并后的 Info.plist |
| 相册能打开但照片一直在读取 | 确认是否为仅云端照片、网络与可用空间是否正常，尝试本地照片对照；原生读取仍需设备日志定位 |
| 提示相机权限或用途文案缺失 | 核对 NSCameraUsageDescription 的合并结果及系统相机权限；只需相册时限制 sourceType |
| 提示照片不可读 | 重新选择，不使用 ph:// 或过期临时路径；自定义文件须先复制到应用可读目录 |
| HTTP 2xx 但条目失败 | 检查 resolveUrl 的字段及业务状态判断；也检查是否超过响应上限或不是 UTF-8 文本 |
| 服务器不接受 HEIC | 服务端支持 HEIC，或在 chooseFiles 中真实转码；不能只修改扩展名 |
| 离开页面后上传停止 | 组件卸载会取消任务并释放自有副本；当前没有后台续传或持久任务恢复 |

## 8. 验证与边界

仓库开发检查可运行 `npm run check`、`npm run check:docs`、`npm run test:unit`；定向桥接与组件检查为 `node tests/upload-ios.mjs`、`node tests/extension-components.mjs`。这些测试不执行 Swift。H5／微信构建通过也不能替代 iOS 验收。

在具备 iOS 工具链、签名、真实设备和测试服务的环境，按 [MORI-UP-IOS-01 至 06](platform-adaptation.md) 验证本地／iCloud 图片、HEIC、中文路径、相机权限、取消、断网重试、卸载、文件清理及服务器实际收到的字节。记录设备、系统、HBuilderX／uni-app x 版本与服务日志。

当前未实现默认文档选择、保存到相册、HEIC 转码、后台续传和跨进程恢复。配置方式依据 [DCloud iOS 插件文档](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-for-ios.html)；相册行为依据 [Apple PHPicker](https://developer.apple.com/documentation/photosui/phpickerviewcontroller)。
