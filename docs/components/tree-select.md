# 树选择 mori-tree-select

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-tree-select v-model="selected" :options="options" :default-expanded="['fruit']" :max="2" :check-strictly="false" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriTreeNode } from '@/uni_modules/mori-ui/extended-input.uts'
const selected = ref<string[]>([])
const options: MoriTreeNode[] = [{ value: 'fruit', label: '水果', children: [{ value: 'apple', label: '苹果' }, { value: 'pear', label: '梨' }] }]
</script>
```

## 状态与进阶使用

options: MoriTreeNode[]，所有层级 value 全局唯一，树必须无环。点击分支展开／折叠，只选择叶子；checkStrictly 默认为 true，设为 false 后分支复选框联动所有可选后代叶子，半选自动计算。modelValue 仍仅保存叶子 value。超出 max 时整次父级选择不生效，并发出 overLimit(max)，不会部分选中。max=0 不限制，达到上限仍可取消选中。禁用祖先传递到子项。defaultExpanded 只读初始值。change(values:string[])、expand(expanded:string[])；模型返回新数组。动态删项后业务应同步清除失效模型值。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| modelValue | string[] | [] | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| options | MoriTreeNode[] | [] | 类型化选择项或树数据，字段见示例。 |
| defaultExpanded | string[] | [] | 只用于初始化的展开分支 value 数组。 |
| checkStrictly | boolean | true | false 开启父子联动和半选。 |
| max | number | 0 | 数量上限；0 的含义见状态说明。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |
| label | string | '选择项目' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'change', 'expand', 'overLimit'。参数、触发条件和提交语义见上文。

公开实例方法：无。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
