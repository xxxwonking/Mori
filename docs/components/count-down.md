# 倒计时 mori-count-down

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

## 基础用法

复制完整 uni_modules/mori-ui，在 App.uvue 初始化 initMoriTheme，以下组件由 easycom 自动发现。示例数据仅用于说明。图片示例路径请替换成自己的实际资源。

```vue
<template>
  <mori-count-down ref="countdown" :time="60000" :auto-start="false" @finish="finished = true" />
  <mori-button label="开始" @click="countdown?.start()" /><mori-button label="暂停" @click="countdown?.pause()" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriCountDownInstance } from '@/uni_modules/mori-ui/extended-input.uts'
const countdown = ref<MoriCountDownInstance | null>(null)
const finished = ref(false)
</script>
```

## 状态与进阶使用

time 单位毫秒。显示 HH:mm:ss，小时可以超过 24；按真实时间截止点计算，后台延迟不会累积漂移。change(remaining:number) 按秒变化触发；finish() 在一次运行到零时触发一次。start 幂等，pause 保留剩余时长，reset 重读 time 并遵守 autoStart；time 更新重置，卸载取消任务。原生后台行为见 TIMER-01。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| time | number | 0 | 倒计时初始毫秒数。 |
| autoStart | boolean | true | 初始化或重置后自动开始。 |
| label | string | '剩余时间' | 可见操作名称或可访问名称。 |

## 事件、插槽与方法

公开事件：'change', 'finish'。参数、触发条件和提交语义见上文。

公开实例方法：start, pause, reset。需要 ref 时，从 extended-input.uts 导入对应 Mori*Instance 类型；不直接访问内部 setup 状态。

插槽：无。位置见基础用法及状态说明。

## 平台与验证边界

使用全局浅深主题，交互控件继承 36px／13px 基线。H5、微信编译、原生运行证据分别记录在 [兼容记录](../compatibility.md)。原生 iOS／Android、Safari、微信真机、鸿蒙没有本轮设备运行证据；相关差异见 [平台适配清单](../platform-adaptation.md)。示例的结构检查不代表每段示例都已在原生运行。
