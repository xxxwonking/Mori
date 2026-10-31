# 标签 mori-tag

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

显示简短分类或状态，可由父组件响应关闭事件。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-tag v-if="visible" text="设计" closable plain @close="visible = false" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const visible = ref(true)
</script>
```

## 状态与进阶使用

type 支持 primary、danger、default；plain 为透明底描边。close 不会自行卸载，父级通过 v-if 或数组移除处理。默认 slot 可替换 text；关闭按钮的可访问名称仍使用 text，建议保留它。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | "" | 展示文字。 |
| type | string | "primary" | 语义或选择类型，支持值见用法。 |
| plain | boolean | false | 透明底与描边样式。 |
| closable | boolean | false | 显示关闭入口；行为见组件生命周期。 |

## 事件、插槽与方法

公开事件：`close`。事件载荷和触发时机见本页状态说明。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
