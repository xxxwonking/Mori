# 级联选择 mori-cascader

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-button label="选择地区" @click="show = true" /><mori-cascader v-model="path" v-model:show="show" :options="options" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriTreeNode } from '@/uni_modules/mori-ui/extended-input.uts'
const show = ref(false)
const path = ref<string[]>([])
const options: MoriTreeNode[] = [{ value: 'zj', label: '浙江', children: [{ value: 'hz', label: '杭州', children: [{ value: 'xh', label: '西湖区' }] }] }]
</script>
```

## 状态与进阶使用

树结构 MoriTreeNode：value、label、可选 disabled／children。v-model 是从根到叶的 value[]。选中分支进入下一层，顶部路径返回上级；到叶子才允许确认。change(draft:string[]) 只是草稿，confirm(path) 才更新模型；cancel() 保留原值。confirm／cancel 可由 ref 调用。禁用祖先阻止整条路径；loading 禁止确认。数据由业务提供，不内置行政区，按需加载通过 loadChildren 显式启用。未声明 leaf=false 时，children 空数组视为叶子。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| loadChildren | Function / null | null | 异步加载回调，签名见下节。 |
| modelValue | string[] | [] | 受控状态，使用 v-model 绑定；类型与触发时机见下文。 |
| show | boolean | false | 受控显示状态，可用 v-model:show。 |
| options | MoriTreeNode[] | [] | 类型化选择项或树数据，字段见示例。 |
| title | string | '逐级选择' | 标题或组件名称。 |
| loading | boolean | false | 请求进行中，必须由业务在结束时置 false。 |
| disabled | boolean | false | 禁止交互并表达禁用状态。 |

## 事件、插槽与方法

公开事件：'update:modelValue', 'update:show', 'change', 'confirm', 'cancel'。参数、触发条件和提交语义见上文。

公开实例方法：confirm, cancel。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 按需加载

`loadChildren(node,path): Promise<MoriTreeNode[]>` 为可选回调。leaf=false 且 children 未设置时点击触发加载，返回 [] 表示叶子；已加载结果在 options 变化前缓存。loading 与本地 pending 时禁止确认；失败显示重试并发出 loadError(value)。取消、回写模型／选项、卸载使迟到结果失效。所有节点 value 全局唯一，不传有环树。

```vue
<template>
 <mori-button label="按需加载选项" @click="show = true" /><mori-text :text="values.join(' / ')" />
 <mori-cascader v-model="values" v-model:show="show" :options="options" :load-children="load" />
</template>
<script setup lang="uts">
import { ref } from 'vue'
import { MoriTreeNode } from '@/uni_modules/mori-ui/extended-input.uts'
const show = ref(false), values = ref<string[]>([])
const options: MoriTreeNode[] = [{ value: 'project', label: '示例项目', leaf: false }]
function load(node: MoriTreeNode,path: string[]): Promise<MoriTreeNode[]> { return new Promise<MoriTreeNode[]>((resolve) => { setTimeout(() => resolve([{ value: 'design', label: '设计' }, { value: 'development', label: '开发' }]),300) }) }
</script>
```

点击当前层级的路径按钮不改变草稿，也不取消加载或清除错误；只有返回更上层才使当前请求失效。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
