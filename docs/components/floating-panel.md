# 浮动面板 mori-floating-panel

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

可拖动顶部并吸附到指定高度的内容面板。

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme。以下为 .uvue / UTS 示例，数据仅供演示。

```vue
<template>
  <mori-text text="拖动面板顶部，松开后吸附到邻近高度" tone="muted" /><mori-floating-panel v-model="height" title="项目摘要"><mori-descriptions :items="items" /></mori-floating-panel>
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriDescriptionItem } from '@/uni_modules/mori-ui/advanced.uts'
const height = ref(240)
const items: MoriDescriptionItem[] = [{ label: '项目', value: 'Mori UI 示例' }, { label: '说明', value: '收起后保留摘要，展开后阅读完整内容。' }, { label: '下一步', value: '检查交互和文档' }]
</script>
```

## 状态与进阶使用

modelValue 为像素高度。anchors 过滤为 64–1200px 的有效升序锚点，空数组回退 [120,240,400]。拖动顶部，松开取最近锚点；展开／收起按钮支持键盘。change(height) 在提交时触发。面板在当前布局中，若需贴屏幕底部，由宿主容器负责定位；正文内部滚动。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 180 | 受控值，类型及提交规则见上文。 |
| anchors | number[] | [120, 240, 400] | 具体语义见上文与示例。 |
| title | string | '浮动面板' | 标题／可访问名称。 |
| disabled | boolean | false | 禁止修改与提交。 |

## 事件、插槽与方法

默认插槽放内容；没有公开实例方法。

## 平台与验证边界

遵循系统字体、灰蓝主题和 36px / 13px 基线。H5 运行、微信编译与设备验收分别记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、微信真机、Safari 和鸿蒙尚无本轮运行证据；Canvas、SVG、媒体格式、触摸和滚动需要按 [平台跟踪](../platform-adaptation.md) 实测。官网使用同一 .uvue 源码，不据浏览器效果推断所有端通过。
