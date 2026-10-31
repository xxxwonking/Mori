# 步进器 mori-stepper

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

限制范围的数值增减，也可手动输入。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-stepper ref="stepper" v-model="quantity" :min="0" :max="10" :step="0.5" label="数量" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriStepperInstance } from '@/uni_modules/mori-ui/input.uts'
const quantity = ref(1)
const stepper = ref<MoriStepperInstance | null>(null)
</script>
```

## 状态与进阶使用

step<=0 按 1；数值以 min 为原点按步长对齐，并钳制上下限；小数结果保留至 8 位以消除浮点误差。disableInput 只禁止手动编辑，disabled 禁用全部操作。ref.increase()/decrease() 支持方法调用；方法触达边界发 overlimit("min"/"max")，已禁用的界面按钮不触发点击。change(value:number) 返回规范化值。

## 属性

手动编辑保留草稿，可输入负号、小数点等中间状态；有效数值更新模型。失焦或键盘确认时按步长和上下界规范显示，空值／无效草稿恢复最近有效模型。例如最大值 5 时输入 99，失焦显示 5；step=0.5 时输入 0.7，失焦显示 0.5。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 1 | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| min | number | 0 | 允许的下界。 |
| max | number | 9999 | 允许的数值上界，异常边界处理见状态说明。 |
| step | number | 1 | 正数步长，数值以 min 为对齐起点。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| disableInput | boolean | false | 只禁止步进器手动输入，加减仍可用。 |
| label | string | "" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`、`overlimit`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`increase, decrease`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
