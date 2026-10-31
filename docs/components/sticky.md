# 吸顶容器 mori-sticky

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-sticky :offset-top="0"><mori-navbar title="筛选结果" /></mori-sticky>
</template>
```

## 状态与进阶使用

WEB／微信采用 CSS sticky，受最近滚动祖先与祖先 overflow 影响。App 分支默认普通流布局；需要吸顶时业务通过滚动状态传 fixed=true，height 给出占位高度，固定内容按视口全宽展示。offsetTop 为 px。STICKY-01 明确记录平台差异，未把 CSS 编译当作原生自动吸顶。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| offsetTop | number | 0 | 吸顶到视口顶部的距离，单位 px。 |
| zIndex | number | 20 | 层级，默认低于 Popup。 |
| fixed | boolean | false | 是否固定到视口，使用时预留页面空间。 |
| height | number | 44 | 容器高度；字符串为 CSS 长度，数值为 px。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
