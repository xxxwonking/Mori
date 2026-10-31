# 日历 mori-calendar

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

内联日历，统一用 string[] 表示单选、多选或范围。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-calendar ref="calendar" v-model="dates" type="range" min-date="2026-10-01" max-date="2026-12-31" :max-range="7" :disabled-dates="['2026-10-18']" :marks="marks" @confirm="confirmDates" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriCalendarInstance, MoriCalendarMark } from '@/uni_modules/mori-ui/calendar.uts'
const dates = ref<string[]>([])
const calendar = ref<MoriCalendarInstance | null>(null)
const marks: MoriCalendarMark[] = [{ date: '2026-10-15', text: '活动' }]
function confirmDates(value: string[]) { /* 保存所选日期 */ }
</script>
```

## 状态与进阶使用

type=single: [date]；multiple: 排序后的日期数组，可取消；range: [start] 或 [start,end]。范围第二次点击更早日期时重新选择起点，同日范围允许。maxRange 包含首尾天数，0 不限制；范围跨越 disabledDates 也会被拒绝并发 overRange(date:string)。select(string[]) 在有效点击更新模型时触发；confirm(string[]) 只有合法完整值才发。minDate/maxDate 严格 YYYY-MM-DD，非法边界忽略。marks 仅显示标记，不会禁用日期。ref.scrollToDate(date) 定位月份，ref.confirm() 主动确认。用户点击上一月／下一月发 monthChange(month:string)，格式为 YYYY-MM；方法定位不发该事件。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string[] | [] | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| type | string | "single" | 语义或选择类型，支持值见用法。 |
| title | string | "选择日期" | 标题；弹层同时用作可访问名称。 |
| minDate | string | "" | 最早可选日期 YYYY-MM-DD，空字符串不限制。 |
| maxDate | string | "" | 最晚可选日期 YYYY-MM-DD，空字符串不限制。 |
| defaultDate | string | "" | 初始展示的月份定位日期；不自动选中。 |
| disabledDates | Array（见用法） | [] | 不可选日期 string[]，范围也不可跨越这些日期。 |
| marks | Array（见用法） | [] | MoriCalendarMark[]，每项 date 与 text。 |
| maxRange | number | 0 | 范围最多天数，包含首尾；0 不限制。 |
| firstDayOfWeek | number | 0 | 每周起始日，0=星期日，1=星期一，最大 6。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |
| showConfirm | boolean | true | 显示日历确认按钮；隐藏后可用 select 或 ref.confirm。 |
| confirmText | string | "确认日期" | 确认按钮文字。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`select`、`confirm`、`overRange`、`monthChange`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`scrollToDate, confirm`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
