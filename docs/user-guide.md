# 使用手册

适用版本：当前未发布的 0.1.0。准确的属性和事件列表见 [组件 API](components.md)，设计尺寸见 [设计规范](../DESIGN.md)。

## 1. 安装和启动

需要 Node.js 22.13+、npm、HBuilderX 及 Vue3 编译器插件。本机使用 HBuilderX 5.34，安装在 `D:\HBuilderX`。

```powershell
cd C:\Users\Administrator\Desktop\mori-ui
npm ci
npm run dev
```

查看终端报告的地址，默认请求 5173 端口。也可以在 HBuilderX 导入 **mori-ui 根目录**，通过运行菜单启动浏览器、小程序或 App。App 目前需要通过 HBuilderX 操作，仓库没有 `build:ios` / `build:android` 命令。

脚本查找不到 HBuilderX 时：

```powershell
$env:HBUILDERX_HOME = 'D:\HBuilderX'
npm run dev
```

开发服务器用于热更新；`npm run build:h5` 加 `npm run preview` 用于查看发行产物。两种服务不要同时占用同一端口。

## 2. 使用组件工作台

左侧导航选择组件；手机宽度时导航位于顶部。切换“组件预览／API 参考”可以操作示例或查看参数。右上角的“自动／浅色／深色”和主题色会同步影响样例与组合表单。

Button 可切换大小、加载和禁用。Input 展示普通、校验、密码和禁用字段。Switch 展示状态文字、独立开启／关闭颜色和尺寸。Checkbox 展示选择与禁用。组合表单支持必填、邮箱、同意选项校验，以及模拟保存和重置。

“保存”仅演示本页成功状态，没有接口请求，也不会把资料持久化到磁盘；刷新会恢复初始状态。

## 3. 复制到其他项目

目标应是 **uni-app x** 工程。当前包不能被当作普通 uni-app `.vue` 组件或标准 Web Vue 包直接安装。

复制 `uni_modules/mori-ui` 整个目录，保留 `components`、`styles`、`platform`、`static`、`theme.uts`、`contrast.uts`、`package.json` 和 `THIRD_PARTY_NOTICES.md`。不需要复制工作台及 `demo-form`。

组件通过 easycom 目录规则使用，无需逐个全局注册。在目标 `App.uvue` 的启动回调初始化主题：

```vue
<script setup lang="uts">
import { initMoriTheme } from '@/uni_modules/mori-ui/theme.uts'

onLaunch(() => {
  initMoriTheme()
})
</script>
```

将下面字段合并到目标 `manifest.json`，保留自己的 AppID 和其他配置：

```json
{
  "uni-app-x": { "vapor": true },
  "app": { "defaultAppTheme": "auto" },
  "web": { "darkmode": true },
  "mp-weixin": { "darkmode": true }
}
```

页面背景和原生导航栏还要参考本项目 `theme.json` / `pages.json` 配置。组件不会替使用方修改整个应用的布局与字体；H5 页面应自行设置系统字体栈，参见工作台的 `workbench.scss`。原生输入、键盘与 SVG 图标在目标设备上仍需验收。

## 4. 全局主题和局部配色

```ts
import { setMoriConfig } from '@/uni_modules/mori-ui/theme.uts'

setMoriConfig({ theme: 'auto' })  // 默认；恢复跟随系统或宿主
setMoriConfig({ theme: 'light' }) // 固定浅色，停止自动跟随
setMoriConfig({ theme: 'dark' })  // 固定深色，停止自动跟随

setMoriConfig({
  color: '#0066d6',
  darkColor: '#8cb6ff',
  softColor: '#eaf2ff',
  darkSoftColor: '#243450'
})
```

配置只更新传入项，不自动持久化。需要记住主题选择时，由业务保存，在下次启动读取、校验后调用 `setMoriConfig`。

`moriThemeMode`、`moriIsDark`、`moriPalette` 是只读 computed，可在模板中使用。实例 `color` 等属性覆盖全局颜色；Switch 开启色按 `activeColor → color → 全局 primary` 取值，关闭色用 `inactiveColor` 或当前主题灰色。实例自定义颜色不会自动生成另一套深色值，可结合 `moriIsDark` 分别传入。

自动文字／勾色计算支持不透明 `#RGB`、`#RRGGBB`、逗号格式 `rgb()`。实心 Button 的其他颜色格式可显式设置 `textColor`；有文字的 Switch 和自定义 Checkbox 建议使用上述已支持格式并检查浅深色效果。

## 5. 四个组件一起使用

下面示例可放入目标项目的页面 `.uvue`。它演示状态绑定和必填校验；点击继续只给出本地提示，不提交数据。

```vue
<template>
  <view class="settings">
    <view class="settings-field">
      <mori-input v-model="name" label="名字" placeholder="请输入名字"
        :error="nameError" clearable required />
    </view>
    <view class="settings-field">
      <mori-input v-model="password" label="密码" type="password" clearable />
    </view>
    <mori-switch v-model="notifications" label="消息通知"
      active-color="#238653" inactive-color="#dce9e1"
      active-text="开启" inactive-text="关闭" />
    <mori-checkbox v-model="accepted" label="我已阅读使用说明" />
    <mori-button label="继续" :disabled="!accepted" block @click="submit" />
  </view>
</template>

<script setup lang="uts">
import { ref, computed } from 'vue'

const name = ref('')
const password = ref('')
const notifications = ref(true)
const accepted = ref(false)
const attempted = ref(false)
const nameError = computed((): string =>
  attempted.value && name.value.trim().length == 0 ? '请填写名字' : '')

function submit() {
  attempted.value = true
  if (nameError.value.length > 0 || !accepted.value) return
  uni.showToast({ title: '校验通过', icon: 'none' })
}
</script>

<style>
.settings { padding: 16px; }
.settings-field { margin-bottom: 12px; }
</style>
```

注意：Input 的 `required` 只表达必填状态，校验由业务负责；`change` 在输入或清空时触发，不是仅在失焦时触发。Button 的 `loading` 会阻止点击。Switch 与 Checkbox 的 `v-model` 都是 boolean，Checkbox 尚无数组分组模式。

## 6. 尺寸与操作反馈

| 组件 | sm | md（默认） | lg |
|---|---|---|---|
| Button 高度 | 28px | 36px | 40px |
| Input 外框高度 | 30px | 36px | 40px |
| 无字 Switch 轨道 | 34×20px | 38×22px | 46×26px |

Checkbox 当前固定为 16px 方框，没有 `size` 属性。Switch 有文字时会预留较长状态词所需的宽度；外部 `label` 与轨道文字是两回事，建议状态词简短。

Switch 使用 180ms 滑块与颜色过渡；Checkbox 使用 160ms 勾的透明度、缩放和颜色过渡。H5 的减少动态效果设置会关闭这些过渡。动画用来说明状态变化，不修改控件的外部尺寸。

## 7. 发布和兼容范围

当前没有 npm 包或插件市场发布流程。本项目 AppID 留空，应在自己的目标应用填写合法的 ID 和运行配置。具体平台证据见 [兼容记录](compatibility.md)，构建和验证方法见 [验证与排障](testing.md)。
