# 折叠面板 mori-collapse

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

管理展开项数组，适合 FAQ 和补充说明。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-collapse v-model="opened" :items="items" accordion />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriCollapseItem } from '@/uni_modules/mori-ui/input.uts'
const opened = ref<string[]>([])
const items: MoriCollapseItem[] = [{ label: '如何使用？', value: 'usage', content: '复制模块后通过 easycom 使用。' }]
</script>
```

## 状态与进阶使用

每项 value 唯一，content 为默认正文；也可提供与 value 同名的 slot。accordion=true 时每次新展开只保留该项，点击已展开项可全部收起。外部数组仍由业务控制，不自动纠正初始多个值。change(string[]) 返回新数组，禁用项不响应。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string[] | [] | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| items | Array（见用法） | [] | 条目数组，value 必须唯一；结构见示例。 |
| accordion | boolean | false | 新展开时仅保留当前项。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`change`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

没有公开实例方法。

插槽是以条目 `value` 命名的动态具名插槽，不提供 default 插槽。例如上方 items 中 value 为 usage：

```vue
<mori-collapse v-model="opened" :items="items">
  <template #usage><mori-text text="这里可以组合任意业务内容。" /></template>
</mori-collapse>
```

没有提供对应具名插槽时，展示该条目的 content 字符串。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
