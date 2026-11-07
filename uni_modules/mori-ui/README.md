# Mori UI

面向 uni-app x 的紧凑移动组件库，88 个 easycom 组件，使用 `.uvue` / UTS。默认黑白中性主题、36px 按钮／输入、13px 控件文字，并支持自动浅深主题和颜色覆盖。

## 安装

同时将 `mori-ui` 和 `mori-upload-ios` 两个目录复制到项目的 `uni_modules/`。保留目录结构、LICENSE、静态图标和第三方声明。最低 HBuilderX 声明见 package.json；本库不是普通 Vue 或 uni-app `.vue` 组件包。

在 `App.uvue` 初始化主题：

```vue
<script lang="uts">
import { initMoriTheme } from '@/uni_modules/mori-ui/theme.uts'
export default {
  onLaunch() { initMoriTheme() }
}
</script>
```

在页面使用 easycom：

```vue
<template>
  <mori-input v-model="name" label="姓名" placeholder="请输入姓名" clearable />
  <mori-button label="保存" @click="save" />
</template>
<script setup lang="uts">
import { ref } from 'vue'
const name = ref('')
function save() { /* 由业务处理保存 */ }
</script>
```

## 主题与定制

`setMoriConfig` 支持 `light`／`dark` 语义颜色增量配置；旧 `color`／`darkColor`／`softColor`／`darkSoftColor` 保持有效。`resetMoriConfig()` 清除自定义颜色并恢复跟随系统。默认黑白配色和控件尺寸不变。

Button、Input／Textarea、Switch、Checkbox／Radio 及组、Tabs、Popup／Dialog 提供显式颜色覆盖。颜色不改变禁用、加载、错误或事件规则。完整参数与优先级见 [主题与组件定制](https://github.com/xxxwonking/Mori/blob/master/docs/theme-customization.md)。

`setMoriConfig({ messages: { required: 'Required', clearInput: 'Clear input', closePopup: 'Close panel' } })` 可实时覆盖内置操作提示。共有 17 项可配置提示，现有组件 label／confirmText 等业务参数继续生效；这不是完整语言包。`resetMoriConfig()` 恢复默认颜色、中文提示与 auto 主题。

## 手机接入

Popup 在页面根级使用；正文独立滚动，标题和关闭入口保持可见。Navbar 的顶部安全区需要显式开启，Tabbar／ActionBar／Popup 默认预留底部安全区，避免与页面重复补偿。固定组件仍需页面预留正文空间。SafeArea 自动模式随宿主窗口变化更新。

iOS 上传依赖同级原生模块，需按其 README 配置权限及自定义基座。H5 和微信编译通过不代表全组件真机通过；系统键盘、Safari 输入缩放、微信运行、Android／iOS、鸿蒙及字体缩放仍须按目标设备验收。

## 文档与许可

- [完整指南](https://github.com/xxxwonking/Mori/blob/master/docs/user-guide.md)
- [全部组件](https://github.com/xxxwonking/Mori/blob/master/docs/component-guides.md)
- [移动端接入](https://github.com/xxxwonking/Mori/blob/master/docs/mobile-adaptation.md)
- [兼容记录](https://github.com/xxxwonking/Mori/blob/master/docs/compatibility.md)

项目采用 [MIT](LICENSE)，第三方图标与算法许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。当前 0.1.0 为开发版本，尚未正式发布。
