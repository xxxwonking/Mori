# 复选框组 mori-checkbox-group

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

使用唯一 string value 的选项数组管理多选。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-checkbox-group v-model="selected" :options="options" :max="2" label="关注方向" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriChoiceOption } from '@/uni_modules/mori-ui/selection.uts'
const selected = ref<string[]>([])
const options: MoriChoiceOption[] = [{ label: '设计', value: 'design' }, { label: '开发', value: 'dev' }, { label: '暂不可用', value: 'later', disabled: true }]
</script>
```

## 状态与进阶使用

min 限制取消行为，max>0 限制增加行为；达到上限仍可取消已选项。change(string[]) 返回新数组，不修改传入数组。组级 disabled 与条目 disabled 同时生效。min 不会自动补齐选中项，必填应交给 Form 校验。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string[] | [] | 已选 value 数组 |
| options | MoriChoiceOption[] | [] | value 唯一的字符串选项列表 |
| label | string | 空 | 独立使用时的标题；FormItem 中优先用父级标题 |
| color | string | 空 | 选中色 |
| disabled | boolean | false | 禁用整组 |
| direction | string | vertical | vertical / horizontal |
| min | number | 0 | 到达最小数量后阻止继续取消；不自动补选 |
| max | number | 0 | 最大数量；0 表示不限制 |

事件：`update:modelValue(values: string[])`、`change(values: string[])`。有效操作发出新的、去重的数组，不直接修改传入数组。禁用项及受 min/max 阻止的操作不发出更新；达到 max 后仍可取消已选项。预置值超过 max 时允许逐项减少，不会自动截断业务传入值。请传入非负整数边界，max 非零时应不小于 min；模型值应对应 options。

选择数量限制用于控制操作，提交必选仍应在 Form rules 中配置 required／minLength。FormItem 的 required 标记不自动设置组的 min。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
