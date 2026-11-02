# 拖拽排序 mori-draggable

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

在固定行高列表中进行触摸排序。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-text text="触摸拖动条目，或使用上移、下移按钮" tone="muted" /><mori-draggable v-model="items" /><mori-text :text="items.map((item: MoriDataItem): string => item.label).join(' → ')" tone="muted" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriDataItem } from '@/uni_modules/mori-ui/advanced.uts'
const items = ref<MoriDataItem[]>([{ id: 'a', label: '设计' }, { id: 'b', label: '开发' }, { id: 'c', label: '测试' }])
</script>
```

## 状态与进阶使用

modelValue 为 MoriDataItem[]，id 唯一。itemHeight 包含边框；触摸整行并上下移动后松开提交，新顺序触发 change(items,from,to)。触摸取消不提交；按钮支持键盘替代。此版不做跨列表拖拽或边缘自动滚动，长列表应分组。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | MoriDataItem[] | [] | 受控值，类型及提交规则见上文。 |
| itemHeight | number | 52 | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

默认插槽 {item,index}；没有公开实例方法。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
