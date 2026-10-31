# 按钮 mori-button

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

提交按钮在异步请求期间进入 loading；点击事件只通知业务。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="保存" :loading="saving" @click="save" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const saving = ref(false)
async function save() { if (saving.value) return; saving.value = true; try { /* await 业务保存请求 */ } finally { saving.value = false } }
</script>
```

## 状态与进阶使用

用 variant="soft / outline / text" 控制操作层级；size="sm / md / lg" 控制尺寸。默认 36px，lg 才是 40px。颜色使用 color 与 textColor，block 使按钮铺满容器。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| label | string | 空 | 按钮文字，默认 slot 可覆盖 |
| variant | string | solid | solid / soft / outline / text |
| size | string | md | sm 28px / md 36px / lg 40px |
| color | string | 空 | 为空继承全局当前主题品牌色 |
| softColor | string | 空 | 为空继承全局柔和背景 |
| textColor | string | 自动 | 实心按钮根据背景选择黑/白；可以显式覆盖 |
| loading | boolean | false | 显示加载图标，同时阻止交互 |
| disabled | boolean | false | 禁用，降低视觉强调 |
| block | boolean | false | 占满可用宽度 |
| round | boolean | false | 胶囊圆角 |

事件：`click`，仅在未禁用、未加载时触发，不携带业务参数。默认 slot 用于文字内容；图标组件尚未包含在首版中。

H5 支持 Enter / Space 激活。使用 `loading` 处理提交等待；接口成功失败逻辑由业务提供。

实心按钮会为不透明 `#RGB`、`#RRGGBB` 和逗号格式 `rgb(r,g,b)` 选择对比度更高的黑/白文字，不受当前深浅模式干扰。其他颜色格式（含透明色）请提供 `textColor`，并自行确认实际合成背景的可读性。柔和/描边按钮请成对选择 color 与背景，实例覆盖同样需要考虑对比度。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
