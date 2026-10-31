# 底部操作栏 mori-action-bar

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-action-bar primary-text="提交" secondary-text="取消" :loading="saving" @primary="save"><mori-text text="共选择 2 项" /></mori-action-bar>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const saving = ref(false)
function save() { saving.value = true; setTimeout(() => { saving.value = false }, 400) }
</script>
```

## 状态与进阶使用

default 放摘要、价格或说明。primary()／secondary() 仅发业务事件。loading 阻止两个操作，fixed 默认 false；开启后页面须预留底部空间，避免遮挡正文。safeAreaInsetBottom 默认 true。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| primaryText | string | '确认' | 主操作文案。 |
| secondaryText | string | '' | 次操作文案，空字符串隐藏。 |
| loading | boolean | false | 请求进行中，必须由业务在结束时置 false。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| fixed | boolean | false | 是否固定到视口，使用时预留页面空间。 |
| safeAreaInsetBottom | boolean | true | 添加底部安全区占位。 |

## 事件、插槽与方法

公开事件：'primary', 'secondary'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
