# 开关 mori-switch

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

boolean 状态开关，标签为外部名称，轨道文字为状态。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-switch v-model="enabled" label="消息通知" active-text="开" inactive-text="关" active-color="#0066d6" inactive-color="#616e82" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const enabled = ref(false)
</script>
```

## 状态与进阶使用

activeColor 优先于 color；inactiveColor 独立设置关闭颜色。两种状态文字按最长者预留宽度，切换不改变尺寸。change(boolean) 用于业务更新；disabled 时不发事件。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 是否开启 |
| label | string | 空 | 选项名称，建议始终提供 |
| description | string | 空 | 次级说明 |
| color | string | 空 | 开启色后备值；为空继承主题品牌色 |
| activeColor | string | 空 | 开启背景色，优先于 color |
| inactiveColor | string | 空 | 关闭背景色，默认随主题使用灰色 |
| activeText | string | 空 | 开启时轨道内文字 |
| inactiveText | string | 空 | 关闭时轨道内文字 |
| size | string | md | sm / md / lg 轨道高 20 / 22 / 26px |
| disabled | boolean | false | 禁止切换 |

事件：`update:modelValue(boolean)`、`change(boolean)`。由组件绘制轨道、滑块与文字，保持跨端视觉一致；单次点按仅更新一次，H5 支持 Enter / Space。无字默认轨道 38×22px，滑块 18px；文字轨道按开关两种文字中较长者预留宽度，切换不改变宽度。状态文字建议 1–3 个字，前景色按不透明 #RGB / #RRGGBB / rgb() 自动选择黑白。颜色可分别传入深浅主题值。滑块以 transform 过渡 180ms，颜色同步变化，H5 减少动态效果偏好下关闭过渡。

```vue
<mori-switch v-model="enabled" label="消息通知"
  active-color="#238653" inactive-color="#dce9e1"
  active-text="开启" inactive-text="关闭" />
```

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
