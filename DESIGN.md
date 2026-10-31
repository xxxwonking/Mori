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
  card-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "22px"
  keyboard-key:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "18px"
    lineHeight: "20px"
  count-down:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: "28px"
  count-to:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Segoe UI', 'Microsoft YaHei', sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
rounded:
  control: "8px"
  control-sm: "6px"
  checkbox: "5px"
  control-round: "28px"
  container: "12px"
spacing:
  field-inset: "9px"
  button-inset: "14px"
  button-inset-sm: "10px"
  button-inset-lg: "18px"
  label-gap: "5px"
  message-gap: "4px"
  content-inset: "16px"
  compact-gap: "6px"
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
  tag-primary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "5px"
    padding: "2px 7px"
  tag-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "5px"
    padding: "2px 7px"
  tabs-active:
    textColor: "{colors.primary}"
    rounded: "0px"
    padding: "0 14px"
  calendar-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control-sm}"
    padding: "4px 0"
  calendar-range-middle:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control-sm}"
    padding: "4px 0"
  popover-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "6px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "{spacing.content-inset}"
  avatar:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "50%"
    width: "36px"
    height: "36px"
  segmented-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control-sm}"
    padding: "0 10px"
  steps-marker:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "50%"
    width: "24px"
    height: "24px"
  keyboard-key:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.keyboard-key}"
    rounded: "{rounded.control-sm}"
    padding: "0 10px"
  password-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-sm}"
    height: "40px"
  swiper:
    height: "180px"
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

新增组件沿用这些语义：标签与范围选择使用柔和底色，导航强调和数值进度使用主色，徽标与失败状态使用 danger。日历选中端点使用运行时 onPrimary，Badge 与 Notify 按实际背景选择黑白前景；frontmatter 的日历文字仅记录默认浅色结果，深色或自定义品牌时不能固定白字。

**The Semantic Color Rule.** 品牌、内容、边界与错误分别使用语义颜色；切换品牌时同时考虑浅色与深色。

## Typography

H5 使用系统字体栈，Apple 设备优先 SF／苹方，其他设备回退到系统字体。代码区使用 Consolas／SFMono-Regular 等宽字体。字体大小在 frontmatter 中定义；输入常规字重，按钮和字段标签使用中等字重。

**The System Type Rule.** 保留系统字体和紧凑层级，不引入外置展示字体。

## Layout

默认按钮与输入保持紧凑，字段标签间距、内边距和消息间距使用 frontmatter 的 spacing。输入内部默认高度为 32px，小／大档为 26／36px，避免文字裁切。开关和复选框的操作行至少 36px；较小的是可见标记，不把整行点击区域缩成图标大小。

当前工作台在 640px 调整样例排列，1024px 启用 212px 侧栏，1360px 调整列间距。这些仅属于展示页。组合表单字段间隔为 12px。

List、PullRefresh 与 IndexBar 使用明确高度的独立滚动区，默认 320px；接入时按所在容器设置 height。Grid 默认四列，可指定一至八列，项目可换行且至少 80px 高。固定 ActionBar、Fab 与 BackTop 需要页面为正文、底栏和安全区预留空间；SafeArea 只承担独立占位，避免与页面重复补偿。

## Elevation & Depth

基础按钮和输入使用细边框与表面明度，不加装饰投影。H5 开关滑块保留轻微投影（0 1px 3px rgba(0,0,0,0.14)）。

**The Stable State Rule.** 切换状态不改变控件外部尺寸，动画只改变滑块变换、勾的透明度与缩放以及状态颜色。

Switch 滑块 transform 与轨道颜色过渡 180ms ease。Checkbox 勾的 opacity／scale 和方框颜色过渡 160ms ease。H5 在 prefers-reduced-motion: reduce 下取消这些过渡；原生系统减弱动画偏好的接入尚未验证。

Transition 默认 180ms ease-in-out，以 fade／slide-up／zoom 改变透明度和变换；Loading 默认 800ms 线性旋转，Skeleton 默认 1.4s 明暗脉冲。Tabs、Progress、Collapse 使用 180ms 状态过渡，Rate 使用 160ms 背景过渡；H5 减少动态效果时关闭这些 CSS 动画与过渡。Slider 的位置直接跟随输入，H5 轨道颜色取消宿主过渡，使主题更新即时生效。ActionSheet、Picker、DatetimePicker 继承 Popup 的 280ms 进出，不另建弹层动效。

SegmentedControl 与 Sidebar 以 180ms ease 过渡背景和文字；SwipeCell 拖动时直接跟手，释放后以 180ms ease-in-out 平移到开／关位置。Swiper 使用宿主 280ms 切换，默认不自动播放。CountTo 默认 800ms 三次减速插值，CountDown 按实际剩余秒数更新。H5 减少动态效果时取消新增 CSS 过渡、停止 Swiper 自动播放并将切换时长归零，CountTo 直接显示终值，BackTop 将宿主滚动时长由 280ms 归零。Cascader、DropdownMenu 和 ImagePreview 继续复用已有弹层生命周期。

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

工作台的侧栏导航是展示模式，不是可发布组件。选中通过柔和底色和文字强调区分；移动端横向排列。无需将侧栏尺寸或中英文标签组合固化为业务组件。

Navbar、Tabs、Tabbar、Pagination 是独立导出组件。Navbar 使用表面色与底部细边框，标题居中，操作位于两侧；内容行至少 44px、标题 15px。固定定位与顶部安全区由使用者显式开启。

Tabs 以主色文字和始终预留的 2px 底边框表达当前项，未选中边框透明；项目横向滚动，操作行至少 40px。Tabbar 使用主色文字与柔和底色，图标和 11px 标签上下排列，项目至少 48px；固定定位默认关闭，底部安全区默认开启。Pagination 沿用 36px 操作按钮，当前页用柔和底色，边界前后页禁用，窄容器可换行。

这些组件的禁用项需同时保留行为约束与可访问状态；Tabs 使用左右键跳过禁用项。交互按钮复用共享 reset：至少 36px、13px 文字、禁用透明度 0.4，H5 焦点框收在按钮内；组件的专用行高不改变基础 Button／Input 的默认尺寸。

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

ActionSheet 复用底部 Popup，以细分隔线组织至少 44px 的操作行，危险操作用 danger 文字；说明文字 11px，取消区使用 ground。加载与禁用操作不能触发选择，空列表显示 Empty。

Popover 的触发器使用主色文字与柔和底色；菜单使用 surface、1px border 和 8px 圆角，不添加投影。菜单按触发器的屏幕位置固定放置，边缘至少留 8px，必要时翻到上方，长菜单在内部滚动；H5 视口变化或滚动时关闭。它复用浮层层级和键盘管理，未提供跨端 portal，需避免被业务祖先裁切。

Notify 使用顶部通栏，普通通知用 primary、错误用 danger，并自动配对前景；正文 13px，可关闭操作 12px。重复调用替换当前内容与计时；持续通知可显式关闭，不靠动画或颜色单独表达结果。

### Display foundations

Text 默认 13px，使用正文／辅助／主色／危险四种语义，允许显式字号与颜色。Icon 默认 18px，延续随库 Lucide SVG 与浅深色资源；带语义的图标有名称，装饰图标不重复朗读。Divider 使用 1px 边界色线条和 12px 辅助文字。

Tag 以 11px 文字和小圆角表达轻量状态，primary／danger／default 分别复用主色柔和底、危险柔和底和中性地色；plain 使用透明底与对应语义描边。关闭按钮仍用图标并保留操作名称。Badge 使用 danger 与自动前景；容器始终预留顶部 6px、右侧 8px，16px 数字标记或 6px 圆点留在边界内，显隐不改变这份占位。

Cell 使用 surface 和单一底部分隔线，至少 44px，标题／值 13px、说明 11px；长内容可换行，右侧值不超过 55%。Collapse 使用同一边界色和整行按钮，展开区域承接正文，箭头旋转表达展开状态；禁用项保留可见说明。

Progress 使用主色填充与边界色轨道，默认轨道 4px，百分比为 11px；有可访问的数值范围。Loading 使用主色环段与边界色圆环，附加文字 12px。Skeleton 复用边界色占位，默认三行、末行缩为 60%，可选 36px 圆形头像。Empty 以 28px 图标、13px 标题、12px 说明和可选操作提供空态。

### Numeric and search inputs

Search 直接组合 Input 与文字 Button，沿用单一边框、清空图标、36px 默认高度；键盘搜索与按钮提交表达同一操作。

Stepper 使用 36px 增减按钮、68px 输入容器与两侧 6px 间距，底部对齐有标签的输入。输入复用 Input，草稿允许小数或负号的编辑中间态，失焦／确认后按范围与步长规范化；边界按钮禁用，不能通过回填跳动打断输入。

Slider 使用主色的活动轨道和 20px 滑块、边界色背景轨道；H5 可访问名称与禁用状态同步到实际 range 输入。Rate 默认五个 36px 星形操作，选中范围使用柔和底色，星形本身沿用主题图标；只读与禁用阻止修改。

### Choice and date inputs

Picker 组合 RadioGroup、Loading、Empty 和底部 Popup，以草稿选择、取消、确认组织操作；加载或无有效选项时禁用确认，不另造滚轮皮肤。

Calendar 使用七列日期网格。日期按钮至少 44px，单元格至少 46px；月标题 14px、星期 11px、日期标记 9px。单选、多选以及范围端点使用 primary／onPrimary，中间日期使用 soft／primary；选择只改变颜色，不能改变日期格外部尺寸。禁用日期不可选，区间受限时显示文字说明，确认使用既有 Button。

DatetimePicker 组合 Calendar 与 Stepper，按 date／time／datetime 显示日期和时间，摘要用辅助色或错误色；取消保留原值，确认才提交有效草稿。Picker 与 DatetimePicker 的操作使用现有 36px Button，继承 Popup 的主题、动效和关闭生命周期。

### Upload

Upload 以列表展示图片，文件行使用 1px 主题边框、8px 圆角、8px 内边距与 48px 缩略图。文件名 12px，提示与状态 11px；上传中复用 Progress，失败使用 danger 文字与明确重试操作。选择按钮复用 outline Button，删除使用带名称的图标。等待、上传中、完成、失败都保留文字说明，不能仅以图片或颜色表达状态。

### Media and identity

Image 默认占满容器宽度、高 160px、8px 圆角，地色承载加载和失败占位；占位沿用 Loading、图标与 12px 文案。换图时重置状态，图片加载不改变外部尺寸。Avatar 默认圆形，方形版本使用 8px 圆角；默认尺寸见 frontmatter，失败后显示姓名首字与主色柔和底。AvatarGroup 用表面色细边分隔重叠头像，超出数量用明确的数字说明。

Swiper 的标题位于图片内的主题表面上，文字 13px；指示点使用主色。只有当前页进入 Tab 顺序，左右键翻页后将焦点移到新页，H5 聚焦不滚动容器。ImagePreview 使用居中 Popup、适应完整图片的 280px 图片区和小档翻页按钮；空集合显示 Empty。默认仅浏览和翻页，宿主缩放需显式启用 nativePreview。

### Cards and content status

Card 以一条 1px 边界、主题表面和容器圆角组织内容，无投影；尺寸见 frontmatter。标题使用 card-title 层级，说明 12px，头部间距 4px、头部与内容间距 12px。CellGroup 以 12px 辅助标题与 11px 说明分组，内侧左右留 12px，默认内容圆角 8px；分隔线由内部 Cell 控制。

Grid 以 24px 图标、13px 标签和可选 11px 说明组成独立入口，1px 边界和 8px 圆角沿用基础形状。Steps 使用圆形序号或完成勾、1px 连接线、13px 标题与 11px 说明，当前步骤用主色，错误步骤用错误语义；支持横向和纵向。Timeline 使用更小的 8px 圆点与纵向细线，正文 13px、时间和说明 12px。

Highlight 在原文内以主色与柔和底标记匹配片段，不注入 HTML。NoticeBar 是可换行的内联公告：柔和底、12px 正文、图标关闭和可选文字操作，不使用跑马灯。Result 以 52px 圆形图标底、16px 标题和 12px 说明表达结果，操作沿用插槽内的已有组件。CountDown 与 CountTo 的独立数字层级见 frontmatter，H5 使用等宽数字排列，颜色仍为正文色。

### Extended navigation and layout

SegmentedControl 与 Sidebar 在地色容器中以表面色和主色文字突出当前项，控件文字 13px、操作项至少 36px；容器内边距与项间距均为 3px。前者横向均分且可换行，后者纵向、最小宽 92px。两者以方向键循环选择并跳过禁用项；选中不改变边框或外部尺寸。DropdownMenu 用 outline Button 打开底部 Picker，取消保留原值，确认才应用筛选。

ActionBar 以顶部分隔线和主题表面托起摘要及已有按钮，内边距 10px 16px，内容可换行；默认普通流，底部安全区默认开启。Fab 复用 round Button，展开菜单使用表面色、1px 边界和 8px 圆角；BackTop 复用小档 outline Button。Sticky 在 WEB／微信使用 CSS sticky，App 默认普通流，受控 fixed 由业务驱动并提供占位高度。这些组件的布局能力不表示所有目标平台都已运行验收。

### Hierarchical and code inputs

Cascader 在底部 Popup 中以可换行的已选路径、至少 44px 的分隔选项行和取消／确认按钮呈现层级；末级才允许确认，加载、禁用和无有效路径时禁用确认。TreeSelect 用每层 16px 缩进、分支箭头和既有 Checkbox 组织树，只选择叶子；到达上限仍可取消已选项。

NumberKeyboard 是内联三列键盘，可放入 Popup；地色容器、表面色按键、至少 44px 键高和 keyboard-key 文字层级用于数字操作。PasswordInput 是受控展示格，以一条 1px 边框、6px 圆角和 compact-gap 间距表达每位字符；默认遮掩圆点，焦点与错误只改变描边颜色，说明使用 11px。点击请求业务展开键盘，可访问名称只描述已输入位数；这套组合不提供密码验证或安全键盘能力。

### Lists and gesture feedback

LoadMore 以至少 48px 的状态行、加载文案、结束文案与明确重试操作区分状态，错误操作使用 danger。List 组合该状态行与内容插槽，加载中阻止重复请求；PullRefresh 组合宿主下拉刷新与显式刷新按钮，键盘仍有入口。业务完成后应同步归还 loading 状态，包括同一更新批次内完成的请求。

IndexBar 将内容滚动区与 40px 索引栏并排，索引操作为 36px，标题和索引文字 12px；索引选择与有效模型变化驱动定位，异步新增或重排分组后仍按索引值找目标，自由滚动不自动改变模型。SwipeCell 保持外框尺寸，以内容平移揭示右侧单一操作；危险操作用错误柔和底和错误文字，保留显式展开／收起按钮及竖向滚动优先行为。操作只发事件，不替业务删除条目。

组件全览、两个 demo-extended 以及媒体／组织导航／选择录入／列表交互四个新增组合均属于工作台；其分组、容器宽度和示例反馈不能作为业务布局约束。七十二组件的独立用法见 docs/component-guides.md；这里记录视觉应用，不扩大 docs/compatibility.md 中的平台证据。

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
- Don't 恢复 Button／Input 旧的 40px 默认高度；两者 40px 仅作为 lg 档位，PasswordInput 的独立密码格不属于该档位。
- Don't 把展示页侧栏和手机框推广为所有业务页面的布局规范。
