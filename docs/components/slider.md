# 滑块 mori-slider

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

滑动选择数值，区分拖动中的反馈与最终提交。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-slider v-model="volume" :min="0" :max="100" :step="5" show-value label="音量" @change="saveVolume" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const volume = ref(40)
function saveVolume(value: number) { /* 保存最终音量 */ }
</script>
```

## 状态与进阶使用

changing(value:number) 在拖动过程中触发，同时更新模型；change(value:number) 在结束时触发。底层使用 uni-app x slider，手势、键盘与部分样式由平台实现。max<=min 时有效最大值为 min+1；步长必须正数，否则按 1。建议 expensive 业务放到 change。

## 属性

H5 的真实 range input 会同步 label 与 disabled，支持系统键盘方向键。轨道/填充随主题即时更新；拇指使用主色（或 color 覆盖），避免深色表面上不可辨。适配集中在 platform/slider.uts，原生交互仍需设备验证。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 0 | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| min | number | 0 | 允许的下界。 |
| max | number | 100 | 允许的数值上界，异常边界处理见状态说明。 |
| step | number | 1 | 正数步长，数值以 min 为对齐起点。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| showValue | boolean | false | 显示 slider 当前数值。 |
| color | string | "" | 实例颜色覆盖，空字符串继承主题。 |
| label | string | "滑块" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`、`changing`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
