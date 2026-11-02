# 验证、构建与排障

官网验证单独使用 `npm run site:build`、`npm run site:preview`、`npm run test:site`。测试会检查全部 72 个 H5 示例的实际挂载与 360px 溢出、72 个文档地址，以及首页交互、搜索、二维码、预览主题／重置、弹层及 1440／1280／768／390px 布局。`node scripts/verify-site.mjs --layout` 只复核官网交互和布局，保留先前的全组件巡检记录。产物为 `.impeccable/review/site-*.png` 和 `site-verification.json`／`site-layout-verification.json`，详见 [官网说明](website.md)。这不是全部组件全状态或真机验收。

先根据改动范围选检查。以下是可复现流程，不要求每个任务重复全部执行。已经取得的平台证据见 [兼容记录](compatibility.md)。

## 按改动选择检查

| 改动 | 建议验证 |
|---|---|
| 文档／注释 | 文件链接、命令、API 参数和事实来源核对 |
| 颜色推导 | `npm run test:unit`；影响主题时再看浅深效果 |
| 组件目录／配置 | `npm run check` 和目标平台构建 |
| 控件行为／主题／工作台 | H5 构建 + `npm test`，查看相关截图 |
| Switch／Checkbox 动画 | 以上检查加 `npm run test:motion` |
| 跨端样式／UTS／原生行为 | H5／微信相关检查，加目标原生构建与设备验证 |

`npm run check` 只检查部分配置、目录和核心组件的浏览器全局依赖，不能替代编译。静态截图不能证明动画顺畅，动画采样也不能保证所有设备的帧率。

## 一次完整的本机 H5 检查

在项目根目录、终端 A 中：

```powershell
npm ci
npm run check
npm run test:unit
npm run build:h5
npm run preview
```

逐条执行并检查退出码；某一步失败时先定位原因。`npm run preview` 是常驻服务，保留终端 A，在终端 B 执行：

```powershell
npm test
npm run test:motion
```

Playwright 缺少浏览器时执行 `npx playwright install chromium`。截图由 `npm test` 更新，默认使用 Chromium、减少动态效果；动画脚本另开无减弱动画的页面进行采样。

不要同时用开发服务器与静态预览占用 5173。静态预览可改用 5174，在终端 A 启动前设置：

```powershell
$env:PORT = '5174'
npm run preview
```

终端 B 对应设置：

```powershell
$env:MORI_BASE_URL = 'http://127.0.0.1:5174'
npm test
npm run test:motion
```

环境变量只需在当前终端设置。改源码后重新构建静态产物，浏览器刷新后再验证；不要对旧产物报告“新代码通过”。

## 微信和原生

`npm run build:weixin` 输出到 `unpackage/dist/build/mp-weixin`。导入微信开发者工具后，使用自己的项目身份与运行配置，逐项操作四组件、主题、图标、文字、禁用及连续切换。

App 通过 HBuilderX 的运行菜单处理。分别记录 Android、iOS、鸿蒙的编译器／系统／设备与结果，检查软键盘、确认键、密码显隐、光标、安全区、字体缩放、主题切换和 SVG／动画。当前仓库没有已验证的原生自动化脚本或可复用签名。

## 产物和证据

| 路径 | 内容 |
|---|---|
| `unpackage/dist/build/h5/` | H5 发行构建 |
| `unpackage/dist/build/mp-weixin/` | 微信发行构建 |
| `.impeccable/review/verification.json` | 9 组功能检查、错误列表、浏览器版本、生成时间 |
| `.impeccable/review/motion-verification.json` | 动画采样、布局尺寸和通过项目 |
| `.impeccable/review/*.png` | 桌面／手机、浅／深、Input／Switch／Checkbox 等截图 |
| `.impeccable/review/verdict.md` | 最近五项修复的替代复核与范围说明 |

`review/` 被 Git 忽略。报告中的 `generated` 使用 UTC ISO 时间，面向用户说明时转换到所在时区。后续执行测试会覆盖同名证据，若需保留前后对比，应在修改前另存已核实的基线。

本机 `.impeccable/build-h5.log` / `build-weixin.log` 是此前手动重定向生成的日志，并非 npm 命令一定会自动写出的文件。需要新日志时在构建命令后使用 PowerShell 重定向，并检查该次进程退出码，不能只读旧日志尾部。

## 常见情况

| 现象 | 定位与处理 |
|---|---|
| 找不到 HBuilderX 编译器 | 确认 Vue3 编译器插件已安装；设置 `HBUILDERX_HOME` 后重试。不要把普通 Vite 启动当作 uni-app x 编译替代 |
| 5173 被占用 | 核对占用进程；复用正确服务或使用备用端口，不直接结束未知进程 |
| 页面与刚修改的源码不一致 | 确认是 dev 还是 preview；后者需要重新 build，测试地址也要匹配 |
| 测试等待禁用控件超时 | Playwright 默认拒绝点禁用元素；只有验证“不响应”时才使用强制点击，之后必须断言状态未变 |
| 新组件导致目录检查失败 | 核对 easycom 目录和 `check.mjs` 的明确列表；同步预期而不是移除检查 |
| 清空／密码图标消失 | 检查整个模块是否复制完整、SVG 路径及请求结果；核对浅深版本 |
| 输入出现两层或断裂焦点框 | 检查外框、uni-input 外壳、内部 input 是否同时绘制轮廓，以及上层容器是否裁切 |
| Sass 弃用／withKeys 类型提示 | 查看完整日志与退出码；当前版本曾构建通过，但升级后需要重新确认实际影响 |
| 独立审查服务限流 | 明确报告该环节未完成或改用当前环境允许的替代核对；不能冒充独立审查通过，也不要反复等待拖住已完成工作 |

## 验证后记录

在 [当前进度](progress.md) 写明日期、改动范围、实际执行命令、结果、未覆盖的平台和下一步。只把真实新增证据更新进 [兼容记录](compatibility.md)。视觉或交互修改查看当前产物，保留用户截图对应的复现状态。


## 表单基础回归与本机浏览器

`npm run test:unit` 同时执行颜色、同步校验、选择／文本长度、构建环境测试。`npm run test:forms` 验证新表单页面；需先构建 H5、启动 preview。若已有系统 Chrome，可设置 `MORI_BROWSER_EXECUTABLE` 为浏览器可执行文件完整路径；三个浏览器脚本均支持此参数。自定义端口继续使用 MORI_BASE_URL。

macOS 示例：

```sh
MORI_BASE_URL=http://127.0.0.1:5178 MORI_BROWSER_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:forms
```

新证据在 `.impeccable/review/forms-verification.json`、`forms-desktop-light.png`、`forms-mobile-dark.png` 和 `forms-mobile-dark-submit.png`。移动端采用顶部／提交区真实视口截图，避免当前系统 Chrome 全页截图的重复拼接。JSON 记录实际浏览器版本。

构建脚本自动创建并清理临时 HBuilderX 插件映射以使用项目 Sass；微信编译优先匹配 IDE 自带 Node，H5 继续使用调用脚本的 Node。旧编译器在 Node 24／26 下报 `cachedDataRejected` 时，先核实编译器和运行时配对，不能将其误报成组件源码错误。


## 反馈组件回归

`npm run test:feedback` 在现有预览服务检查 Toast 自动关闭／覆盖计时、弹层焦点／遮罩／滚动／嵌套／非模态、Dialog 等待与防重复、移动深色及真实过渡中间帧。支持相同 MORI_BASE_URL 和 MORI_BROWSER_EXECUTABLE 参数。输出 feedback-verification.json 与桌面／手机截图。

`npm run test:unit` 同时执行 overlay、feedback 和 feedback-component；最后一项使用已有 Vue 编译器和自定义 renderer 运行真实 Toast setup/watchers，覆盖受控 prop 与 ref 方法的组合，不代替浏览器／原生渲染。


## 40组件扩展检查

- npm run check：显式40组件清单、easycom文件、浏览器全局依赖边界以及独立用法文档存在性。
- npm run check:docs：40份文档、Vue/UTS代码块结构、与源码一致的props/events、本地链接。结构检查不代表所有示例已在原生上运行。
- npm run test:unit 新增日历/闰年/范围/时间、数值边界、上传路径与真实Vue状态测试。
- npm run test:catalog：基于已构建H5，测试基础展示、导航键盘/禁用、分页、气泡/操作面板/通知、搜索/数值、选择取消/提交、日历范围、日期时间、真实浏览器图片选择/删除、浅深色和360/390px宽度。Stepper 覆盖连续超限失焦、负数/小数中间态、Enter、逐字符输入与编辑后直接点加减；不插入延时规避宿主节流。Transition 检查真实中间帧、反向切换和减少动态效果。

非默认端口按前文设置MORI_BASE_URL。本轮预览用5174，避免干扰已有5173开发进程。Windows截图路径统一使用fileURLToPath；不要直接使用URL.pathname（会形成C:\C:\...）。

上传状态测试使用可控传输回调覆盖失败/进度/重试/删除中断/过期回调与卸载；浏览器用真实file chooser验证选图。业务服务、iOS权限和原生后台行为仍需 [平台清单](platform-adaptation.md) 的真实环境，不将测试替身报告为后端或iOS通过。

Search 同时覆盖连续填入两次文本后立即 Enter／点击搜索，必须提交完整最终文本；此前旧实现会受到宿主输入节流影响，这些断言不得替换为固定等待。


## 72 组件第二轮扩展检查

- npm run check / npm run check:docs：显式 72 项目录与独立指南；文档结构不等于跨端运行。
- npm run test:unit：新增 extended-catalog，实际 Vue setup 测试覆盖级联取消／确认、禁用祖先、树选择上限、连续数字按键、列表防重复和重试、刷新、手势方向，以及模拟时钟下的计时漂移／重启／卸载。
- npm run test:expanded：构建后的组件全览新增四分类，真实浏览器验证图片失败／恢复、轮播、弹窗、导航键盘、选择器、输入长度、加载失败／重试、刷新／滑动、索引跳转和计时。截图为 expanded-*.png，报告 expanded-verification.json。
- 同步执行 H5／微信构建；原组件的 npm test 与 test:catalog 检查分类入口整合没有破坏既有行为。

命令同样支持 MORI_BASE_URL 和 MORI_BROWSER_EXECUTABLE。临时资源 geometry.svg 为本地几何测试图，不作为用户业务图。

## 88 组件补强回归

`node tests/strengthened-components.mjs`（也在 test:unit 中）运行真实 Vue setup：异步表单过期结果、重置、异常清理，联动选择、级联失败与取消、树半选、双侧操作、不可变排序、输入去重、日期边界、虚拟窗口、裁剪几何与二维码解码。

先 `npm run site:build`、`npm run site:preview`，再运行 `npm run test:strengthened`；可用 MORI_SITE_URL 指向其他端口。浏览器检查真实 Canvas 笔迹／PNG、裁剪取样、显示二维码解码、千条列表跳转、表单／选择操作及本地视频帧播放，输出 strengthened-verification.json 与 strengthen-*.png。手势自动化是 Chromium 合成输入，不是真机证据。

`npm run test:site` 继续按 manifest 巡检全部 88 个指南和真实示例。`check:docs` 同时识别 LF / CRLF 的 Vue fenced 示例，避免 Windows 新文档漏检。jsqr 仅为开发测试解码依赖，未进入可复制组件运行时。


## iOS 上传适配回归

iOS 上传定向检查：`node tests/upload-ios.mjs` 运行 APP-IOS 的真实 UTS 适配器与原生桥接替身，覆盖路由、参数、路径、进度、失败、取消和迟到文件释放；`node tests/extension-components.mjs` 运行真实组件，覆盖旧上传回调与新重试隔离、拒绝／异常／禁用／删除／清空／卸载、外部移除、远端 URL 替换及自定义文件所有权。两项均在 `npm run test:unit` 中。这些测试不执行 Swift，不等于 iOS 编译／真机验证。

原生模块新增或修改后，执行 check／check:docs、单元测试与 H5／微信构建以排查其他分支回归；H5 实际选图可用 `npm run test:catalog`（MORI_BASE_URL 支持指向官网 `/demo/` 构建）。iOS 必须重新制作含插件的自定义基座或打包，并按 [适配编号](platform-adaptation.md) 验证本地／iCloud 照片、HEIC、权限、取消、真实上传和文件清理，接入步骤见 [模块说明](../uni_modules/mori-upload-ios/README.md)。

## 2026-11-02 审查修复回归

`node tests/platform-geometry.mjs` 使用仅提供异步查询的微信 UniElement 接口替身，覆盖尺寸失败、窗口变化竞态、取消监听、快速签名、坐标换算及清空／禁用／卸载取消待处理触点。接口替身不等于真机验收。`test:strengthened` 新增自动补全连续输入后立即选中、级联加载中点击当前路径；不能用等待输入稳定来规避竞态。

`node tests/preview-entry.mjs` 核对默认 IDE 页面不引用生成的预览入口，npm 入口显式启用 MORI_PREVIEW。干净检出验证需复制 Git 可见源码（不带被忽略的预览生成文件），直接调用 HBuilderX 编译器且不传 UNI_CUSTOM_CONTEXT；npm 构建继续验证包含 88 示例的分支。
