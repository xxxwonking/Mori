# 弹出层 mori-popup

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

放在页面根级，承载需要遮罩或独立层级的交互。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="打开详情" @click="show = true" />
  <mori-popup v-model="show" title="详情" position="bottom"><mori-text text="这里放业务内容。" /></mori-popup>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const show = ref(false)
</script>
```

## 状态与进阶使用

默认从底部向上浮现并同步淡入，duration=280ms。父级控制可见性；open/opened/close/closed 区分请求与动画完成。不要放在 transform 或裁切祖先内。嵌套时最后打开的层优先处理 Escape；H5 退出完成后释放滚动锁。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 控制显隐，关闭时保留退出过渡 |
| position | string | bottom | center / bottom / top / left / right |
| title | string | 空 | 标题及弹层无障碍名称，建议提供 |
| closable | boolean | true | 显示关闭图标 |
| overlay | boolean | true | 显示背景遮罩 |
| closeOnOverlayClick | boolean | true | 点击遮罩请求关闭 |
| closeOnEscape | boolean | true | H5 按 Escape 请求关闭 |
| duration | number | 280 | 过渡时长，单位 ms；H5 减少动态效果时为 0 |
| zIndex | number | 1000 | 层级下限，新打开层始终在已有层之上 |
| safeAreaInsetBottom | boolean | true | H5／微信通过 env 预留底部安全区；App 需使用方结合页面适配 |

默认 slot 放置内容；点击内容不触发遮罩关闭。

overlay=false 为非模态模式：隐藏遮罩，aria-modal=false，该层不锁定背景滚动或限制焦点，H5 可继续操作背景；若它位于最上层，仍可按 Escape 关闭。其他仍打开的模态层继续持有自己的滚动锁。

| 事件 | 参数 | 时机 |
|---|---|---|
| update:modelValue | false | 用户通过允许的关闭入口请求关闭 |
| open | 无 | 开始打开 |
| opened | 无 | 打开过渡结束 |
| close | overlay / escape / close | 遮罩、Escape 或关闭按钮产生的用户关闭请求 |
| closed | 无 | 退出过渡结束 |

父级直接设为 false 不产生用户 close 请求，但仍经历退出生命周期。快速反向开关取消过期计时，避免旧 closed 回调关闭新实例。最上层之外的弹层不响应关闭入口；退出期间保留栈所有权，结束后才恢复下层。

实际层级按每次打开的 `max(zIndex, 当前顶层层级 + 2)` 分配。zIndex 是下限，不用于把新弹层放到旧弹层之下。H5 的焦点限制、Escape、视觉顺序使用同一打开顺序；背景滚动在最后一个模态层释放后恢复。

请将 Popup 放在页面顶层，避开 transform、裁切或限制定位的祖先容器。当前不提供 teleport／全局门户；原生／小程序的页面滚动应结合目标平台 page-meta／页面配置处理。H5 焦点与滚动适配不等于原生或小程序设备验证。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
