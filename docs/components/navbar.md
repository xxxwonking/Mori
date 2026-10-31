# 导航栏 mori-navbar

[全部组件](../component-guides.md) · [接入与主题](../user-guide.md) · [平台跟踪](../platform-adaptation.md)

页面顶部导航，左右操作均由业务决定。

## 基础用法

复制模块并在 App.uvue 调用 initMoriTheme 后，可直接使用 easycom；示例用于 .uvue，脚本语言为 UTS。

```vue
<template>
  <mori-navbar title="编辑资料" left-arrow left-text="返回" right-text="保存" @clickLeft="back" @clickRight="save" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
function back() { uni.navigateBack() }
function save() { /* 校验并保存 */ }
</script>
```

## 状态与进阶使用

左右操作触发 clickLeft / clickRight，无参数。right slot 在未设置 rightText 时使用。fixed=true 固定到页面顶端，业务必须给正文预留高度；safeAreaInsetTop 默认 false，自定义导航页按端启用。标题居中，长文本应控制长度。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| title | string | "" | 标题；弹层同时用作可访问名称。 |
| leftText | string | "" | 左侧操作文字。 |
| leftArrow | boolean | false | 显示返回箭头。 |
| rightText | string | "" | 右侧操作文字。 |
| fixed | boolean | false | 固定定位；业务须预留内容空间。 |
| safeAreaInsetTop | boolean | false | 按支持端的 CSS 安全区增加顶部内边距。 |

## 事件、插槽与方法

公开事件：`clickLeft`、`clickRight`。事件载荷和触发时机见本页状态说明。

没有公开实例方法。

插槽：`right`，具体位置见基础用法及状态说明。

## 平台与验证边界

浅深主题使用库内语义颜色，H5 由系统字体继承，默认控件沿用 36px / 13px。H5、微信构建与设备运行证据分开记录在 [兼容记录](../compatibility.md)。原生 iOS / Android、Safari、微信真机和鸿蒙没有本轮设备验收，不据编译结果推断可用性。涉及弹层、安全区、图片、输入键盘或动态效果的差异按 [平台适配清单](../platform-adaptation.md) 跟进。
