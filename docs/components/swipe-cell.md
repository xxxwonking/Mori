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

向左滑动超过操作宽度一半展开，反向收起；保留显式按钮供键盘和桌面使用。v-model 控制展开；open()／close() 方法及同名事件；action() 只请求操作，不删除数据、不自动关闭。竖向手势优先滚动，touchcancel 复位。可配置双侧多操作，未传数组时保留原右侧单操作。GESTURE-01 跟踪原生冲突。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| side | string | right | 展开侧，支持 left/right。 |
| leftActions | MoriSwipeAction[] | [] | 左侧操作。 |
| rightActions | MoriSwipeAction[] | [] | 右侧操作，为空使用 actionText。 |
| modelValue | boolean | false | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| actionText | string | '删除' | 明确操作按钮文案。 |
| actionWidth | number | 80 | 滑动操作区域宽度，单位 px。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'open', 'close', 'action'。参数、触发条件和提交语义见上文。

公开实例方法：open, close。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 双侧多操作

leftActions / rightActions: MoriSwipeAction[]，每项 {value,label,disabled?,danger?}。side 通过 v-model:side 受控，默认 right；rightActions 为空时沿用原 actionText 单操作。actionWidth 为每个按钮宽度（60–200px）。select(value,side,index) 返回点击项；旧 action() 无载荷保留。open(side='right') / close() 支持实例控制；隐藏侧和禁用操作无法点击／聚焦。

```vue
<template>
 <mori-swipe-cell v-model="open" v-model:side="side" :left-actions="left" :right-actions="right" @select="selected = $event"><mori-cell title="示例通知" value="左右滑动" /></mori-swipe-cell>
 <mori-text :text="selected.length > 0 ? '已选择：' + selected : '滑动或用按钮展开操作'" tone="muted" />
</template>
<script setup lang="uts">
import { ref } from 'vue'
import { MoriSwipeAction } from '@/uni_modules/mori-ui/advanced.uts'
const open = ref(false), side = ref('right'), selected = ref('')
const left: MoriSwipeAction[] = [{ value: '归档', label: '归档' }]
const right: MoriSwipeAction[] = [{ value: '置顶', label: '置顶' }, { value: '删除', label: '删除', danger: true }]
</script>
```

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
