# 加载 mori-loading

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

表示正在处理的非确定进度；确定进度使用 Progress。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-loading text="正在加载列表" :size="18" />
</template>
```

## 状态与进阶使用

text 为空时仅显示环形标记，可访问名称仍为“加载中”。color 覆盖环形主色，size 为环直径。H5 减少动态效果时保留静态环与状态说明。组件不阻断点击，不代替业务防重。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | "" | 展示文字。 |
| size | number | 18 | 尺寸；数值单位 px，枚举尺寸见本页。 |
| color | string | "" | 实例颜色覆盖，空字符串继承主题。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
