# 虚拟列表 mori-virtual-list

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

用固定行高渲染长列表，可滚动定位。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-text text="1,000 条示例数据，只渲染当前可见行" tone="muted" /><mori-virtual-list ref="list" :items="items" :height="264" :item-height="44" /><mori-button label="跳到第 500 项" variant="outline" @click="list?.scrollToIndex(499)" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriDataItem, MoriVirtualListInstance } from '@/uni_modules/mori-ui/advanced.uts'
const list = ref<MoriVirtualListInstance | null>(null)
const items: MoriDataItem[] = []
for (let i = 0; i < 1000; i++) items.push({ id: 'item-' + i, label: '示例条目 ' + (i + 1) })
</script>
```

## 状态与进阶使用

items 为 MoriDataItem[]，id 必须唯一。itemHeight 包含 padding 与边框，插槽必须遵守固定高度；不支持动态测高。height 为视口高度，overscan 为上下缓冲行数。scroll(top) 返回像素；rangeChange([start,end]) 的 end 不包含在区间中。总 DOM 行数随视口和缓冲变化，不随全部条数增长。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| items | MoriDataItem[] | [] | 展示数据，字段见上文。 |
| itemHeight | number | 44 | 具体语义见上文与示例。 |
| height | number | 320 | 显示区域高度，单位 px。 |
| overscan | number | 3 | 具体语义见上文与示例。 |

## 事件、插槽与方法

默认插槽 {item,index} 的 index 为原数据下标。实例 scrollToIndex(index): `Promise<void>`，定位被限制在有效滚动范围。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
