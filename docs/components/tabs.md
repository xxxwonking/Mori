# 标签页 mori-tabs

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

用稳定字符串标识切换分类，内容由默认 slot 提供。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-tabs v-model="tab" :items="items" label="订单分类"><mori-text :text="tab == 'all' ? '全部订单' : '已完成订单'" /></mori-tabs>
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriNavItem } from '@/uni_modules/mori-ui/navigation.uts'
const tab = ref('all')
const items: MoriNavItem[] = [{ label: '全部', value: 'all' }, { label: '已完成', value: 'done', badge: '3' }]
</script>
```

## 状态与进阶使用

items 的 value 必须唯一。change(value:string) 仅在值变化时触发；clickTab(value:string) 在每次有效点击触发。条目可 disabled，整组也可 disabled。H5 左右箭头跳过禁用项并循环。组件不发请求、不自动构造内容面板，也不把空 modelValue 自动改成第一项；初始值由业务给定。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | "" | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| items | Array（见用法） | [] | 条目数组，value 必须唯一；结构见示例。 |
| label | string | "标签页" | 字段、操作或内容的名称；同时用于可访问性。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`、`clickTab`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
