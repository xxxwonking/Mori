# 选项选择器 mori-picker

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

单列选项选择器，显隐与选中值使用两个模型。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="选择提醒方式" @click="show = true" />
  <mori-picker v-model="value" v-model:show="show" title="提醒方式" :options="options" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriChoiceOption } from '@/uni_modules/mori-ui/selection.uts'
const show = ref(false)
const value = ref('')
const options: MoriChoiceOption[] = [{ label: '站内消息', value: 'message' }, { label: '邮件', value: 'email' }]
</script>
```

## 状态与进阶使用

每次打开从 modelValue 初始化临时选择；点取消/遮罩/Escape 不提交。confirm(value:string) 仅在有效且未禁用/加载时触发，随后请求 show=false；取消发 cancel。外部 modelValue 在打开期间改变会替换草稿。loading 显示等待，空列表显示空状态且禁止确认。ref.confirm()/cancel() 复用同一规则。当前为单列，不提供级联或滚轮多列。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | "" | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| show | boolean | false | 弹层显示状态，使用 v-model:show 绑定。 |
| title | string | "请选择" | 标题；弹层同时用作可访问名称。 |
| options | Array（见用法） | [] | MoriChoiceOption[]，包含 label、value、disabled?。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| loading | boolean | false | 加载状态；对应组件会限制操作。 |
| confirmText | string | "确认" | 确认按钮文字。 |
| cancelText | string | "取消" | 取消按钮文字；ActionSheet 为空时隐藏按钮。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`update:show`、`confirm`、`cancel`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`confirm, cancel`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
