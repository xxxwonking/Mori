# 评分 mori-rate

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

使用整星数值表达评分，默认共 5 项。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-rate v-model="rating" :count="5" allow-clear label="体验评分" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const rating = ref(0)
</script>
```

## 状态与进阶使用

count 限制 1–10，modelValue 是 0–count 的整数。allowClear=true 时再次点击当前分数清为 0。readonly 禁止修改但保持普通可读外观，disabled 同时降低透明度。change(value:number) 只在变化时触发，不支持半星。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 0 | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| count | number | 5 | 评分项数量，限制 1–10。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| readonly | boolean | false | 只读，保持普通外观。 |
| allowClear | boolean | false | 重复点击当前评分时清为 0。 |
| label | string | "评分" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
