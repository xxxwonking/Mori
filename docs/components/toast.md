# 轻提示 mori-toast

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

页面内的非阻塞简短提示，通过模板 ref 调用。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-button label="显示提示" @click="toast?.show({ message: '保存成功', type: 'success' })" />
  <mori-toast ref="toast" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriToastInstance } from '@/uni_modules/mori-ui/feedback.uts'
const toast = ref<MoriToastInstance | null>(null)
</script>
```

## 状态与进阶使用

show(options) 支持 message/type/duration/position；连续调用替换并重新计时。duration=0 持续直到 close()；加载中建议显式设 0。也支持 v-model。type 支持 text/success/error/loading。组件不发请求、不提供全局单例。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | boolean | false | 受控显示状态；也可使用实例 show／close |
| message | string | 空 | 提示文字 |
| type | string | text | text / success / error / loading |
| duration | number | 2000 | 显示时长，单位 ms；0 持续显示直到主动关闭 |
| position | string | middle | middle / top / bottom |

通过模板 ref 调用 `show(options: MoriToastOptions)` 和 `close()`；类型从 `@/uni_modules/mori-ui/feedback.uts` 导入。show 的 message、type、duration、position 选项控制本次内容；省略项使用组件 prop 默认配置，重复 show 替换当前提示并从头计时，不排队。

```ts
export type MoriToastOptions = {
  message?: string;
  type?: string;
  duration?: number;
  position?: string;
}
export type MoriToastInstance = {
  show: (options: MoriToastOptions) => void;
  close: () => void;
}
```

事件：`update:modelValue(boolean)`、`close`。show 立即显示并请求模型为 true；close／自动超时请求 false 并发出一次 close，重复关闭不重复通知。loading 仍遵循 duration，持续等待需显式设为 0。卸载清理计时任务。

同时使用 v-model 与 show 时，父级 false→true 的显示确认不会覆盖刚传入的临时 options。父级后续修改 message／type／duration／position 会替换对应临时值，并在可见时重新计时；父级可见性变化仍然生效。未绑定 v-model 时可以只用 ref；此时关闭请调用 close，不能依赖一个始终为 false 的静态 prop 再次触发更新。

Toast 不阻止背景操作，适合简短结果提示；需要用户确认或等待期间禁止操作时使用 Dialog。每页推荐挂载一个实例，不提供全局 showToast／Promise API。普通提示使用 status 实时播报，错误提示使用 alert。

当前 Toast 使用固定 z-index 2000；自定义高层级的 Popup 可能遮住它，提示宜在弹层关闭后显示。加载转动动画在 H5 实现并尊重减少动态效果偏好，其他端以实际运行记录为准。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
