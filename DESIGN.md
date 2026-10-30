---
name: "Mori UI"
description: "中性灰与清晰蓝的紧凑移动组件，名称暂定。"
colors:
  primary: "#0066d6"
  primary-soft: "#eaf2ff"
  ink: "#1d2430"
  muted: "#616e82"
  border: "#d2dae6"
  surface: "#ffffff"
  ground: "#f6f7f9"
  danger: "#b63d37"
  danger-soft: "#fff2ef"
  dark-primary: "#8cb6ff"
  dark-primary-soft: "#243450"
  dark-ink: "#e8edf5"
  dark-muted: "#afb9ca"
  dark-border: "#3d485a"
  dark-surface: "#1c2028"
  dark-ground: "#111318"
  dark-danger: "#f1a39c"
  dark-danger-soft: "#3c2725"
  on-primary-black: "#000000"
typography:
  control:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "20px"
  control-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "20px"
  control-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  input:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "18px"
  support:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "16px"
  selection-label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
  checkbox-label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "19px"
rounded:
  control: "8px"
  control-sm: "6px"
  checkbox: "5px"
  control-round: "28px"
spacing:
  field-inset: "9px"
  button-inset: "14px"
  button-inset-sm: "10px"
  button-inset-lg: "18px"
  label-gap: "5px"
  message-gap: "4px"
components:
  button-solid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-sm:
    typography: "{typography.control-sm}"
    rounded: "{rounded.control-sm}"
    padding: "0 10px"
    height: "28px"
  button-lg:
    typography: "{typography.control-lg}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "40px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: "0 9px"
    height: "36px"
    width: "100%"
  input-sm:
    height: "30px"
    typography: "{typography.control-sm}"
  input-lg:
    height: "40px"
    typography: "{typography.control-lg}"
  switch-track:
    backgroundColor: "{colors.primary}"
    width: "38px"
    height: "22px"
    rounded: "22px"
  checkbox-box:
    backgroundColor: "{colors.primary}"
    width: "16px"
    height: "16px"
    rounded: "{rounded.checkbox}"
---

# Design System: Mori UI

## Overview

**Creative North Star: "中性灰与清晰蓝的紧凑系统控件"**

Mori UI 采用用户确认的中性灰与清晰蓝、系统字体和紧凑尺寸。颜色说明状态，细边框组织字段；按钮与输入默认 36px，避免高大的控件和宽松的内部留白。

规范以 theme.uts、tokens.scss 和组件源码为准。组件默认跟随系统／宿主主题，light 或 dark 可停止自动跟随。工作台构图不限制业务页面的组织方式。

**Key Characteristics:**

- 36px 默认按钮与输入、13px 控件文字、12px 标签。
- 输入只显示一个闭合边框，显隐与清空使用 Lucide 图标。
- 复选框与开关由组件统一绘制，选中状态平滑过渡。
- 浅深主题使用语义颜色；实例可覆盖品牌色。

## Colors

清晰蓝用于操作与选择，灰阶承载内容、表面和边界，红色只用于错误等语义。运行时颜色来自 theme.uts；frontmatter 记录默认值。

浅色使用 primary、primary-soft、ink、muted、border、surface、ground；深色对应 dark-*。danger 与 danger-soft 保留错误语义。按钮文字、开关状态文字和勾图标对不透明 #RGB / #RRGGBB / rgb() 背景选择黑白前景；特殊颜色格式的实心按钮可用 textColor 覆盖。

**The Semantic Color Rule.** 品牌、内容、边界与错误分别使用语义颜色；切换品牌时同时考虑浅色与深色。

## Typography

H5 使用系统字体栈，Apple 设备优先 SF／苹方，其他设备回退到系统字体。代码区使用 Consolas／SFMono-Regular 等宽字体。字体大小在 frontmatter 中定义；输入常规字重，按钮和字段标签使用中等字重。

**The System Type Rule.** 保留系统字体和紧凑层级，不引入外置展示字体。

## Layout

默认按钮与输入保持紧凑，字段标签间距、内边距和消息间距使用 frontmatter 的 spacing。输入内部默认高度为 32px，小／大档为 26／36px，避免文字裁切。开关和复选框的操作行至少 36px；较小的是可见标记，不把整行点击区域缩成图标大小。

当前工作台在 640px 调整样例排列，1024px 启用 212px 侧栏，1360px 调整列间距。这些仅属于展示页。组合表单字段间隔为 12px。

## Elevation & Depth

基础按钮和输入使用细边框与表面明度，不加装饰投影。H5 开关滑块保留轻微投影（0 1px 3px rgba(0,0,0,0.14)）。

**The Stable State Rule.** 切换状态不改变控件外部尺寸，动画只改变滑块变换、勾的透明度与缩放以及状态颜色。

Switch 滑块 transform 与轨道颜色过渡 180ms ease。Checkbox 勾的 opacity／scale 和方框颜色过渡 160ms ease。H5 在 prefers-reduced-motion: reduce 下取消这些过渡；原生系统减弱动画偏好的接入尚未验证。

## Shapes

普通按钮与输入使用小圆角；sm 再收紧，胶囊按钮必须显式使用 round。复选框是圆角方框，开关是胶囊轨道加圆形滑块。图标来自 Lucide，输入图标 16px、勾图标 12px，使用独立 SVG 文件；随模块保留 THIRD_PARTY_NOTICES.md。

## Components

### Buttons

solid／soft／outline／text 对应实心、柔和、描边和文字层级。默认 md，三档尺寸见 frontmatter。禁用透明度 0.4，按下透明度 0.8；loading 与 disabled 均阻止事件并退出 Tab 顺序。

### Inputs

字段始终使用一条 1px 连续闭合边框。聚焦只改变边框颜色；错误字段聚焦时仍保留错误文字与 aria-invalid，失焦恢复错误边框。不可叠加外置 outline，也不加粗边框造成布局位移。密码显隐使用 eye／eye-off，清空使用 circle-x；两者可以同时出现，并保留可访问名称和键盘操作。

### Switch

自绘轨道与滑块。无字 sm／md／lg 分别为 34×20／38×22／46×26px，滑块比轨道高度小 4px，四周留 2px。activeColor 优先于兼容属性 color，inactiveColor 独立配置；默认关闭色为浅色 #d8dce3、深色 #444b58。

activeText／inactiveText 在轨道内显示，空值不显示。轨道按两种文字中较长者预留宽度，切换不会伸缩；建议用短状态词。外部 label 是选项名称，不替代状态文字。只触发一次受控值更新；禁用时不响应。H5 键盘焦点在轨道周围，操作容器预留空间防止裁切。

### Checkbox

自绘小方框，选中使用当前主色和对比清晰的勾。整行可点选，Enter／Space 可切换，禁用时退出 Tab 顺序。勾图标持续存在，使用透明度和缩放过渡，避免首次勾选时突然插入图片。

### Navigation

当前导航是工作台的展示模式，不是可发布组件。选中通过柔和底色和文字强调区分；移动端横向排列。无需将侧栏尺寸或中英文标签组合固化为业务组件。

### Form foundations

FormItem 统一承载 12px 标签、必填说明和 11px 错误／提示，字段间距 16px。内部 Input／Textarea 不再重复显示标签与消息；实际编辑元素继承字段名称、必填、错误和描述关联。显式校验后逐项修正，仅更新当前字段的错误。

Radio 使用 16px 圆形标记与内点，操作行至少 36px。RadioGroup 只保留一个字符串值；CheckboxGroup 复用已有方框，以数组管理选择，达到数量限制后保留已选项的取消能力。禁用与数量限制必须同时体现在行为和可访问状态上。

Textarea 沿用单一 1px 边框、8px 圆角、13px 文字和 9px 内边距，默认编辑区高 96px；字数显示为 11px。错误和焦点不改变边框宽度，浅深颜色来自全局语义主题。

表单示例页属于工作台：桌面为主表单与说明侧栏，窄屏依次堆叠。页面标题 28px／窄屏 24px、小节标题 15px、表单展示容器 12px 圆角；这些是演示页面层级，不改变可复用控件的尺寸档位。

### Feedback

Toast 使用紧凑、高对比的浮层，文字 13px，成功／失败以随库 Lucide SVG 辅助表达；加载状态有明确文案。轻提示不拦截页面操作，连续调用替换当前提示并重新计时，持续提示必须能够显式关闭。

Popup 的内容表面、标题和边界继承全局浅深主题，遮罩仅承担模态背景。底部弹层保留底部安全区，侧边层在窄屏内留出退出空间，内容过长时在弹层内滚动。新弹层覆盖旧弹层，退出动画结束才释放其层级与滚动锁；默认 280ms 过渡：位移与透明度统一使用 ease-in-out、同步推进。底部面板从屏幕下沿向上浮现，不允许先到最终位置再淡入；居中面板保留缩放淡入，退出同步淡出。H5 自动聚焦不得滚动弹层外壳，外壳使用 overflow: clip，内容区域仍可滚动。遮罩独立淡入淡出。H5 减少动态效果偏好下取消视觉过渡。

Dialog 复用居中 Popup，标题、正文与操作依次排列。确认／取消采用现有 36px 按钮，确认等待期间显示 loading 并阻止重复提交和关闭；业务完成后再控制可见性。H5 键盘焦点保留在最上层模态内容中，关闭后回到触发位置。

反馈演示页沿用表单工作台的标题、圆角和字号层级，按 Toast／Popup／Dialog 三段组织，示例弹层放在页面根级以避开祖先裁切。

## Do's and Don'ts

### Do

- Do 复用已有大小档位和语义主题色。
- Do 保留图标按钮的可访问名称、输入错误关联和键盘操作。
- Do 检查连续切换与减少动态效果偏好。
- Do 将浏览器验证、微信编译和原生设备验证分别记录。

### Don't

- Don't 给输入叠加外置焦点圈或改变聚焦时的边框宽度。
- Don't 依赖宿主 Checkbox / Switch 默认皮肤决定选中效果。
- Don't 用显示、隐藏、清空文字代替已确定的输入操作图标。
- Don't 恢复旧的 40px 默认高度；40px 只作为 lg 档位。
- Don't 把展示页侧栏和手机框推广为所有业务页面的布局规范。
