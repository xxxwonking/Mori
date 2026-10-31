# 分割线 mori-divider

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

分隔相邻内容，也可在分割线上放简短说明。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-divider />
  <mori-divider text="更多设置" />
</template>
```

## 状态与进阶使用

text 非空时两侧各显示一段线。默认上下间距 16px，1px 主题边界色；不接收交互，不提供 ref 方法或插槽。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | "" | 展示文字。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
