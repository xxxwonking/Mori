# 表单 mori-form

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

同步校验顶层业务模型；提交由调用方决定。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-form ref="form" :model="model" :rules="rules"><mori-form-item name="name" label="称呼" required><mori-input v-model="name" /></mori-form-item></mori-form>
  <mori-button label="校验" @click="validate" />
</template>

<script setup lang="uts">
import { ref, computed } from 'vue'
import { MoriFormRule, MoriFormInstance } from '@/uni_modules/mori-ui/validation.uts'
const name = ref('')
const model = computed((): UTSJSONObject => ({ name: name.value } as UTSJSONObject))
const form = ref<MoriFormInstance | null>(null)
const rules: MoriFormRule[] = [{ name: 'name', required: true, message: '请填写称呼' }]
function validate() { const result = form.value?.validate(); if (result?.valid) { /* 提交 model */ } }
</script>
```

## 状态与进阶使用

validate() 更新全表错误；validateField(name) 只更新一个字段，不能当作全表有效结论；clearValidate(name?) 清理错误，不重置值。规则与模型及 FormItem.name 必须一致。目前为同步顶层规则，不支持异步 validator、嵌套路径或自动 resetFields。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| model | UTSJSONObject | 必填 | 顶层字段及其当前值；表单不修改业务数据 |
| rules | MoriFormRule[] | [] | 按数组顺序执行，同一字段只保留第一个错误 |

默认 slot 放置 FormItem、控件和业务按钮。`validate(result)` 事件在调用 `validate()` 或 `validateField()` 后触发；不会自动提交或调用接口。

通过模板 ref 调用以下同步方法；`MoriFormInstance`、规则和结果类型从 `@/uni_modules/mori-ui/validation.uts` 导入。

| 方法 | 返回值 | 行为 |
|---|---|---|
| validate() | MoriValidationResult | 校验全部规则并替换全部错误 |
| validateField(name: string) | MoriValidationResult | 只校验指定字段，保留其他字段的错误；空 name 等同于 validate |
| clearValidate(name?: string) | void | 指定非空 name 清除该字段错误；省略或空字符串清除全部错误；不修改 model |

`MoriValidationResult` 为 `{ valid: boolean, errors: MoriFieldError[] }`；每项错误为 `{ name: string, message: string }`。`validateField` 返回的 valid/errors 只表示本次指定字段，不能据此判断整个表单通过。

```ts
export type MoriFormRule = {
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  validator?: (value: any | null) => string;
}
```

规则语义：

- `name` 是 model 顶层键，同时与 FormItem 的 name 对应。不解析 `profile.name`、数组路径或嵌套对象。
- `required` 将 null／缺失值、空白字符串、空数组、false 视为空；数字 0 有效。同意协议可以用 boolean 的 required 规则。
- 非必填空值跳过该条规则的长度、正则和自定义校验。需要验证空值时显式使用 required。
- minLength/maxLength 作用于字符串长度或数组项数；字符串使用 JavaScript／UTS 的 UTF-16 长度。其他非空类型不能通过长度限制。
- pattern 是传给 `new RegExp(pattern)` 的字符串，不是带 `/` 分隔符的表达式。规则由开发者提供，应使用有效正则。
- validator 同步返回错误文字；空字符串表示通过。内置约束先执行，失败后不再执行该条自定义校验。内置约束使用 message，未设置时为“请检查此项内容”。

当前不支持 Promise／异步校验、自动输入／失焦校验、嵌套字段或 `resetFields`。由业务在提交、change 或 blur 时主动调用方法；修改值后不会隐式清除旧错误。完整组合示例见 [使用手册](../user-guide.md#8-使用表单基础组件)。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
