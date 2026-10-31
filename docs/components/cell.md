# 单元格 mori-cell

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

显示标题、描述和值，业务可选择开启整行点击。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-cell title="提醒方式" label="保存后生效" value="站内消息" clickable is-link @click="open = true" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const open = ref(false)
</script>
```

## 状态与进阶使用

clickable 决定是否响应 click 和键盘，isLink 只控制箭头。disabled 保留内容且禁止激活。默认 slot 替换右侧 value；border=false 隐藏底部分隔线。click 不携带参数，也不自动跳转路由。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| title | string | "" | 标题；弹层同时用作可访问名称。 |
| label | string | "" | 字段、操作或内容的名称；同时用于可访问性。 |
| value | string | "" | 当前条目的字符串值，组内保持唯一。 |
| clickable | boolean | false | 启用整行点击和键盘操作。 |
| isLink | boolean | false | 显示右侧箭头，不会自动导航。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| border | boolean | true | 显示底部分隔线。 |

## 事件、插槽与方法

公开事件：`click`。事件载荷和触发时机见本页状态说明。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
