# 表单 mori-form

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

同步与异步校验、嵌套字段和初始值重置；提交由调用方决定。

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

validate() 更新全表错误；validateField(name) 只更新一个字段，不能当作全表有效结论；clearValidate(name?) 清理错误，不重置值。规则与模型及 FormItem.name 必须一致。异步规则请调用 validateAsync / validateFieldAsync；同步方法遇到 asyncValidator 会抛错，避免漏校验。

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
  asyncValidator?: (value: any | null) => Promise<string>;
}
```

规则语义：

- `name` 与 FormItem.name 一致；优先匹配完整键，其次解析 profile.name / items[0].name。禁止访问原型链特殊路径。
- `required` 将 null／缺失值、空白字符串、空数组、false 视为空；数字 0 有效。同意协议可以用 boolean 的 required 规则。
- 非必填空值跳过该条规则的长度、正则和自定义校验。需要验证空值时显式使用 required。
- minLength/maxLength 作用于字符串长度或数组项数；字符串使用 JavaScript／UTS 的 UTF-16 长度。其他非空类型不能通过长度限制。
- pattern 是传给 `new RegExp(pattern)` 的字符串，不是带 `/` 分隔符的表达式。规则由开发者提供，应使用有效正则。
- validator 同步返回错误文字；空字符串表示通过。内置约束先执行，失败后不再执行该条自定义校验。内置约束使用 message，未设置时为“请检查此项内容”。

不自动执行输入／失焦校验。由业务在提交、change 或 blur 时主动调用方法；修改值后不会隐式清除旧错误。完整组合示例见 [使用手册](../user-guide.md#8-使用表单基础组件)。

## 异步、嵌套与重置

asyncValidator 在内置约束和同步 validator 通过后执行，空字符串表示通过；拒绝会转为 message 或默认失败消息。规则配置错误／同步 validator 抛错仍会 reject，调用方应 try/finally 清理业务等待状态。

| 方法 | 返回值 | 说明 |
|---|---|---|
| validateAsync() | Promise&lt;MoriValidationResult&gt; | 校验全表并更新错误 |
| validateFieldAsync(name) | Promise&lt;MoriValidationResult&gt; | 只更新目标字段错误 |
| resetFields() | UTSJSONObject | 返回初始 JSON 模型并发出 update:model / reset，不直接修改 props |
| setInitialValues(model) | void | 以 JSON 深拷贝替换重置基准，不改变当前值 |

model/rules 变化、新一轮校验、清除错误、重置或卸载使旧请求失效；失效请求返回 `{valid:false,errors:[],stale:true}`，不发 validate 事件或覆盖当前错误。所有异步方法共享一代请求，后一次字段校验也会使前一次失效，多个字段并发时请改用 validateAsync。validating 为暴露的等待状态；调用方仍须处理 stale 后的再次提交。

初始值在挂载时保存，异步加载编辑数据后调用 setInitialValues。model 应为 JSON 数据（不含日期对象、函数和循环引用）。使用 v-model:model 可接收 resetFields 的回写；使用 computed model 时在 reset 事件内更新业务 ref：

```vue
<template>
  <mori-form ref="form" :model="model" :rules="rules" @reset="applyReset"><mori-form-item name="profile.name" label="用户名" required><mori-input v-model="name" placeholder="试试 mori，再换一个名字" /></mori-form-item></mori-form>
  <mori-text text="本地模拟异步查重，mori 为已占用的示例名称。" tone="muted" />
  <view style="display:flex;flex-direction:row;gap:8px"><mori-button label="异步校验" :loading="pending" @click="validate" /><mori-button label="重置" variant="outline" @click="reset" /></view>
  <mori-text :text="message" />
</template>
<script setup lang="uts">
import { ref, computed } from 'vue'
import { MoriFormRule, MoriFormInstance } from '@/uni_modules/mori-ui/validation.uts'
const name = ref(''), pending = ref(false), message = ref('')
const form = ref<MoriFormInstance | null>(null)
const model = computed((): UTSJSONObject => ({ profile: { name: name.value } } as UTSJSONObject))
const rules: MoriFormRule[] = [{ name: 'profile.name', required: true, message: '请填写用户名', asyncValidator: (value: any | null): Promise<string> => new Promise<string>((resolve) => { setTimeout(() => resolve(value == 'mori' ? '名称已占用，请换一个' : ''),350) }) }]
async function validate() { pending.value = true; message.value = ''; try { const result = await form.value!.validateAsync(); message.value = result.stale == true ? '内容已变化，请重新校验' : result.valid ? '校验通过' : '请修改提示项' } finally { pending.value = false } }
function applyReset(value: UTSJSONObject) { name.value = (value['profile'] as UTSJSONObject)['name'] as string; message.value = '' }
function reset() { form.value?.resetFields() }
</script>
```

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
