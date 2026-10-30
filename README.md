# Mori UI

一套从基础开始的个人移动端组件库。基于 **uni-app x + Vue + TypeScript/UTS**，以 `uni_modules` 方式复用。

包含 Button、Input、Switch、Checkbox、Form、FormItem、Radio、RadioGroup、CheckboxGroup、Textarea、Toast、Popup、Dialog，共十三个组件。提供组件实验室、表单基础和反馈弹层示例。

## 文档入口

下次 agent 接手请从 [AGENTS.md](AGENTS.md) 和 [交接说明](docs/agent-handoff.md) 开始；后续任务按 [当前进度](docs/progress.md) 衔接。

| 文档 | 用途 |
|---|---|
| [使用手册](docs/user-guide.md) | 安装、运行、跨项目接入、主题、组件组合示例 |
| [设计规范](DESIGN.md) | 配色、字号、尺寸、圆角、图标、选中态与动画 |
| [组件 API](docs/components.md) | 现有组件的属性、事件和使用边界 |
| [当前进度](docs/progress.md) | 已完成、未完成、实际验证结果与下一步建议 |
| [架构说明](docs/architecture.md) | 代码位置、主题数据流、维护规则与已知陷阱 |
| [验证与排障](docs/testing.md) | 按改动选择检查、构建步骤、证据与常见问题 |
| [兼容记录](docs/compatibility.md) | H5、微信、iOS、Android、鸿蒙的真实验证范围 |
| [设计参考](docs/design-references.md) | Vant／Wot 参考与 Lucide 图标来源 |

当前版本未发布；各批组件的构建、浏览器及真机验证范围以 [兼容记录](docs/compatibility.md) 为准，不能用旧组件的历史结果代替新增组件验证。

## 运行项目

环境：Node.js 22.13+、HBuilderX 5.31+、HBuilderX 的 Vue3 编译器插件。此前基础版使用 HBuilderX 5.34；每次构建的实际环境见验证记录。

```powershell
cd C:\Users\Administrator\Desktop\mori-ui
npm install
npm run dev
```

默认打开 `http://127.0.0.1:5173`。脚本自动检测 `D:\HBuilderX`、`C:\HBuilderX` 或 macOS 的 `/Applications/HBuilderX.app/Contents/HBuilderX`，也可自行指定安装目录：

```powershell
$env:HBUILDERX_HOME = 'D:\HBuilderX'
npm run dev
```

也可以直接在 HBuilderX 中导入 **mori-ui 根目录**，选择「运行 → 运行到浏览器 / 小程序 / 手机」。原生 App 使用 `manifest.json` 中配置的蒸汽模式；H5 / 小程序由编译器选择对应渲染路径。

```powershell
npm run build:h5      # H5 发行构建
npm run build:weixin  # 微信小程序构建
npm run preview       # 预览 H5 构建产物
npm run check         # 工程配置、easycom 目录和浏览器依赖边界检查
npm test              # 需先启动预览；运行真实浏览器交互检查
npm run test:unit     # 按钮文字对比度、表单校验与选择逻辑回归
npm run test:motion   # 检查实际动画中间帧、连续切换及减少动态效果设置
npm run test:forms    # 需先启动预览；表单校验、选择组、多行输入和主题交互
npm run test:feedback # 需先启动预览；Toast 计时、弹层、焦点和 Dialog 交互
```

测试使用 Playwright。如果电脑没有浏览器运行时，先执行 `npx playwright install chromium`。

从工作台进入表单基础示例，或访问 `http://127.0.0.1:5173/#/pages/forms/forms`。示例包含必填校验、单选、分组多选和多行输入；提交只展示本地结果。接入代码见 [使用手册](docs/user-guide.md#8-使用表单基础组件)。

反馈与弹层示例位于 `http://127.0.0.1:5173/#/pages/feedback/feedback`，可操作 Toast、不同位置和嵌套 Popup、确认及等待中的 Dialog。接入代码见 [反馈组件用法](docs/user-guide.md#9-使用反馈与弹层)。

`manifest.json` 的 DCloud AppID 与微信 AppID 留空，请使用自己的 ID。App 签名、发行配置与真机验证尚未完成。本项目不依赖云服务，不开启统计。

## 在其他项目中复用

将 `uni_modules/mori-ui` 整个目录复制到另一个 **uni-app x** 项目的 `uni_modules` 目录。保留整个目录（含 components、styles、platform、static、theme.uts、contrast.uts、validation.uts、form-context.uts、selection.uts、feedback.uts、overlay.uts 及图标许可）；组件按 easycom 规则自动导入。

在目标项目的 `App.uvue` 初始化一次主题监听：

```vue
<script setup lang="uts">
import { initMoriTheme } from '@/uni_modules/mori-ui/theme.uts'

onLaunch(() => {
  initMoriTheme()
})
</script>
```

目标项目的 `manifest.json` 设置：

```json
{
  "uni-app-x": { "vapor": true },
  "app": { "defaultAppTheme": "auto" },
  "web": { "darkmode": true },
  "mp-weixin": { "darkmode": true }
}
```

如果需要页面背景、原生导航栏一起适配，参考本项目的 `theme.json` 和 `pages.json` 配置。只复制组件目录不能自动修改目标应用的配置。

```vue
<template>
  <view>
    <mori-input v-model="name" label="你的名字" placeholder="请输入" clearable />
    <mori-button label="保存" :loading="saving" block @click="save" />
  </view>
</template>

<script setup lang="uts">
import { ref } from 'vue'
const name = ref('')
const saving = ref(false)
function save() {
  // 在这里执行自己的校验与业务逻辑。
}
</script>
```

## 全局主题

**默认 `auto`**。App 跟随 OS 主题；H5 与小程序跟随浏览器或微信宿主主题。

```ts
import { setMoriConfig } from '@/uni_modules/mori-ui/theme.uts'

setMoriConfig({ theme: 'auto' })  // 跟随系统 / 宿主（默认）
setMoriConfig({ theme: 'light' }) // 固定浅色，关闭自动跟随
setMoriConfig({ theme: 'dark' })  // 固定深色，关闭自动跟随
```

切换配置会更新已显示的所有组件。手动固定后，系统变化不会覆盖选择；重新切回 `auto` 时，会立即采用当前系统主题。

```ts
setMoriConfig({
  color: '#465ba3',        // 浅色主题中的品牌色
  darkColor: '#b1bfff',    // 深色主题中的品牌色
  softColor: '#edf0fb',    // 浅色柔和背景
  darkSoftColor: '#2a324d' // 深色柔和背景
})
```

`setMoriConfig` 只修改传入项，未传入的配置保持原值。实例的 `color` / `softColor` 属性优先于全局值。不要只设置浅色品牌色而忽略深色配色的可读性。

配置不自动持久化。需要记住用户选择时，由业务使用 `uni.setStorageSync` 保存，并在启动时读出调用 `setMoriConfig`。系统键盘、文件选择器等系统 UI 不由组件库控制。

## 目录

```text
mori-ui/
├─ App.uvue / main.uts / manifest.json / pages.json / theme.json
├─ uni_modules/mori-ui/      # 可复制复用的组件库
│  ├─ components/           # 十三个基础、表单与反馈组件
│  ├─ styles/tokens.scss    # 尺寸、间距、基础样式
│  ├─ validation.uts        # 同步表单校验与公开类型
│  ├─ form-context.uts      # 表单错误与字段无障碍上下文
│  ├─ selection.uts         # 单选、多选与输入长度逻辑
│  ├─ feedback.uts          # Toast 类型与计时逻辑
│  ├─ overlay.uts           # 弹层栈与生命周期逻辑
│  └─ theme.uts             # 全局配置、亮暗配色、系统主题监听
├─ pages/index/             # 组件实验室，响应式布局
├─ pages/forms/             # 表单基础示例页
├─ pages/feedback/          # Toast、Popup、Dialog 示例页
├─ components/demo-form/    # 组合示例，不属于核心组件库
├─ components/demo-foundation/ # 新表单组合，不属于核心组件库
├─ scripts/                 # 开发、构建、预览与验证
├─ docs/components.md       # 组件 API
├─ docs/compatibility.md    # 真实验证范围
├─ PRODUCT.md               # 产品约束
└─ DESIGN.md                # 设计规范
```

默认采用偏 Apple 风格的中性灰 + 蓝色、系统字体与紧凑尺寸。按钮和输入框默认 36px 高、13px 文字，字段标签 12px。输入采用单一闭合焦点边框与 Lucide 操作图标。Switch 支持 activeColor / inactiveColor、activeText / inactiveText 和三种尺寸；Checkbox 使用 16px 圆角方框。开关滑块与复选框选中状态有 160–180ms 过渡，H5 尊重减少动态效果偏好。H5 优先使用系统 SF / 苹方；其他设备回退到自己的系统字体。

未发布 npm 或插件市场，项目名称 Mori UI 暂定，可随时调整。
