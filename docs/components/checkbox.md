# 复选框 mori-checkbox

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

独立 boolean 多选项，支持整行点击和键盘操作。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-checkbox v-model="accepted" label="我已阅读使用说明" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const accepted = ref(false)
</script>
```

## 状态与进阶使用

组件自绘圆角方框和勾；color 可覆盖选中背景。disabled 禁止事件，仍保留选中外观。多个相关选项建议改用 CheckboxGroup 管理 string[]，不要用本组件的 boolean 假装组值。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 是否选中 |
| indeterminate | boolean | false | 显示半选短横线；父级管理。 |
| label | string | 空 | 可点击的说明文字，建议始终提供 |
| color | string | 空 | 选中填充色；为空继承主题品牌色 |
| disabled | boolean | false | 禁止切换 |

事件：`update:modelValue(boolean)`、`change(boolean)`。方框为 16px、5px 圆角，选中填充主题色，Lucide 勾图标自动选择黑白；整行可点击，H5 支持 Enter / Space，禁用时退出 Tab 顺序。勾通过 opacity / transform 过渡 160ms，尺寸与行布局保持稳定。此组件保持单项 boolean 模型；数组多选使用 `mori-checkbox-group`。

## 半选状态

indeterminate:boolean 默认 false，显示短横线并设置 aria-checked=mixed。点击仍发出下一 boolean 值；半选状态由父级计算，组件不会自行修改 indeterminate。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
