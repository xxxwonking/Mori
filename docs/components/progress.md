# 进度条 mori-progress

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

展示可确定的完成百分比。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-progress :percentage="percent" label="文件上传进度" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const percent = ref(45)
</script>
```

## 状态与进阶使用

percentage 被限制到 0–100 并四舍五入，非有限数按 0；strokeWidth 是轨道高度（至少 2px），showText=false 隐藏右侧数字。label 提供业务名称。组件只展示进度，不会自动增长。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| percentage | number | 0 | 完成百分比，自动钳制至 0–100。 |
| strokeWidth | number | 4 | 进度轨道高度，单位 px，至少 2。 |
| showText | boolean | true | 显示百分比文字。 |
| color | string | "" | 实例颜色覆盖，空字符串继承主题。 |
| label | string | "进度" | 字段、操作或内容的名称；同时用于可访问性。 |

## 事件、插槽与方法

该组件不发出业务事件。

没有公开实例方法。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
