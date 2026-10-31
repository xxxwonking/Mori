# 日期时间选择器 mori-datetime-picker

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

日期时间组合选择，取消不会写回业务值。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="选择预约时间" @click="show = true" />
  <mori-datetime-picker v-model="value" v-model:show="show" mode="datetime" min="2026-10-01 08:00" max="2027-12-31 23:59" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const show = ref(false)
const value = ref('2026-10-30 09:30')
</script>
```

## 状态与进阶使用

mode=date 使用 YYYY-MM-DD；time 使用 HH:mm；datetime 使用 YYYY-MM-DD HH:mm。全部为业务本地时间字符串，不隐式转 UTC 时间戳。min/max 与 mode 使用相同格式，非法边界忽略。打开时模型无效则采用当天/09:00并钳制范围；打开期间外部值、模式或边界变化会重新初始化草稿。确认禁用无效组合，confirm(value:string) 后更新模型并关闭；ref.confirm()/cancel() 可主动调用。时分为整数步进器，不支持秒、时区或夏令时歧义解析。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | "" | 当前受控值，使用 v-model 绑定；类型和提交时机见本页用法。 |
| show | boolean | false | 弹层显示状态，使用 v-model:show 绑定。 |
| mode | string | "datetime" | 日期时间模式，见字符串格式说明。 |
| title | string | "选择日期时间" | 标题；弹层同时用作可访问名称。 |
| min | string | "" | 允许的下界。 |
| max | string | "" | 允许的最晚日期/时间，格式须与 mode 一致。 |
| disabled | boolean | false | 禁止用户修改或激活；内容继续展示。 |

## 事件、插槽与方法

公开事件：`update:modelValue`、`update:show`、`confirm`、`cancel`。事件载荷和触发时机见本页状态说明；模型更新事件由对应的 v-model 接收。

模板 ref 暴露：`confirm, cancel`。仅在挂载后调用，使用可空 ref 和 `?.`；参数、返回行为见本页状态说明。

没有插槽。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
