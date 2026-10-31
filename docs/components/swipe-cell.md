# 滑动操作 mori-swipe-cell

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-swipe-cell v-model="open" @action="message = '请求删除，由业务确认'"><mori-cell title="示例条目" :border="false" /></mori-swipe-cell>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const open = ref(false)
const message = ref('')
</script>
```

## 状态与进阶使用

向左滑动超过操作宽度一半展开，反向收起；保留显式按钮供键盘和桌面使用。v-model 控制展开；open()／close() 方法及同名事件；action() 只请求操作，不删除数据、不自动关闭。竖向手势优先滚动，touchcancel 复位。只支持右侧单操作，不伪装为完整多动作手势库。GESTURE-01 跟踪原生冲突。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | boolean | false | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| actionText | string | '删除' | 明确操作按钮文案。 |
| actionWidth | number | 80 | 滑动操作区域宽度，单位 px。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'open', 'close', 'action'。参数、触发条件和提交语义见上文。

公开实例方法：open, close。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
