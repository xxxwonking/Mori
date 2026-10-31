# 徽标 mori-badge

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

在被包裹内容的右上角展示数量或提示点。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-badge content="128" :max="99"><mori-button label="消息" /></mori-badge>
  <mori-badge dot label="有未读消息"><mori-icon name="bell" /></mori-badge>
</template>
```

## 状态与进阶使用

content 使用字符串，可展示数字或短文本。纯数值超过 max 显示 max+；空内容且 dot=false 隐藏。组件固定预留顶部 6px、右侧 8px，使数字或点位于组件布局范围内；标记显隐不改变这份占位。不要用固定高度父级裁切整个组件。dot 时为可访问性设置 label。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| content | string | "" | 徽标文本，数字也使用字符串。 |
| max | number | 99 | 数字展示上限；超过时显示 max+。 |
| dot | boolean | false | 只显示提示点。 |
| label | string | "" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
