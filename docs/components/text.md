# 文本 mori-text

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

用于普通说明、辅助文字和语义强调。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-text text="保存后可以继续修改。" tone="muted" :size="12" />
  <mori-text :lines="2" selectable>这里放可能很长的正文内容。</mori-text>
</template>
```

## 状态与进阶使用

tone 支持 default、muted、primary、danger；非空 color 优先。bold 使用 600 字重。lines=0 不截断，正整数限制行数；多行截断依赖目标端文本布局能力，需按平台验证。没有点击事件或实例方法。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | "" | 展示文字。 |
| tone | string | "default" | default / muted / primary / danger。 |
| size | number | 13 | 尺寸；数值单位 px，枚举尺寸见本页。 |
| color | string | "" | 实例颜色覆盖，空字符串继承主题。 |
| bold | boolean | false | 启用 600 字重。 |
| selectable | boolean | false | 允许文本选择，由宿主 text 支持决定。 |
| lines | number | 0 | 最大行数；0 不截断。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
