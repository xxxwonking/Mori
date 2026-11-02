# 二维码 mori-qrcode

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

把文字编码为可扫描的 QR Code。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-input v-model="value" label="二维码内容" /><mori-qrcode :value="value" caption="扫码查看内容" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const value = ref('https://github.com/xxxwonking/Mori')
</script>
```

## 状态与进阶使用

使用 Nayuki MIT 算法，纠错级别至少 M，并保留四模块静区和黑白对比。value 最多 512 个 UTF-16 字符；过长／异常输入显示错误。size 120–600px，长内容应选择足够大的尺寸。ready(dataURL) 返回 SVG 图像，error(message) 包括编码／显示错误。此版不提供 Logo 或自定义配色，以保留可扫描性。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| value | string | '' | 具体语义见上文与示例。 |
| size | number | 200 | 展示尺寸，单位 px。 |
| label | string | '二维码' | 可见标签或可访问名称。 |
| caption | string | '' | 具体语义见上文与示例。 |

## 事件、插槽与方法

没有公开实例方法或插槽。便携编码函数见 qrcode.uts；上游源码与 MIT 声明在 vendor/qrcodegen.uts。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
