# README 收尾复核

记录日期：2026-10-30（Asia/Shanghai）。复核对象为 [README](../README.md) 与 `docs/assets/readme/`，基于 README 提交 `0d9ea1f`。

## 范围

本次保留既有灰蓝配色、系统字体、SVG 品牌封面和真实 H5 截图，核对展示、链接、示例、来源及交接状态。未修改组件源码，未重新执行组件构建、交互或动画回归，也不增加原生平台兼容性结论。

## 实际验证

| 检查 | 结果 |
|---|---|
| 本地 GFM 展示 | 1440、768、390、360px，各自浅色／深色，共 8 种组合；页面及展开图库无横向溢出，图片与主题资源选择正常 |
| 文档结构 | 37 处本地资源、文件链接及文档锚点核对通过；页内主题导航正常 |
| Vue 示例 | 3 个 SFC 示例结构与组件属性核对通过；未单独编译或上机运行 |
| GitHub 桌面 | 仓库页面 HTTP 200；2 个 picture、4 个响应式 source、3 个折叠区、主题锚点存在，图片无失效 |
| GitHub 手机 | 390px 浅深主题均选择手机封面；3 个折叠区可用 Enter 展开和关闭，展开时无页面溢出；等待页面滚动后主题导航可达 |
| 设计检测 | README 与四张 SVG 封面的一次检测返回空列表；此结果不替代视觉判断 |
| 截图来源 | 4 张分发 PNG 均含来源信息；原始截图 SHA-256 与 [来源记录](assets/readme/provenance.json) 全部相符 |
| Git 基线 | 复核开始时 fetch 后本地 HEAD 与 origin/master 均为 `0d9ea1fa4a175c7869d2bb56ac4ca8523b90e725`，工作区干净 |

本机原始证据位于 `.impeccable/review/readme/`：各宽度的 `*-full.png` / `*-top.png`、手机图库、GitHub 桌面与手机截图、`verification.json`、`github-verification.json` 和 `github-mobile-verification.json`。该目录被 Git 忽略，后续检查可能覆盖同名文件；本文件保留此次验证范围与结论。

## 独立复核

独立 finish reviewer 的完整复核结论为 **`ship`**，没有实质修复项。21 张本地与 GitHub 截图均有效；此结论只覆盖当前 README 及其文档资产。

| 复核项 | 结论 |
|---|---|
| persistence | PRODUCT、DESIGN、表面说明与来源／验证记录齐全 |
| fidelity | 字体、几何 SVG、背景、品牌构图和五项方向承诺匹配；手机封面简化与表格／代码滚动属于 GFM 阅读适配 |
| ceiling | 达到用户指定的 Read／GFM 展示标准 |
| material_fixes | 无 |
| keep | 保留灰蓝、系统字体、几何封面、真实 H5 截图、可复制接入示例和明确兼容边界 |

随后由独立 documenter 核对 README、四套 SVG 封面、来源记录、PRODUCT、表面说明、tokens.scss、theme.uts、DESIGN.md 与 `.impeccable/design.json`，结论为 **No changes**。既有颜色、字体、36px 尺寸和 160／180ms 稳定选择态仍与实现相符，设计系统无需改写。

完整 reviewer 与 documenter 返回保存在本机 `.impeccable/review/readme/finish-review.md` 和 `documenter.md`。本文件保留可随仓库分发的结论。

## 重新检查

本次渲染辅助工具在本机被忽略的 `.tools/readme-preview/`，不随克隆分发。需要重验 README 时，可在 GitHub 或支持 GFM、HTML picture 与 details 的预览工具中按上述四档宽度检查：

1. 浅深主题的封面和工作台预览选择正确，页面没有横向溢出。
2. 展开手机图库、环境说明和项目结构，检查图片、长代码块及键盘操作。
3. 依次操作顶部导航、组件 API 与文档地图链接，确认目标存在且能到达。
4. 对照源码核对 npm 命令、示例属性、主题接口和兼容性声明。
5. 图片变化时同步来源记录，重新检查实际渲染，再更新本记录与 [当前进度](progress.md)。

## 仍待完成

README 复核不覆盖微信运行、Android／iOS 原生编译与真机、Safari 或鸿蒙验收，也不替代用户对最新组件视觉的正式确认。项目尚未发布组件包或 Release，后续按 [兼容记录](compatibility.md) 与当前任务继续。
