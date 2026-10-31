# 平台适配跟踪

更新：2026-10-31（Asia/Shanghai）。本清单记录需要单独适配或设备验证的差异；“已留入口”不等于该平台已验证。每个编号可用于提交说明、代码注释和问题追踪。

## iOS 上传

入口：[平台选择与请求](../uni_modules/mori-ui/platform/upload.uts)、[状态与类型](../uni_modules/mori-ui/upload.uts)、[上传组件](../uni_modules/mori-ui/components/mori-upload/mori-upload.uvue)、[完整用法](components/upload.md)。默认仅图片；系统能力委托 uni.chooseImage / uni.uploadFile，不引入未经验证的原生插件。

| 编号 | 场景与现有处理 | 状态 | 下一步与验收标准 |
|---|---|---|---|
| MORI-UP-IOS-01 | 相册完整／有限权限、拒绝／撤销权限、拍照；错误通过 error，用户取消通过 cancel；不自动索取或重置系统权限 | 已隔离调用入口，未真机验证 | 在项目配置真实 NSPhotoLibraryUsageDescription、NSCameraUsageDescription 等所需用途文案，核对当前 DCloud 文档；测试首次授权、有限照片、更改权限、拒绝后再次选择。取消不报上传错误，拒绝可解释并由业务提供系统设置入口 |
| MORI-UP-IOS-02 | file://、沙盒临时路径、中文／空格／百分号文件名；保留 API 返回路径原样 | 路径不改写已有逻辑测试；原生路径尚未验收 | iOS 相册/iCloud 原图选择后直接上传；确认路径可读、临时文件有效期和切后台后重试。需要跨会话保存时由原生适配复制至应用持久目录，不能把临时 URL 当远端地址 |
| MORI-UP-IOS-03 | HEIC/HEIF、超大原图、旋转方向和服务端解码差异；不静默改后缀或伪造 JPEG | 已提供 chooseFiles / beforeRead 接入点；未提供转码实现 | 真实 HEIC/照片编辑/竖拍测试；确认服务端支持格式。若需转换，在独立原生适配中转换并返回真实路径、MIME 和大小；核对 EXIF 方向及内存占用。不要仅改扩展名 |
| MORI-UP-IOS-04 | 前台上传进度、失败重试；删除/clear/卸载 abort，过期回调忽略 | 已实现统一任务生命周期；原生中断未验收 | 测试弱网、断网、切后台、锁屏、杀进程；本版没有后台上传会话或断点续传，需要此能力时引入原生后台任务并单独设计恢复协议 |
| MORI-UP-IOS-05 | Files / iCloud Drive 文档、安全作用域资源访问，与照片选择不同 | 未实现默认文档选择；chooseFiles 可替换选择器 | 如业务需要 PDF/文档，新增 iOS 文档选择原生适配，正确管理 security-scoped URL，复制到可读临时目录；确认关闭选择器和卸载后的访问释放。当前默认预览仅图片，自定义文件应 previewImage=false 并接管 preview |
| MORI-UP-IOS-06 | HTTPS、证书、重定向、ATS、鉴权与 multipart 字段 | 已提供 header/formData/name/timeout；需业务服务端 | 使用真实测试服务验证 2xx/4xx/5xx/超时/Token 失效与证书错误。resolveUrl 验证业务成功，失败保持 error 并可重试；不要为了测试全局关闭 ATS |

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

参考入口：[uni.chooseImage](https://doc.dcloud.net.cn/uni-app-x/api/choose-image.html)、[uni.uploadFile](https://doc.dcloud.net.cn/uni-app-x/api/upload-file.html)、[Apple Photos](https://developer.apple.com/documentation/photokit)、[Apple 文件访问](https://developer.apple.com/documentation/uikit/view_controllers/providing_access_to_directories)。平台 API 仍需按项目实际编译器版本核对。


## 72 组件新增适配编号

以下均未做真机验收。H5 与微信编译记录见 compatibility.md，不替代这里的设备检查。

| 编号 | 入口与当前实现 | 缺项与验收步骤 |
|---|---|---|
| MEDIA-01 | Image／Avatar：宿主 image、src 重置、失败占位 | iOS HEIC／SVG、远程证书、断网后重试；验证加载事件与替代名称 |
| MEDIA-02 | Swiper：宿主 swiper，受控索引，默认不自动播放 | iOS／Android／微信快速滑动、循环边界、数据收缩、前后台恢复 |
| MEDIA-03 | ImagePreview／Image：弹窗翻页，可选 uni.previewImage | 宿主缩放、返回、保存权限、长图与横屏；没有自绘缩放 |
| LIST-01 | List：独立 scroll-view，底部事件与同步请求锁 | 真机 lower-threshold、短内容、失败重试、卸载后业务取消请求 |
| REFRESH-01 | PullRefresh：宿主 refresher＋显式按钮 | 原生／微信下拉、嵌套滚动、刷新中再次触摸；业务成功失败均需关闭刷新态 |
| TIMER-01 | CountDown／CountTo：时间差驱动与取消任务 | App 切后台／锁屏后恢复的显示；没有后台保活或系统通知 |
| GESTURE-01 | SwipeCell：方向区分、touchcancel、显式展开按钮 | 真机纵向滚动不误展开，横向展开连续往返，VoiceOver／TalkBack 按钮操作 |
| STICKY-01 | Sticky：WEB／MP CSS；APP 用 fixed＋height 受控模式 | App 页面滚动接入、状态栏偏移、真实占位；APP 默认不自动吸顶 |
| SAFE-01 | SafeArea：WEB／MP env，APP safeAreaInsets，size 覆盖 | 刘海、底部手势、横屏与键盘；窗口变化由业务刷新 size，不重复 padding |
| SCROLL-02 | BackTop：父级 scrollTop、可选 pageScrollTo | page 与 scroll-view 不同目标；scroll-view 用 autoScroll=false 接管 click |
| INDEX-01 | IndexBar：独立 scroll-view 与 scroll-into-view | 微信／App 重复定位、更新 sections；不提供滚动自动高亮或索引拖动 |

每项都需记录设备、OS、编译器、复现步骤与实际结果后再变更状态。iOS 上传原有 MORI-UP-IOS-01 至 06 不被本轮替代，仍须单独跟进。
