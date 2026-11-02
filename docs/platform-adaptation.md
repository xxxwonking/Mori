# 平台适配跟踪

更新：2026-11-02（Asia/Shanghai）。本清单记录需要单独适配或设备验证的差异；“已实现”不等于该平台已验证。每个编号可用于提交说明、代码注释和问题追踪。

## iOS 上传

入口：[平台选择与请求](../uni_modules/mori-ui/platform/upload.uts)、[iOS 桥接](../uni_modules/mori-ui/platform/upload-ios.uts)、[原生模块与接入](../uni_modules/mori-upload-ios/README.md)、[上传组件](../uni_modules/mori-ui/components/mori-upload/mori-upload.uvue)、[完整用法](components/upload.md)。APP-IOS 默认使用独立 Swift 模块完成 PHPicker 选图、临时文件复制和 URLSession 上传，其他平台沿用 uni.chooseImage／uni.uploadFile；预览仍用 uni.previewImage。原生实现未完成 iOS 编译或设备验收。

| 编号 | 场景与现有处理 | 状态 | 下一步与验收标准 |
|---|---|---|---|
| MORI-UP-IOS-01 | PHPicker 选择用户指定照片，不请求整个照片库授权；拍照用 UIImagePickerController 并请求相机权限；用户取消发 cancel | 原生实现及桥接替身测试；未编译／真机验证 | 检查合并后的 NSCameraUsageDescription，制作自定义基座；测试首次相册选择、有限照片设置、拍照授权／拒绝／撤销、来源面板与取消。业务另有直接读写照片库行为时独立配置权限 |
| MORI-UP-IOS-02 | 在 loadFileRepresentation 回调结束前复制所选资源，等待 iCloud；绝对路径保留中文／空格／百分号，file:// 由原生 URL 解析；只清理模块自有文件 | 路由与文件生命周期替身测试通过；Swift 文件读取未验收 | 真机本地／仅云端照片、取消下载、磁盘不足与批量读取失败；确认副本可读、失败／取消／卸载后清理。跨会话保存由业务另存，不持久使用临时 URL |
| MORI-UP-IOS-03 | 相册保留提供者格式；拍照真实编码 JPEG 0.9；chooseFiles／beforeRead 可拒绝或接入业务转换 | 未实现 HEIC 转码；原生编码未验收 | 真实 HEIC／编辑照片／竖拍／超大图检查格式、方向、尺寸与内存，确认后端支持；不以更改后缀代替转换 |
| MORI-UP-IOS-04 | URLSession 前台 multipart；删除／clear／卸载取消，按请求实例忽略旧回调；临时副本在远端 URL 替换后释放 | 组件重试竞态已复现并修复，桥接与组件测试通过；原生取消未验收 | 测试弱网、断网、重试、切后台、锁屏、杀进程；没有后台上传会话或断点续传。afterRead 外部上传须保持组件有效或先另存文件 |
| MORI-UP-IOS-05 | Files / iCloud Drive 文档、安全作用域资源访问，与照片选择不同 | 未实现默认文档选择；chooseFiles 可替换选择器 | 如业务需要 PDF/文档，新增 iOS 文档选择原生适配，正确管理 security-scoped URL，复制到可读临时目录；确认关闭选择器和卸载后的访问释放。当前默认预览仅图片，自定义文件应 previewImage=false 并接管 preview |
| MORI-UP-IOS-06 | URLSession 编码 multipart，支持 header/formData/name/timeout；响应限 2 MiB UTF-8 文本 | 参数与错误转发测试通过；需原生和业务服务端 | 使用真实服务验证字段／MIME／字节、2xx/4xx/5xx/超时/Token 失效、证书、重定向、超大响应。resolveUrl 验证业务成功，失败可重试；不全局关闭 ATS |

本机为 Windows，没有 iOS Xcode/模拟器/签名与设备；以上条目均不能标为“iOS 通过”。需要记录设备型号、iOS 版本、HBuilderX/uni-app x 版本、授权状态、输入文件信息、服务端日志、预期与实际结果。

## 其他差异

| 编号 | 范围 | 当前处理 | 待跟进 |
|---|---|---|---|
| MORI-OVERLAY-01 | Popup / Picker / DatetimePicker / ActionSheet | 复用弹层栈；H5 键盘与滚动锁；要求页面根级挂载 | 微信与原生安全区、键盘遮挡、滚动穿透；H5/原生真正读屏隔离（inert / 下层弹窗隐藏） |
| MORI-POPOVER-01 | 气泡菜单固定定位 | selectorQuery 测量，边缘限制和上下翻转；H5 滚动/resize 关闭 | 小程序作用域选择器与原生定位；非 H5 页面滚动/旋转由业务关闭；transform 祖先下不支持跨端 portal |
| MORI-NAV-01 | 固定导航、安全区 | WEB / MP 的 env 安全区；默认导航处于正常流 | 原生状态栏/底部手势区需运行验收与页面 padding；组件不自动占位，不自动跳转 |
| MORI-INPUT-01 | Input/Textarea/Stepper/Search/Slider | 复用 uni 输入/slider；Stepper 以 blur/confirm 最终文本归一化并重建结束编辑的输入，消除 H5 100ms 节流与缓存失配；platform/stepper.uts 设置 inputmode，platform/slider.uts 同步实际 range 的语义 | H5 快速失焦、确认、按钮衔接已回归；负数使用文本键盘以保留负号。iOS 小字号输入缩放、数字键盘、光标、输入法及键盘遮挡；Slider 原生手势与无障碍仍需设备 |
| MORI-MOTION-01 | Loading/Skeleton/Transition/选择态 | H5 prefers-reduced-motion；过渡计时取消 | 原生系统减少动态效果 API 与低端设备帧率；不能用 CSS 构建通过代替实际动效 |
| MORI-ASSET-01 | Icon/Upload/Text | 独立 SVG 随库分发、原图路径保留 | Android/iOS SVG、图片格式、长文本截断与系统字体放大；HarmonyOS 逐组件验收 |
| MORI-UP-WEB-01 | H5 图片上传 | 原生浏览器文件选择、uni.uploadFile 传输 | 跨域服务需 CORS；选择图片不代表后端接收。Safari/移动 Safari 需真实浏览器验证 |
| MORI-UP-MP-01 | 微信图片上传 | 编译可用，沿用 uni 媒体与网络 API | AppID、相册/相机权限、request/uploadFile 合法域名、真机临时路径与上传；无本轮微信运行证据 |

## 留痕格式

新增适配请在 platform 对应入口注释编号，并在本表更新：状态、修改提交、设备/工具链、复现步骤、预期/实际、证据路径、还剩什么。原始截图和日志放被忽略的 `.impeccable/review/`，关键结论必须保存在本文件与 compatibility.md，不能只保留在本地截图里。

参考入口：[uni.chooseImage](https://doc.dcloud.net.cn/uni-app-x/api/choose-image.html)、[uni.uploadFile](https://doc.dcloud.net.cn/uni-app-x/api/upload-file.html)、[UTS 原生混编](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin-hybrid.html)、[iOS 配置](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-for-ios.html)、[Apple PHPicker](https://developer.apple.com/documentation/photosui/phpickerviewcontroller)、[文件表示读取](https://developer.apple.com/documentation/foundation/nsitemprovider/loadfilerepresentation(fortypeidentifier:completionhandler:))。平台 API 仍需按项目实际编译器版本核对。


## 72 组件新增适配编号

以下均未做真机验收。H5 与微信编译记录见 compatibility.md，不替代这里的设备检查。

| 编号 | 入口与当前实现 | 缺项与验收步骤 |
|---|---|---|
| MEDIA-01 | Image／Avatar：宿主 image、src 重置、失败占位 | iOS HEIC／SVG、远程证书、断网后重试；验证加载事件与替代名称 |
| MEDIA-02 | Swiper：宿主 swiper，受控索引，默认不自动播放 | iOS／Android／微信快速滑动、循环边界、数据收缩、前后台恢复 |
| MEDIA-03 | ImagePreview／Image：弹窗翻页，可选 uni.previewImage | 新增有界自绘缩放／平移；仍需宿主预览、返回、保存权限、长图与横屏验收 |
| LIST-01 | List：独立 scroll-view，底部事件与同步请求锁 | 真机 lower-threshold、短内容、失败重试、卸载后业务取消请求 |
| REFRESH-01 | PullRefresh：宿主 refresher＋显式按钮 | 原生／微信下拉、嵌套滚动、刷新中再次触摸；业务成功失败均需关闭刷新态 |
| TIMER-01 | CountDown／CountTo：时间差驱动与取消任务 | App 切后台／锁屏后恢复的显示；没有后台保活或系统通知 |
| GESTURE-01 | SwipeCell：方向区分、touchcancel、显式展开按钮 | 真机纵向滚动不误展开，横向展开连续往返，VoiceOver／TalkBack 按钮操作 |
| STICKY-01 | Sticky：WEB／MP CSS；APP 用 fixed＋height 受控模式 | App 页面滚动接入、状态栏偏移、真实占位；APP 默认不自动吸顶 |
| SAFE-01 | SafeArea：WEB／MP env，APP safeAreaInsets，size 覆盖 | 刘海、底部手势、横屏与键盘；窗口变化由业务刷新 size，不重复 padding |
| SCROLL-02 | BackTop：父级 scrollTop、可选 pageScrollTo | page 与 scroll-view 不同目标；scroll-view 用 autoScroll=false 接管 click |
| INDEX-01 | IndexBar：独立 scroll-view 与 scroll-into-view | 微信／App 重复定位、更新 sections；不提供滚动自动高亮或索引拖动 |

每项都需记录设备、OS、编译器、复现步骤与实际结果后再变更状态。iOS 上传原有 MORI-UP-IOS-01 至 06 不被本轮替代，仍须单独跟进。

## 88 组件补强适配编号

| 编号 | 实现与本地验证入口 | 仍需设备验收 |
|---|---|---|
| CANVAS-01 | Signature：uni.createCanvasContextAsync / 2D / PNG；H5 指针在 platform/canvas.uts；非 WEB 每笔异步测量、按序处理触点 | 微信与 App 画布初始化、手写坐标、导出、横竖屏、内存；键盘替代由业务提供 |
| CANVAS-02 | ImageCropper：源图区域采样，输出 PNG，加载代数避免过期覆盖 | 相册路径、HEIC／方向信息、远程证书、CORS、微信画布导出；非 WEB 容器使用异步尺寸查询并响应窗口变化，仍需核对设备旋转 |
| QR-01 | Nayuki MIT 便携 QR 编码，SVG 图像，jsQR 解码验证 | iOS／Android／微信对 data URI SVG 的实际显示；目标尺寸与真实相机扫码 |
| VIDEO-01 | uni video、显式播放、错误与重试；本地 VP8 演示 | 生产 MP4/H.264 等媒体格式、原生全屏、网络失败、退出和后台暂停 |
| VIRTUAL-01 | 定高窗口和上下占位；scrollToIndex 与数据缩短 | 原生大数据滚动、scroll-top 相同值重复定位、插槽固定高度、辅助技术 |
| GESTURE-02 | Draggable / FloatingPanel / ImagePreview：触摸手势与按钮／方向键替代 | 多指中断、页面嵌套滚动、系统返回、读屏和真实设备手感 |
| FORM-ASYNC-01 | 模型快照、嵌套路径、请求代数、异步错误、重置 | 微信／原生 Promise 与 JSON 类型编译／运行、真实后端取消和超时 |

uni Canvas API 类型来源为当前 @dcloudio/uni-app-x 安装包；官方说明见 [createCanvasContextAsync](https://doc.dcloud.net.cn/uni-app-x/api/createCanvasContextAsync.html)。本轮不以 H5 / 微信编译成功替代任何设备条目。
