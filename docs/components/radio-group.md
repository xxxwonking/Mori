# 单选框组 mori-radio-group

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

以 options 提供互斥选项，组内最多一个 string 值。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-radio-group v-model="role" :options="options" label="身份" direction="horizontal" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriChoiceOption } from '@/uni_modules/mori-ui/selection.uts'
const role = ref('')
const options: MoriChoiceOption[] = [{ label: '设计师', value: 'designer' }, { label: '开发者', value: 'developer' }]
</script>
```

## 状态与进阶使用

空字符串表示未选中；组件不替业务自动选择。direction=horizontal 可横向换行，默认 vertical。H5 箭头键跳过禁用项并循环；FormItem 内可继承标签和校验语义。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前选项值 |
| options | MoriChoiceOption[] | [] | 选项列表；value 必须是唯一字符串 |
| label | string | 空 | 独立使用时的标题；FormItem 中优先用父级标题 |
| color | string | 空 | 所有选项的选中色 |
| disabled | boolean | false | 禁用整组 |
| direction | string | vertical | vertical / horizontal；横向可换行 |

事件：`update:modelValue(value: string)`、`change(value: string)`。选项禁用时不能选择；模型由使用方更新。组内 H5 采用一个 Tab 入口，方向键选择下一／上一可用项并循环，跳过禁用项，Enter／Space 激活当前项。

RadioGroup 与 CheckboxGroup 共用的类型从 `@/uni_modules/mori-ui/selection.uts` 导入：

```ts
export type MoriChoiceOption = {
  label: string;
  value: string;
  disabled?: boolean;
}
```

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
