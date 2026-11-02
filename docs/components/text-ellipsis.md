# 文本展开 mori-text-ellipsis

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

按行截断长文字并展开全文。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-text-ellipsis :rows="3" :text="content" />
</template>

<script setup lang="uts">
const content = 'Mori UI 使用中性灰与清晰蓝，让内容本身更容易阅读。组件提供统一的尺寸、状态与主题。长段落可以先展示摘要，再由读者展开全文。这里是一段用于验证多行截断的示例文字，实际项目中可替换为介绍、公告或帮助内容。展开与收起保留原始文本，并可通过键盘操作。'
</script>
```

## 状态与进阶使用

rows 默认 3，单行高 22px。change(expanded) 返回展开状态，替换 text 会收起。expandable=false 隐藏按钮；此版按钮在非空文字时始终显示，不依赖 DOM 测量溢出。H5 使用多行省略；原生不支持 line-clamp 时按最大高度裁切，需要设备验收。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | '' | 具体语义见上文与示例。 |
| rows | number | 3 | 具体语义见上文与示例。 |
| expandable | boolean | true | 具体语义见上文与示例。 |
| expandText | string | '展开全文' | 具体语义见上文与示例。 |
| collapseText | string | '收起' | 具体语义见上文与示例。 |
| selectable | boolean | true | 具体语义见上文与示例。 |

## 事件、插槽与方法

没有公开方法或插槽。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
