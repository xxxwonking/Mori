# 描述列表 mori-descriptions

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

按标签和值展示详情资料。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-descriptions title="项目资料（示例）" :items="items" />
</template>

<script setup lang="uts">
import { MoriDescriptionItem } from '@/uni_modules/mori-ui/advanced.uts'
const items: MoriDescriptionItem[] = [{ label: '项目', value: 'Mori UI' }, { label: '技术', value: 'uni-app x / UTS' }, { label: '主题', value: '跟随系统，可手动选择浅色或深色' }]
</script>
```

## 状态与进阶使用

items 每项为 {label,value}；空值显示破折号，长文字换行。labelWidth 控制标签列宽，应保留内容空间。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| title | string | '' | 标题／可访问名称。 |
| items | MoriDescriptionItem[] | [] | 展示数据，字段见上文。 |
| labelWidth | number | 88 | 具体语义见上文与示例。 |

## 事件、插槽与方法

默认插槽参数 {item,index} 替换值；无事件或公开方法。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
