# 图片裁剪 mori-image-cropper

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

预览并导出真实 PNG 裁剪结果。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-image-cropper src="/static/mori-demo.svg" @confirm="result = $event" /><mori-text v-if="result.length > 0" text="已导出裁剪图片" /><mori-image v-if="result.length > 0" :src="result" alt="裁剪导出结果" height="120px" mode="aspectFit" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const result = ref('')
</script>
```

## 状态与进阶使用

src 为本地或允许跨域的图片地址；ratio 为宽高比（0.25–4），outputWidth 为输出像素宽（64–2048）。三个滑块调整缩放、水平位置和垂直位置；采样区域不会超出原图。change([x,y,w,h]) 返回源图裁剪区域；confirm(dataURL) 为 PNG。更换源图时清空旧结果，过期加载不会覆盖当前图片。失败触发 error(message)。此版提供滑块定位，不含旋转或自由裁剪框。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| src | string | '' | 具体语义见上文与示例。 |
| ratio | number | 1 | 具体语义见上文与示例。 |
| outputWidth | number | 400 | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

实例 reset() 和 exportImage(): string。失败／未就绪返回空字符串；disabled 阻止交互与导出。远程图片必须允许 CORS，否则浏览器会阻止导出。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
