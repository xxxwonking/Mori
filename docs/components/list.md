# 滚动列表 mori-list

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="load"><mori-cell v-for="item in rows" :key="item" :title="item" /></mori-list>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const rows = ref<string[]>([])
const loading = ref(false)
const error = ref(false)
const finished = ref(false)
function load() { setTimeout(() => { rows.value = rows.value.concat(['示例条目']); finished.value = rows.value.length >= 3; loading.value = false }, 300) }
</script>
```

## 状态与进阶使用

独立 scroll-view，height 必须是有效容器高度。接近底部 offset(px) 或点击更多时发 load()，同步锁防止重复请求。必须绑定 v-model:loading，业务结束后置 false；失败同时置 error=true。finished 禁止继续加载，失败只允许显式重试。默认挂载请求一次；不会循环自动填满视口。check() 用于业务主动请求下一页。LIST-01 跟踪真机滚动。

## 属性

load 可以同步完成或异步完成；组件在 Vue 更新后核对 loading，避免同步 true→false 被批处理合并后锁死。业务仍须回写最终 loading 状态。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| loading | boolean | false | 请求进行中，必须由业务在结束时置 false。 |
| finished | boolean | false | 已加载完所有数据，停止下一页请求。 |
| error | boolean | false | 请求失败状态或错误消息，见类型。 |
| height | string | '320px' | 容器高度；字符串为 CSS 长度，数值为 px。 |
| offset | number | 80 | 距离底部触发阈值，单位 px。 |
| immediateCheck | boolean | true | 挂载时请求一次数据。 |

## 事件、插槽与方法

公开事件：'update:loading', 'update:error', 'load'。参数、触发条件和提交语义见上文。

公开实例方法：check。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：default。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
