# 数字键盘 mori-number-keyboard

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-password-input :value="value" @focus="show = true" /><mori-number-keyboard v-model="value" v-model:show="show" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const value = ref('')
const show = ref(true)
</script>
```

## 状态与进阶使用

内联数字键盘，可放入 Popup。字符串保留前导零；maxLength 限制总长度。extraKey 支持 . 或 X，空值显示清空；小数点只允许一个。input(key) 为新增键，delete(value) 为删除／清空后的值，confirm(value) 同时请求隐藏。快速连续点击基于本地草稿，外部模型更新会同步。不是系统安全键盘，不加密、不提交、不验证密码。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | '' | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| show | boolean | true | 受控显示状态，可用 v-model:show。 |
| title | string | '数字键盘' | 标题或组件名称。 |
| maxLength | number | 6 | 允许输入的最大字符数。 |
| extraKey | string | '' | 额外键：空、. 或 X。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| confirmText | string | '完成' | 确认按钮文案。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'update:show', 'input', 'delete', 'confirm'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
