# 图片预览 mori-image-preview

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-button label="查看图片" @click="show = true" /><mori-image-preview v-model="index" v-model:show="show" :images="images" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const index = ref(0)
const show = ref(false)
const images = ['/static/example.png', '/static/mori-demo.svg']
</script>
```

## 状态与进阶使用

受控预览弹窗：show 控制显隐，v-model 控制当前索引；change(index) 为手动翻页，close() 请求关闭。空数组展示空态，越界索引钳制。默认支持缩放和平移；nativePreview=true 时点图调用宿主预览单张图，缩放与保存由宿主提供。MEDIA-03 跟踪平台支持。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| zoomable | boolean | true | 启用缩放和平移。 |
| maxZoom | number | 4 | 最大倍率，1–8。 |
| show | boolean | false | 受控显示状态，可用 v-model:show。 |
| modelValue | number | 0 | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| images | string[] | [] | 图片地址数组。 |
| title | string | '图片预览' | 标题或组件名称。 |
| nativePreview | boolean | false | 允许点击当前图片打开宿主预览。 |

## 事件、插槽与方法

公开事件：'update:show', 'update:modelValue', 'change', 'close'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 缩放和平移

zoomable 默认 true、maxZoom 默认 4（范围 1–8）。按钮或双指缩放，单指与方向键在有界区域平移；换图、关闭／重开或关闭缩放时重置。nativePreview 继续可选。H5 缩放区独占触摸，不接管页面其它位置的手势。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
