# 标签输入 mori-tag-input

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

把短文本录入为去重标签。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-tag-input v-model="tags" :max="5" /><mori-text :text="tags.join('、')" tone="muted" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const tags = ref<string[]>(['设计', '开发'])
</script>
```

## 状态与进阶使用

modelValue 为 string[]，添加时 trim；空值不添加，重复、超 max、超 maxLength 触发 invalid(message)。max=0 不限制数量，maxLength 按 UTF-16 字符计数。change(values) 与 update:modelValue 返回新数组；disabled 禁止增加与移除。

确认先接收 blur 的最终文本，成功后重建输入编辑器以清除宿主节流缓存；键盘确认会结束本次编辑。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string[] | [] | 受控值，类型及提交规则见上文。 |
| label | string | '标签' | 可见标签或可访问名称。 |
| placeholder | string | '输入后按回车添加' | 具体语义见上文与示例。 |
| max | number | 0 | 具体语义见上文与示例。 |
| maxLength | number | 24 | 具体语义见上文与示例。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

没有公开方法或插槽。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
