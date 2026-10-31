# 轮播 mori-swiper

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-swiper v-model="current" :items="slides" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriSwiperItem } from '@/uni_modules/mori-ui/content.uts'
const current = ref(0)
const slides: MoriSwiperItem[] = [{ value: 'cover', src: '/static/example.png', title: '示例封面' }]
</script>
```

## 状态与进阶使用

items 为 MoriSwiperItem[]（value、src、可选 title）。v-model 索引从 0 开始，越界展示钳制后的页。change(index) 在宿主实际切页后触发；select(value) 不自动导航。默认关闭自动轮播，H5 减少动态效果下强制关闭自动播放；用户仍可手动滑动。MEDIA-02 跟踪原生轮播与触摸。

## 属性

H5 只将当前页纳入 Tab 顺序，不可见页从辅助技术中隐藏。聚焦当前页时左右方向键切换，遵守 circular 边界；焦点移动不会滚动宿主轮播外壳。键盘切换也触发 change(index)。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | number | 0 | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| items | MoriSwiperItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| height | number | 180 | 容器高度；字符串为 CSS 长度，数值为 px。 |
| autoplay | boolean | false | 是否自动开始轮播或数字过渡。 |
| interval | number | 4000 | 轮播间隔，单位毫秒，至少 1000。 |
| circular | boolean | true | 允许循环轮播。 |
| indicatorDots | boolean | true | 显示宿主轮播指示点。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'change', 'select'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
