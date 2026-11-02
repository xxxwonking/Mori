# 日期区间 mori-date-range-picker

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

在弹层内选择并确认一段日期。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-button label="选择日期区间" @click="show = true" /><mori-text :text="dates.length == 2 ? dates.join(' 至 ') : '尚未选择'" /><mori-date-range-picker v-model="dates" v-model:show="show" min-date="2026-11-01" max-date="2026-12-31" default-date="2026-11-01" :max-range="14" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const show = ref(false), dates = ref<string[]>([])
</script>
```

## 状态与进阶使用

复用 Calendar 的 range 规则；只有确认有效完整区间才更新 modelValue。取消不提交草稿。minDate/maxDate/disabledDates 和 maxRange 同时限制区间；maxRange=0 不限制。值格式 YYYY-MM-DD。confirm(values)、cancel()、overRange(date)；show 使用 v-model:show。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string[] | [] | 受控值，类型及提交规则见上文。 |
| show | boolean | false | 具体语义见上文与示例。 |
| title | string | '选择日期区间' | 标题／可访问名称。 |
| minDate | string | '' | 具体语义见上文与示例。 |
| maxDate | string | '' | 具体语义见上文与示例。 |
| defaultDate | string | '' | 具体语义见上文与示例。 |
| disabledDates | string[] | [] | 具体语义见上文与示例。 |
| maxRange | number | 0 | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

实例 confirm()、cancel()。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
