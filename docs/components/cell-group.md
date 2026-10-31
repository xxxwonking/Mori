# 单元格分组 mori-cell-group

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-cell-group title="账户" description="资料仅用于本地演示"><mori-cell title="昵称" value="林同学" /><mori-cell title="语言" value="简体中文" :border="false" /></mori-cell-group>
</template>
```

## 状态与进阶使用

default 组合 Cell。最后一个 Cell 的 border=false 由业务显式设置，避免依赖 DOM 相邻选择器影响跨端。inset 控制圆角，标题和说明分别为 12px、11px。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| title | string | '' | 标题或组件名称。 |
| description | string | '' | 补充说明。 |
| inset | boolean | true | 是否使用圆角分组。 |

## 事件、插槽与方法

公开事件：无。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
