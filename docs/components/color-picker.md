# 颜色选择 mori-color-picker

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

预设色板和十六进制颜色输入。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-color-picker v-model="color" /><mori-button label="颜色效果" :color="color" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const color = ref('#0066D6')
</script>
```

## 状态与进阶使用

支持 #RGB 和 #RRGGBB，确认时规范为大写 #RRGGBB，触发 change(color)。非法值保留草稿并触发 invalid(raw)。不支持透明度、HSV 面板或吸管；预设 colors 也应为有效 hex。

确认先接收 blur 的最终文本，成功后重建输入编辑器以清除宿主节流缓存；键盘确认会结束本次编辑。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | '#0066D6' | 受控值，类型及提交规则见上文。 |
| colors | string[] | ['#0066D6', '#6857D9', '#C03045', '#B85A00', '#25835A', '#1D2430', '#FFFFFF'] | 具体语义见上文与示例。 |
| label | string | '十六进制颜色' | 可见标签或可访问名称。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

没有公开方法或插槽。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
