# 自动补全 mori-autocomplete

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

按标签过滤建议，输入值与选项业务值分开。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-autocomplete v-model="value" :options="options" label="选择城市" @select="selected = $event" /><mori-text :text="'选中值：' + selected" tone="muted" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriChoiceOption } from '@/uni_modules/mori-ui/selection.uts'
const value = ref(''), selected = ref('')
const options: MoriChoiceOption[] = [{ value: 'hangzhou', label: '杭州' }, { value: 'shanghai', label: '上海' }, { value: 'beijing', label: '北京' } ]
</script>
```

## 状态与进阶使用

modelValue 为输入文字；select(value, option) 返回业务 value 和完整选项。search(query) 每次输入触发，异步请求由父级处理，并丢弃过期响应；设置 filter=false 可使用服务端过滤。loading/error 表达加载和失败。confirm(text) 接收键盘最终文本。建议行可用 Tab 与 Enter 选择，按钮可收起列表。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | '' | 受控值，类型及提交规则见上文。 |
| options | MoriChoiceOption[] | [] | 候选项数组。 |
| label | string | '搜索建议' | 可见标签或可访问名称。 |
| placeholder | string | '输入关键词' | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |
| loading | boolean | false | 外部加载状态。 |
| error | string | '' | 具体语义见上文与示例。 |
| filter | boolean | true | 具体语义见上文与示例。 |
| limit | number | 8 | 具体语义见上文与示例。 |

## 事件、插槽与方法

没有公开方法或插槽。

选择建议或键盘确认后重建内部 Input，结束当前编辑并丢弃迟到的输入事件，保持已提交文本与收起状态。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
