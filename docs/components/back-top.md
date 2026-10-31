# 返回顶部 mori-back-top

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-back-top :scroll-top="scrollTop" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
const scrollTop = ref(0)
onPageScroll((event) => { scrollTop.value = event.scrollTop })
</script>
```

## 状态与进阶使用

父页面通过 onPageScroll 提供 scrollTop；超过 visibilityHeight 时出现。autoScroll=true 调用 uni.pageScrollTo，H5 减弱动画下 duration=0。scroll-view 内应设 autoScroll=false 并在 click() 中修改自身 scroll-top。不会监听浏览器全局滚动。SCROLL-02 跟踪原生滚动目标。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| scrollTop | number | 0 | 业务提供的滚动位置，单位 px。 |
| visibilityHeight | number | 200 | 显示返回顶部按钮的滚动阈值。 |
| right | number | 16 | 距离视口右侧，单位 px。 |
| bottom | number | 80 | 距离视口底部，单位 px。 |
| fixed | boolean | true | 是否固定到视口，使用时预留页面空间。 |
| autoScroll | boolean | true | 自动调用页面级滚动；scroll-view 应关闭并自行处理。 |
| label | string | '返回顶部' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'click'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
