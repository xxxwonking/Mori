# 搜索 mori-search

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

组合单行输入和搜索动作，不内置过滤或请求。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-search v-model="query" placeholder="搜索组件" @search="search" @clear="clear" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const query = ref('')
function search(value: string) { /* 用 value 请求或过滤 */ }
function clear() { /* 重置业务结果 */ }
</script>
```

## 状态与进阶使用

点击操作按钮或输入键盘确认时发 search(value:string)；输入过程发 change(value:string)。clear 无参数，模型同时更新为空字符串；不会自动重新 search。actionText 修改按钮文字。需要防抖时在业务 change 回调实现。

快速输入后直接确认或点击搜索会使用宿主的最终文本，并补齐模型更新；不会等待底层输入节流结束后才提交。失焦补齐新值时也会发 change，未改变的值不重复通知。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | "" | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| placeholder | string | "搜索内容" | 内容为空时的输入提示。 |
| label | string | "" | 字段、操作或内容的名称；同时用于可访问性。 |
| actionText | string | "搜索" | 搜索动作按钮文字。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`、`search`、`clear`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
