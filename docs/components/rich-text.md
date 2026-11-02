# 富文本展示 mori-rich-text

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

把结构化内容转换为宿主 rich-text 节点。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-rich-text :blocks="blocks" />
</template>

<script setup lang="uts">
import { MoriRichBlock } from '@/uni_modules/mori-ui/advanced.uts'
const blocks: MoriRichBlock[] = [{ type: 'heading', text: '让内容清晰可读' }, { type: 'paragraph', text: '这是结构化富文本示例。文字作为文本节点呈现，不执行 HTML。' }, { type: 'bold', text: '支持标题、段落、强调、引用与图片。' }, { type: 'image', src: '/static/mori-demo.svg', text: 'Mori 示例图' }]
</script>
```

## 状态与进阶使用

blocks 为 MoriRichBlock[]：type 支持 heading/paragraph/bold/italic/quote/image；text 始终作为文本节点，未知 type 按段落处理。image.src 仅接受 https 或以单斜杠开头的本地路径。刻意不接受任意 HTML、脚本、style 或链接协议；这是结构化展示，不是富文本编辑器。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| blocks | MoriRichBlock[] | [] | 具体语义见上文与示例。 |
| selectable | boolean | true | 具体语义见上文与示例。 |

## 事件、插槽与方法

没有公开方法、事件或插槽。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
