# 宣传官网与实时组件预览

官网使用开源 [VitePress](https://vitepress.dev/) 构建，首页保留 Mori 的灰蓝、系统字体与紧凑组件风格。文档的手机预览通过 iframe 运行真实 uni-app x H5 示例，核心组件仍是 `.uvue` / UTS。

## 本地运行

需要项目原有的 Node.js、HBuilderX 及 Vue3 编译器，先执行 `npm ci`。

```sh
npm run site:dev
```

脚本生成文档和预览入口、编译 H5，然后启动官网开发服务，默认地址 `http://localhost:5180`。文档站的 Markdown 与 Vue/CSS 支持热更新；修改核心 `.uvue` 或示例后，另一个终端执行 `npm run site:refresh`，再刷新预览。

```sh
npm run site:build
npm run site:preview
npm run test:site
```

`site:build` 输出 `dist/site`；`site:preview` 默认监听本机 5180。可用 `PORT` 指定端口，`HOST=0.0.0.0` 允许局域网设备访问静态预览。浏览器测试可用 `MORI_SITE_URL` 指向其他地址，用 `MORI_BROWSER_EXECUTABLE` 指定浏览器。官网 H5 产物单独位于 `unpackage/dist/site/h5`，普通工作台构建继续使用原目录。

## 源码与维护

| 位置 | 职责 |
|---|---|
| `site/home.md` | 官网首页入口 |
| `site/.vitepress/` | VitePress 配置、首页、主题与预览框 |
| `docs/` | 官网文档来源，88 份组件指南仍只维护一份 |
| `scripts/component-manifest.mjs` | 分类导航和预览目录的唯一组件清单 |
| `site/demos/` | 需要完整交互的专用 `.uvue` 示例 |
| `pages/preview/preview.uvue` | 手机预览壳、组件目录、主题与重置 |
| `scripts/site-prepare.mjs` | 生成文档镜像和组件示例，不手改生成目录 |
| `scripts/site.mjs` | 构建 H5、复制演示、启动或构建官网 |
| `scripts/verify-site.mjs` | 88 个示例挂载及官网交互、响应式验证 |

默认从逐组件指南的第一段 Vue/UTS 示例生成真实预览；`site/demos/<name>.uvue` 可以提供专用示例。生成的 `components/site-demo-*`、`components/site-preview-content`、`pages/preview/catalog.uts` 和 `site/.generated` 均被忽略，npm 构建时自动再生。pages.json 的 MORI_PREVIEW 条件仅由 scripts/uni.mjs 显式开启；HBuilderX 直接运行保留工作台页面，不注册依赖生成文件的官网预览页。媒体预览使用本地品牌图；Upload 只在本机选择、预览，不请求文档中的占位域名。

桌面文档使用左目录、中正文、右预览；窄屏在正文上方展开预览。工具栏提供主题、重载、二维码和新窗口入口。二维码编码当前组件的真实 URL：localhost 只能在当前电脑使用；手机需访问局域网 IP 或部署后的域名。它是 H5 二维码，不是微信小程序码。

## 部署

将 `dist/site` 整体部署在站点根路径，保留其中的 `/demo/`、`/assets/` 等目录。服务器需支持无扩展名文档地址到同名 `.html` 文件的映射，例如 `/components/button` 对应 `/components/button.html`。这是当前脚本支持的部署布局；子目录部署需同时调整官网链接与 H5 base。

无需在线 API、数据库或远程字体。站内搜索在本地索引上运行，二维码在浏览器内生成。可通过构建环境变量 `VITE_MORI_DEMO_URL` 指向已有 H5 示例站的根地址（保留结尾 `/`），默认同站点 `/demo/`。本次创建与本地验证不等于已对公网发布，域名和托管由后续部署任务确定。

官网依赖为 VitePress 1.6.4 与 qrcode 1.5.4。VitePress 默认的旧 Vite 链在安装审计中出现已知漏洞，因此通过 package.json overrides 固定 Vite 6.4.5；本机验证其构建、开发服务和静态产物。锁文件随项目保存，升级时重新检查兼容性与依赖审计。

## 参考来源

核查日期：2026-10-31。

- [Wot UI 官网](https://wot-ui.cn/) 的页面 generator 标记为 VitePress v2.0.0-alpha.17。
- [Wot UI 仓库 package.json](https://github.com/Moonofweisheng/wot-design-uni/blob/master/package.json) 声明了 VitePress 文档构建和 H5 示例复制流程；查阅时 master 使用 `^1.6.3`，与线上版本不同。
- [Wot UI VPIframe.vue](https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/.vitepress/theme/components/VPIframe.vue) 实现 iframe、独立打开、二维码入口及大小屏切换，引用 Element Plus 的图标和 Drawer。

Mori 采用这一通用架构，自行编写官网与模拟器样式，没有复制 Wot 的界面资产或加入其组件运行依赖。官网框架与组件库本体分别构建。
