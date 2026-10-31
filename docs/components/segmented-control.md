# 分段控制器 mori-segmented-control

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-segmented-control v-model="selected" :items="items" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriNavItem } from '@/uni_modules/mori-ui/navigation.uts'
const selected = ref('all')
const items: MoriNavItem[] = [{ value: 'all', label: '全部' }, { value: 'saved', label: '收藏' }, { value: 'disabled', label: '暂不可用', disabled: true }]
</script>
```

## 状态与进阶使用

复用 MoriNavItem（value、label、可选 icon／disabled；此组件不展示 badge）。字符串受控值；change(value) 仅在有效选择变化时触发。方向键循环跳过禁用项并移动焦点，Enter／Space 选择；整组 disabled 禁止修改。不自动导航或生成内容页。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string | '' | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| items | MoriNavItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| label | string | '切换视图' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'change'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
