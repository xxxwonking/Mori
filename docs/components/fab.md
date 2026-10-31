# 悬浮操作 mori-fab

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-fab v-model="expanded" :items="actions" :fixed="false" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriGridItem } from '@/uni_modules/mori-ui/content.uts'
const expanded = ref(false)
const actions: MoriGridItem[] = [{ value: 'note', label: '新建笔记', icon: 'plus' }, { value: 'photo', label: '上传图片', icon: 'image' }]
</script>
```

## 状态与进阶使用

items: MoriGridItem[]，空列表作为单按钮使用；click() 来自主按钮，select(value) 来自有效菜单项并请求折叠。v-model 绑定展开状态。fixed 默认 true，right／bottom 为 px，业务需给底栏和安全区留距离。层级默认 50，低于 Popup。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | boolean | false | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| items | MoriGridItem[] | [] | 类型化条目数组，字段见示例与状态说明。 |
| label | string | '新建' | 可见操作名称或可访问名称。 |
| fixed | boolean | true | 是否固定到视口，使用时预留页面空间。 |
| right | number | 16 | 距离视口右侧，单位 px。 |
| bottom | number | 24 | 距离视口底部，单位 px。 |
| zIndex | number | 50 | 层级，默认低于 Popup。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'click', 'select'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
