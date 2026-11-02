# 瀑布流 mori-waterfall

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

根据已知高度将内容放入当前最短列。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-waterfall :items="items" :columns="2" />
</template>

<script setup lang="uts">
import { MoriDataItem } from '@/uni_modules/mori-ui/advanced.uts'
const items: MoriDataItem[] = [{ id: 'a', label: '晨间（示例）', height: 170, src: '/static/mori-demo.svg' }, { id: 'b', label: '午后', height: 220, src: '/static/mori-demo.svg' }, { id: 'c', label: '日落', height: 150, src: '/static/mori-demo.svg' }, { id: 'd', label: '夜色', height: 130, src: '/static/mori-demo.svg' }]
</script>
```

## 状态与进阶使用

items 为 MoriDataItem[]，height 是整个卡片高度，默认 160px；columns 1–6。原数组不变，列内顺序稳定。图片高度不用于自动测量；异步图片应事先提供卡片 height，动态测高和虚拟化不属于此版本。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| items | MoriDataItem[] | [] | 展示数据，字段见上文。 |
| columns | number | 2 | 具体语义见上文与示例。 |
| gap | number | 12 | 具体语义见上文与示例。 |

## 事件、插槽与方法

默认插槽 {item} 定制卡片内容；无事件或方法。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
