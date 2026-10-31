# 图标 mori-icon

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

统一使用随库分发的 Lucide 图标，可传入自有图片路径。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-icon name="calendar" :size="18" label="日历" />
  <mori-icon name="search" :size="16" />
</template>
```

## 状态与进阶使用

内置名称：check、eye、eye-off、circle-x、chevron-left、chevron-right、chevron-down、plus、minus、search、info、calendar、clock、upload、image、star、home、settings、bell、x。home 对应上游 house。src 非空优先，未知 name 不显示；默认装饰图标不朗读，有业务语义时设置 label。size 单位 px。不提供任意颜色注入，内置资产随主题切换。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| name | string | "info" | 内置图标名，支持清单见本页用法。 |
| src | string | "" | 自定义图片路径，非空时优先于 name。 |
| size | number | 18 | 尺寸；数值单位 px，枚举尺寸见本页。 |
| label | string | "" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
