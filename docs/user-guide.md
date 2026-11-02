# 使用手册

适用版本：当前未发布的 0.1.0。准确的属性和事件列表见 [组件 API](components.md)，设计尺寸见 [设计规范](../DESIGN.md)。

## 1. 安装和启动

需要 Node.js 22.13+、npm、HBuilderX 5.31+ 及 Vue3 编译器插件。以下为 Windows 路径示例，需替换为自己的工程和安装目录；实际验证版本见 [兼容记录](compatibility.md)。

```powershell
cd C:\Users\Administrator\Desktop\mori-ui
npm ci
npm run dev
```

查看终端报告的地址，默认请求 5173 端口。也可以在 HBuilderX 导入 **mori-ui 根目录**，通过运行菜单启动浏览器、小程序或 App。HBuilderX 直接运行打开工作台；官网预览页由 npm 构建时生成并启用，无需为直接 IDE 运行先生成官网文件。App 目前需要通过 HBuilderX 操作，仓库没有 `build:ios` / `build:android` 命令。

脚本查找不到 HBuilderX 时：

```powershell
$env:HBUILDERX_HOME = 'D:\HBuilderX'
npm run dev
```

开发服务器用于热更新；`npm run build:h5` 加 `npm run preview` 用于查看发行产物。两种服务不要同时占用同一端口。

macOS 默认检测 `/Applications/HBuilderX.app/Contents/HBuilderX`。构建脚本会创建临时插件目录，将编译插件链接到已安装的 HBuilderX，并将 Sass 指向本项目锁定的依赖；结束后清理临时目录，不修改 IDE 安装内容。先执行 `npm ci`，再运行构建。

浏览器测试默认使用 Playwright Chromium。若浏览器下载失败，也可指定已安装的 Chrome 可执行文件；例如 macOS 在启动预览后，另开终端运行：

```sh
export MORI_BROWSER_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export MORI_BASE_URL='http://127.0.0.1:5173'
npm test
npm run test:forms
npm run test:motion
npm run test:feedback
```

该环境变量适用于上述验证脚本；记录结果时注明实际浏览器版本，不能把系统 Chrome 的结果写成 Playwright Chromium 的结果。Windows 使用 PowerShell 的 `$env:MORI_BROWSER_EXECUTABLE` 设置实际安装路径。

## 2. 使用组件工作台

宣传官网与逐组件文档可通过 `npm run site:dev` 启动（默认 5180 端口），包含组件搜索、88 份指南及真实 H5 手机预览。构建、主题、二维码和静态部署说明见 [官网维护指南](website.md)。以下是原有组件工作台的使用方式。

左侧导航选择组件；手机宽度时导航位于顶部。切换“组件预览／API 参考”可以操作示例或查看参数。右上角的“自动／浅色／深色”和主题色会同步影响样例与组合表单。

Button 可切换大小、加载和禁用。Input 展示普通、校验、密码和禁用字段。Switch 展示状态文字、独立开启／关闭颜色和尺寸。Checkbox 展示选择与禁用。组合表单支持必填、邮箱、同意选项校验，以及模拟保存和重置。

表单基础入口打开 `pages/forms/forms`，集中展示 Form／FormItem、Radio／RadioGroup、CheckboxGroup 和 Textarea。H5 可直接访问 `http://127.0.0.1:5173/#/pages/forms/forms`；端口以当前服务为准。

反馈与弹层入口打开 `pages/feedback/feedback`，可操作不同类型 Toast、不同位置及嵌套 Popup、确认／取消和等待状态的 Dialog。H5 地址为 `http://127.0.0.1:5173/#/pages/feedback/feedback`。

“保存”仅演示本页成功状态，没有接口请求，也不会把资料持久化到磁盘；刷新会恢复初始状态。

## 3. 复制到其他项目

目标应是 **uni-app x** 工程。当前包不能被当作普通 uni-app `.vue` 组件或标准 Web Vue 包直接安装。

复制 `uni_modules/mori-ui` 整个目录，保留 `components`、`styles`、`platform`、`static`、`theme.uts`、`contrast.uts`、`validation.uts`、`form-context.uts`、`selection.uts`、`feedback.uts`、`overlay.uts`、`package.json` 和 `THIRD_PARTY_NOTICES.md`。不需要复制工作台、`demo-form`、`demo-foundation` 或反馈演示页。

同时复制依赖目录 `uni_modules/mori-upload-ios`。它在 APP-IOS 提供系统相册读取、沙盒临时文件与 URLSession 上传；其他平台不调用该原生分支。首次接入或修改 Swift／Info.plist 后重新制作自定义基座或打包，配置与文件生命周期见 [iOS 模块说明](../uni_modules/mori-upload-ios/README.md)。目前该原生实现仍待 iOS 编译和设备验收。

业务页面的完整接入示例、权限配置、插件 API 与排障步骤见 [iOS 上传插件使用指南](ios-upload.md)，官网左侧「开始使用」中也可进入。

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

注意：Input 的 `required` 只表达必填状态，校验由业务负责；`change` 在输入或清空时触发，不是仅在失焦时触发。Button 的 `loading` 会阻止点击。Switch 与 Checkbox 的 `v-model` 都是 boolean；数组多选使用 CheckboxGroup。

Input 的 `blur(value: string)` 和 `confirm(value: string)` 返回结束编辑时的最终文本，适合主动校验。底层输入事件可能节流，快速输入后需要立即处理时使用事件参数；Stepper 也以此完成上下界和步长归一化，支持负号与小数点草稿。

Search 的 Enter 与搜索按钮使用最终编辑文本，必要时先补齐模型；未改动的值不会重复发 change。需要请求防抖时放在业务 change 处理函数中，明确点击搜索仍可立即提交。

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

## 8. 使用表单基础组件

Form 持有校验错误，业务持有数据；FormItem 统一字段标题、必填提示与错误。下面示例在提交时同步校验；修改后再次提交会刷新错误。它只展示本地成功状态，不访问后端。

```vue
<template>
  <view class="profile">
    <mori-form ref="profileForm" :model="values" :rules="rules">
      <mori-form-item name="name" label="姓名" required>
        <mori-input v-model="name" placeholder="请输入姓名" clearable />
      </mori-form-item>
      <mori-form-item name="role" label="使用身份" required>
        <mori-radio-group v-model="role" :options="roles" />
      </mori-form-item>
      <mori-form-item name="topics" label="关注内容" required hint="请选择 1–2 项">
        <mori-checkbox-group v-model="topics" :options="topicOptions" :max="2" />
      </mori-form-item>
      <mori-form-item name="bio" label="个人介绍" required hint="请填写 5–120 个长度单位">
        <mori-textarea v-model="bio" placeholder="介绍一下自己"
          :maxlength="120" show-word-limit />
      </mori-form-item>
      <mori-button label="保存资料" block @click="save" />
    </mori-form>
    <text>{{ status }}</text>
  </view>
</template>

<script setup lang="uts">
import { ref, computed } from 'vue'
import { MoriFormRule, MoriFormInstance } from '@/uni_modules/mori-ui/validation.uts'
import { MoriChoiceOption } from '@/uni_modules/mori-ui/selection.uts'

const profileForm = ref<MoriFormInstance | null>(null)
const name = ref('')
const role = ref('')
const topics = ref<string[]>([])
const bio = ref('')
const status = ref('')
const values = computed((): UTSJSONObject => ({
  name: name.value,
  role: role.value,
  topics: topics.value,
  bio: bio.value
} as UTSJSONObject))
const roles: MoriChoiceOption[] = [
  { label: '开发者', value: 'developer' },
  { label: '设计师', value: 'designer' }
]
const topicOptions: MoriChoiceOption[] = [
  { label: '组件更新', value: 'components' },
  { label: '设计实践', value: 'design' },
  { label: '跨端开发', value: 'platforms' }
]
const rules: MoriFormRule[] = [
  { name: 'name', required: true, message: '请填写姓名' },
  { name: 'role', required: true, message: '请选择使用身份' },
  { name: 'topics', required: true, minLength: 1, maxLength: 2, message: '请选择 1–2 项关注内容' },
  { name: 'bio', required: true, minLength: 5, maxLength: 120, message: '个人介绍长度应为 5–120' }
]
function save() {
  if (profileForm.value == null) return
  const result = profileForm.value!.validate()
  status.value = result.valid ? '资料校验通过' : '请检查标记的字段'
}
</script>

<style>
.profile { padding: 16px; }
</style>
```

FormItem 的 name、model 顶层键和规则的 name 应一致。required 视觉标记与校验规则分别配置。嵌套使用时，把标签、错误和提示放在 FormItem 上，Input／Textarea 的标题与消息由父级接管；每个 FormItem 建议只包含一个输入控件或选择组。

需要失焦校验时，在业务处理函数中调用 `profileForm.value!.validateField('name')`；该方法只更新指定字段，返回值不能代表全表单有效。`clearValidate('name')` 清一项错误，`clearValidate()` 清全部错误；这两个方法都不重置业务值。新增异步规则请用 validateAsync / validateFieldAsync；name 可使用嵌套路径。resetFields 返回并发出初始 JSON 数据，使用 v-model:model 或 reset 回调接收；详情见 [Form 指南](components/form.md)。

单选值和选项 value 使用 string；多选值使用 string[]，options 的 value 保持唯一。CheckboxGroup 的 max 默认 0，表示不限制；min 控制用户取消操作，不自动补选。校验必选由 Form 的 required／minLength 负责。

运行表单浏览器回归前先构建并启动预览，然后执行 `npm run test:forms`。开发服务器和测试的地址必须一致，使用其他端口时设置 `MORI_BASE_URL`。构建、浏览器与真机结果分别记录，不互相替代。

## 9. 使用反馈与弹层

Toast 用于简短提示，Popup 用于放置自定义内容，Dialog 用于明确确认／取消。将组件放在页面顶层；不要把它们放进带 transform 或裁切的卡片内部。

```vue
<template>
  <view class="feedback-example">
    <mori-button label="显示提示" @click="notify" />
    <mori-button label="打开详情" variant="outline" @click="detailsVisible = true" />
    <mori-button label="确认操作" variant="soft" @click="dialogVisible = true" />
  </view>
  <mori-toast ref="toast" />
  <mori-popup v-model="detailsVisible" title="操作详情" position="bottom">
    <text>这里可以放说明、选项或其他 Mori 组件。</text>
    <mori-button label="完成" @click="detailsVisible = false" />
  </mori-popup>
  <mori-dialog v-model="dialogVisible" title="确认保存"
    message="保存当前修改？" confirm-text="保存"
    @confirm="confirmSave" @cancel="cancelSave" />
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { MoriToastInstance } from '@/uni_modules/mori-ui/feedback.uts'

const toast = ref<MoriToastInstance | null>(null)
const detailsVisible = ref(false)
const dialogVisible = ref(false)

function notify() {
  toast.value?.show({ message: '这是当前页面的轻提示', type: 'text', duration: 2000 })
}
function confirmSave() {
  // 示例只演示本地反馈；实际业务成功后再关闭。
  dialogVisible.value = false
  toast.value?.show({ message: '操作已确认', type: 'success', duration: 2000 })
}
function cancelSave() {
  toast.value?.show({ message: '已取消操作', type: 'text', duration: 1500 })
}
</script>

<style>
.feedback-example { padding: 16px; }
</style>
```

Toast 可重复调用 show 替换当前内容；每次重新计时。等待提示使用 `show({ message: '正在处理', type: 'loading', duration: 0 })`，完成时用新的成功／失败提示替换，或调用 `toast.value?.close()`。loading 本身不会自动取消超时，必须明确传 duration=0。Toast 不阻止背景操作，也不负责业务防重复提交。

也可用 `<mori-toast v-model="toastVisible" message="保存完成" />` 由父级控制显隐。混合使用时，show 会发出 true，父级随后确认 true 不覆盖本次临时配置；父级修改 message／type／duration／position 会覆盖相应值并重新计时。没有 v-model 时，用 ref 的 close 主动关闭。

Dialog 的 confirm 不会自动关闭。实际异步提交时，在处理函数入口设置 `saving=true` 并绑定 `:confirm-loading="saving"`，业务成功后关闭模型，失败时保留弹窗并提供错误反馈，最终恢复 saving。加载期间取消按钮、Escape、遮罩关闭与重复确认均被阻止；由父级主动关闭仍然有效。取消路径会请求 false，通常无需在 cancel 回调里重复赋值。

多个 Popup 可同时存在，新打开的层显示在已有层之上；关闭动画结束前仍由退出中的顶层持有遮罩与焦点。H5 支持焦点限制、关闭后恢复焦点和滚动锁计数。页面顶层挂载仍可能受应用的祖先堆叠上下文影响；当前没有 teleport。原生和小程序的页面滚动需结合各端 page-meta／页面配置处理，具体兼容性以实际记录为准。

构建并启动预览后运行 `npm run test:feedback`，检查提示替换和计时、遮罩／Escape、焦点、嵌套弹层与 Dialog 等待状态。此命令的浏览器结果不替代微信或原生设备验收。


## 10. 常用组件与逐组件文档

当前共88个组件。完整目录及每个组件的最小示例、进阶状态、属性、事件、插槽、方法与平台边界见 [逐组件使用指南](component-guides.md)。全部组件在官网文档页提供真实预览；pages/catalog/catalog 保留组合场景，可从工作台「组件全览」进入。

新增选择器使用两个模型：v-model 是已提交值，v-model:show 是显示状态。临时选择只在确认后写回；取消不会覆盖业务值。Calendar 内联组件使用 string[]，单选也是一个日期的数组；日期为 YYYY-MM-DD，DatetimePicker 时间字符串没有隐式时区转换。

导航条目使用唯一字符串value，跳转由业务处理change事件；fixed导航需要业务预留顶部或底部空间。Popover、Popup与其组合应在页面根级使用，避开裁切或transform祖先。

上传默认选择图片，未配置uploadUrl时仅预览与编辑列表；配置业务地址后支持自动或ref.submit()上传。用resolveUrl解析业务响应，用beforeRead异步筛选，用chooseFiles替换原生选择过程。详细模型和生命周期见 [Upload](components/upload.md)。iOS权限、HEIC、临时路径和后台任务未做真机验收；所有差异有编号和接续步骤，见 [平台适配跟踪](platform-adaptation.md)。


## 媒体、列表与复杂选择

组件全览新增「媒体内容」「组织导航」「选择录入」「列表交互」四类可操作示例。新公开数据结构从 content.uts、extended-input.uts 导入；具体字段与实例类型见每组件指南。

- 媒体：Image／Avatar／AvatarGroup／Swiper／ImagePreview，分别处理占位、失败、组内溢出和受控翻页。
- 内容组织：Card／CellGroup／Grid／Steps／Timeline／Highlight，数据与业务状态由使用方持有。
- 导航：SegmentedControl／Sidebar／DropdownMenu／IndexBar／Fab／BackTop／Sticky／ActionBar／SafeArea。固定层需要接入方预留空间；原生 Sticky 的默认行为详见其指南。
- 输入：Cascader 用 string[] 路径并在确认时提交；TreeSelect 多选叶子；NumberKeyboard＋PasswordInput 可组成验证码输入。
- 反馈与加载：NoticeBar／Result／LoadMore／List／PullRefresh／SwipeCell／CountDown／CountTo。加载类组件需回写完成状态，组件不发真实业务请求。

[当前覆盖范围与后续缺口](component-coverage.md) 明确区分已实现、有限能力和下一批候选，不把同名组件视为完全兼容 Vant／Wot／uview-plus 的全部参数。

## 通用能力补强

本轮新增 16 个组件，总计 88 个。表格、结构化富文本、定高虚拟列表、瀑布流、裁剪、签名、二维码与拖拽等的契约见 [全部指南](component-guides.md)。官网每个文档页提供实际示例；复杂组件的使用范围与原生差异在对应指南明确记录。
