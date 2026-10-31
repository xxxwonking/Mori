# 多行输入 mori-textarea

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

多行文本，支持长度限制、字数和自动高度。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-textarea v-model="bio" label="个人介绍" :maxlength="120" show-word-limit placeholder="介绍一下你自己" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
const bio = ref('')
</script>
```

## 状态与进阶使用

autoHeight 交给平台 textarea 自动增高；默认编辑区 96px。maxlength=-1 不限制，0 不允许输入。showWordLimit 显示 UTF-16 计数，emoji 可能占多个单位。通过 FormItem 的上下文共享错误和标签，建议不要重复填写标签。

## 完整 API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| v-model | string | 空 | 当前文本 |
| label | string | 空 | 独立字段标题及无障碍名称 |
| placeholder | string | 请输入 | 占位提示 |
| hint | string | 空 | 独立使用时的辅助文字 |
| error | string | 空 | 独立使用时的错误文字 |
| color | string | 空 | 焦点边框颜色 |
| required | boolean | false | 必填语义；不自动执行校验 |
| disabled | boolean | false | 禁止输入 |
| maxlength | number | 200 | 用户输入上限；-1 表示不限制 |
| showWordLimit | boolean | false | 显示当前长度／上限；不限长时只显示长度 |
| height | number | 96 | 内部编辑区域高度，单位 px，最小 36；不含边框、内边距和计数 |
| autoHeight | boolean | false | 使用原生自适应高度能力；height 作为最小编辑高度 |

事件：`update:modelValue(value)`、`change(value)` 在用户输入时发出字符串；`focus`／`blur` 无参数；`confirm(value)` 返回当前字符串。控件支持多行输入，不提供 clear、readonly 或自动保存功能。

长度和计数按 UTF-16 code unit 计算，部分字符会计为两个单位。组件限制用户输入，业务代码传入超过 maxlength 的值不会被自动截断，提交时可用 Form 的 maxLength 再校验。FormItem 内使用父级错误与描述关联，并隐藏本地标题／消息；label 非空时仍可覆盖输入的无障碍名称，required 为本地与父级的逻辑或。通常应统一在 FormItem 配置这些字段信息。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
