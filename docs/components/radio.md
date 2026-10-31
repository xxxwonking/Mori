# 单选框 mori-radio

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

单个 string 值选项；业务需提供与同组一致的 modelValue。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-radio v-model="choice" value="design" label="设计师" />
  <mori-radio v-model="choice" value="dev" label="开发者" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const choice = ref('design')
</script>
```

## 状态与进阶使用

点击当前选中项不取消，change(string) 只在选择变化时触发。多个选项推荐 RadioGroup 获得组级标签、禁用与 H5 键盘导航。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前选中值 |
| value | string | 必填 | 本项值；与 v-model 相等时选中 |
| label | string | 空 | 显示文字与无障碍名称；空时名称回退到 value |
| color | string | 空 | 选中色；空时使用全局 primary |
| disabled | boolean | false | 禁止选择并退出 Tab 顺序 |
| controlId | string | 空 | 控件 ID；通常由 RadioGroup 管理 |
| tabIndex | number | 0 | H5 键盘 Tab 顺序；通常由 RadioGroup 管理 |

事件：`update:modelValue(value: string)`、`change(value: string)`。再次点击已选项不会取消选中或重复发出更新；禁用时不更新。多个选项推荐使用 RadioGroup，以获得组语义和方向键操作。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
