# 动作面板 mori-action-sheet

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

显示一组操作，支持说明、禁用和加载选项。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="选择操作" @click="show = true" />
  <mori-action-sheet v-model="show" title="更多操作" :actions="actions" @select="select" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriAction } from '@/uni_modules/mori-ui/actions.uts'
const show = ref(false)
const actions: MoriAction[] = [{ label: '收藏', value: 'save' }, { label: '删除', value: 'remove', danger: true }]
function select(action: MoriAction) { /* 按 action.value 执行业务 */ }
</script>
```

## 状态与进阶使用

select(action:MoriAction) 返回完整条目；默认 closeOnSelect=true。异步操作可设为 false，并让相应 action.loading=true，业务成功后关闭 show。cancel 无参数，取消按钮、遮罩和 Escape 都走取消。cancelText 为空隐藏取消按钮。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | boolean | false | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| title | string | "" | 标题；弹层同时用作可访问名称。 |
| description | string | "" | 补充说明。 |
| actions | Array（见用法） | [] | MoriAction[]，包含 label、value、description?、disabled?、loading?、danger?。 |
| cancelText | string | "取消" | 取消按钮文字；ActionSheet 为空时隐藏按钮。 |
| closeOnSelect | boolean | true | 选择成功后请求关闭。 |
| closeOnOverlayClick | boolean | true | 点击遮罩时允许请求关闭。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`select`、`cancel`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
