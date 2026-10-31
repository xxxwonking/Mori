# 上传 mori-upload

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

图片选择、预览和可选 HTTP 上传；服务器协议由业务接入。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-upload ref="upload" v-model="files" :max-count="3" :max-size="5242880" :auto-upload="false" upload-url="https://你的业务域名.example/upload" :resolve-url="resolveUrl" @success="uploaded" />
  <mori-button label="开始上传" @click="upload?.submit()" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriUploadFile, MoriUploadInstance } from '@/uni_modules/mori-ui/upload.uts'
const files = ref<MoriUploadFile[]>([])
const upload = ref<MoriUploadInstance | null>(null)
function resolveUrl(response: string): string {
  const result = JSON.parseObject(response)
  if (result == null) throw new Error('响应不是 JSON 对象')
  const url = result['url'] as string | null
  if (url == null || url.length == 0) throw new Error('服务器没有返回 url')
  return url
}
function uploaded(file: MoriUploadFile, response: string) { /* 保存业务记录 */ }
</script>
```

## 状态与进阶使用

上方 URL 是必须替换的占位地址。uploadUrl 为空时只选择与预览，并发 afterRead(files)，方便外部上传；不把选择成功等同服务器上传成功。autoUpload=true 且 URL 非空时自动提交。默认请求字段名 file，支持 header、formData、timeout；HTTP 非 2xx 进入 error。resolveUrl(response) 将原始响应解为远端地址，可抛错拒绝业务失败。省略 resolveUrl 时 HTTP 2xx 标记传输成功，但 url 保持本地预览路径，请在 success 中处理业务结果。详见下方生命周期和 iOS 适配说明。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | MoriUploadFile[] | [] | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| label | string | "图片上传" | 字段、操作或内容的名称；同时用于可访问性。 |
| buttonText | string | "选择图片" | 选择文件按钮文案。 |
| hint | string | "" | 帮助文字。 |
| maxCount | number | 9 | 最大图片数；达到上限隐藏选择入口。 |
| maxSize | number | 10485760 | 单文件最大字节数，默认 10 MiB；0 不限制。 |
| sourceType | Array（见用法） | ["album","camera"] | album / camera 来源数组；系统和权限可能限制。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| deletable | boolean | true | 显示删除按钮并允许 remove 方法；clear 仍可主动清空。 |
| previewImage | boolean | true | 启用系统图片预览；false 时仍发 preview 事件。 |
| autoUpload | boolean | true | 选择后自动上传，仅 uploadUrl 非空生效。 |
| uploadUrl | string | "" | 业务上传端点；空字符串仅选择。 |
| name | string | "file" | multipart 文件字段名，须与后端约定一致。 |
| header | Object（见用法） | {} | 请求头对象，不要硬编码密钥。 |
| formData | Object（见用法） | {} | 额外 multipart 字段对象。 |
| timeout | number | 60000 | 上传超时，单位 ms。 |
| chooseFiles | Function（见用法） | null | 可选 () => Promise<MoriPickedFile[]>，替换默认图片选择器。 |
| beforeRead | Function（见用法） | null | 可选 (files:MoriPickedFile[]) => Promise<boolean>，返回 false 拒绝本批。 |
| resolveUrl | Function（见用法） | null | 可选 (response:string) => string，解析远端 URL；抛错视为业务失败。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`afterRead`、`delete`、`oversize`、`error`、`cancel`、`progress`、`success`、`preview`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`choose, submit, retry, remove, clear`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

上传的 iOS 跟踪编号为 MORI-UP-IOS-01 至 06；入口 `platform/upload.uts`，详见 [平台适配跟踪](../platform-adaptation.md)。

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。

## 文件类型与状态

从 `@/uni_modules/mori-ui/upload.uts` 导入：

```ts
type MoriPickedFile = { path: string; name: string; size: number; type: string }
type MoriUploadFile = {
  id: string;       // 唯一、稳定，不使用数组下标
  url: string;      // 本地路径；resolveUrl 成功后才是远端 URL
  name: string;
  size: number;    // 字节
  status: string;  // ready / uploading / success / error
  progress: number;
  message: string;
}
```

回显已有图片也需完整字段，例如 `{ id: 'server-1', url: 'https://你的域名.example/photo.jpg', name: 'photo.jpg', size: 1024, status: 'success', progress: 100, message: '' }`，替换为有效地址。组件不会重复上传 success 文件。

状态为 `ready → uploading → success/error`，error 可重试。状态变化发出新的模型数组，业务应接收 v-model 更新。删除、clear、卸载会中断相关任务，过期回调不会恢复已删除项。本版没有后台任务、分片或断点续传。

## 事件载荷

| 事件 | 载荷 | 触发时机 |
|---|---|---|
| update:modelValue | MoriUploadFile[] | 选择、进度、结果或删除后的完整列表 |
| afterRead | MoriUploadFile[] | 本批通过检查并接纳的文件；可能为空，此时未上传 |
| delete | MoriUploadFile | 单项移除后；clear 不逐项发 delete |
| oversize | MoriPickedFile | 路径或大小检查失败的文件，error 说明具体原因 |
| error | string | 选择、校验、请求或响应处理错误 |
| cancel | 无 | 默认系统选择器被用户取消；不发 error |
| progress | MoriUploadFile | 进度更新 |
| success | (file:MoriUploadFile, response:string) | HTTP 2xx 且 resolveUrl（若提供）通过；第二参数是原始响应 |
| preview | MoriUploadFile | 点击缩略图；previewImage=false 仍发出 |

## 实例方法

| 方法 | 参数 / 返回 | 行为 |
|---|---|---|
| choose() | 无 / void | 选择文件；正在选择、禁用或满额时忽略 |
| submit() | 无 / void | 提交所有 ready/error；未配置 uploadUrl 发 error |
| retry(id) | string / void | 提交指定 ready/error 文件，重复调用不会重复请求 |
| remove(id) | string / void | 中断并删除一项；disabled 或 deletable=false 时忽略 |
| clear() | 无 / void | 中断全部任务、待完成选择并清空；disabled 时忽略 |

使用 `ref<MoriUploadInstance | null>(null)` 在挂载后调用。删除只修改本地模型，不会删除服务器文件，服务端删除应由业务处理 delete。

## 读取前检查和自定义选择器

```ts
import { MoriPickedFile } from '@/uni_modules/mori-ui/upload.uts'
async function beforeRead(files: MoriPickedFile[]): Promise<boolean> {
  // 示例：当前业务服务不接受 HEIC。
  return !files.some((file: MoriPickedFile): boolean =>
    file.name.toLowerCase().endsWith('.heic'))
}
```

绑定 `:before-read="beforeRead"`。返回 false 静默拒绝本批，异常发 error；既有文件保留。maxCount 限制最终接纳数量，默认相册单次最多 9 个；超出数量不会加入。maxSize 默认 10 MiB，0 不限制。

`chooseFiles: () => Promise<MoriPickedFile[]>` 替换整个选择过程，可接 iOS 转码或原生文档选择。路径必须能被 uni.uploadFile 读取，name/size/type 必须对应处理后的真实文件。空数组表示未选择；Promise 拒绝会发 error。默认缩略图与预览只适用于图片；其他文件需 previewImage=false 并接管 preview，不宣称自带 PDF/视频预览。

## 服务端协议

name 是 multipart 文件字段名（默认 file），与后端一致。header / formData 为 UTSJSONObject，timeout 为毫秒。不要手动设置 multipart boundary，让 uni.uploadFile 生成。

HTTP 非 2xx 进入 error。resolveUrl 必须检查业务是否成功后返回远端地址；空字符串或抛错也会进入 error。省略 resolveUrl 时 2xx 只代表传输成功，url 继续是本地路径，业务应在 success 中处理响应。鉴权、CORS、微信合法域名和 iOS 证书/ATS 需要真实服务验证。
