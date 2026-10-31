# 过渡动画 mori-transition

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

由 show 驱动淡入和退出，在退出结束后卸载内容。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="切换说明" @click="show = !show" />
  <mori-transition :show="show" name="slide-up" :duration="180"><mori-text text="操作已完成。" /></mori-transition>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const show = ref(true)
</script>
```

## 状态与进阶使用

name 支持 fade、slide-up、zoom。duration 单位 ms，限制在 0–3000；H5 减少动态效果使用 0ms。beforeEnter / afterEnter / beforeLeave / afterLeave 均不带参数。快速反向切换取消过期回调，卸载清理定时器。动画会保留正常布局空间直到退出完成；不要依赖它实现弹层焦点管理。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| show | boolean | false | 过渡显示状态；以 :show 单向绑定，不提供 v-model。 |
| name | string | "fade" | 动画类型：fade / slide-up / zoom。 |
| duration | number | 180 | 持续或动画时长，单位 ms；0 的含义见本页。 |

## 事件、插槽与方法

公开事件：`beforeEnter`、`afterEnter`、`beforeLeave`、`afterLeave`。事件载荷和触发时机见本页状态说明。

没有公开实例方法。

插槽：`default`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
