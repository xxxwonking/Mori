# 空状态 mori-empty

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

解释当前空内容，并提供下一步操作。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-empty title="暂无收藏" description="浏览列表后可以收藏常用内容。"><mori-button label="浏览列表" @click="browse" /></mori-empty>
</template>

<script setup lang="uts">
import { ref } from 'vue'
function browse() { /* 按业务路由跳转 */ }
</script>
```

## 状态与进阶使用

title 为主要说明，description 可为空，icon 使用 MoriIcon 内置名称。默认 slot 是操作区；按钮事件由业务处理。避免仅展示一个图标却不给用户下一步。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| title | string | "暂无内容" | 标题；弹层同时用作可访问名称。 |
| description | string | "" | 补充说明。 |
| icon | string | "info" | 内置 MoriIcon 名称。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
