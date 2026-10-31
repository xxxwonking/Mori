# 关键词高亮 mori-highlight

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-highlight text="Mori UI 提供可复用的移动组件" keyword="组件" />
</template>
```

## 状态与进阶使用

按普通子串查找全部不重叠匹配，keyword 为空原样显示。输入始终作为文本渲染，不解释 HTML 或正则；caseSensitive 默认 false。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| text | string | '' | 展示的纯文本内容。 |
| keyword | string | '' | 需要高亮的普通子串。 |
| caseSensitive | boolean | false | 是否区分大小写。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
