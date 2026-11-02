import { defineConfig } from 'vitepress';
import { componentManifest } from '../../scripts/component-manifest.mjs';

const groups = ['基础', '录入', '反馈', '导航', '展示', ...new Set(componentManifest.map(c => c.group).filter(g => !['基础', '录入', '反馈', '导航', '展示'].includes(g)))];
const english = name => name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');

export default defineConfig({
  title: 'Mori UI',
  description: '面向 uni-app x 的紧凑移动组件库',
  lang: 'zh-CN',
  srcDir: '.generated',
  outDir: '../dist/site',
  cleanUrls: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  markdown: { languages: ['vue', 'typescript', 'javascript', 'json', 'powershell', 'bash', 'scss'] },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'mori UI',
    nav: [
      { text: '指南', link: '/user-guide', activeMatch: '/user-guide' },
      { text: '组件', link: '/components/button', activeMatch: '/components/' },
      { text: '兼容性', link: '/compatibility' },
      { text: '0.1.0', items: [{ text: '当前为源码预览版', link: '/component-coverage' }] }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/xxxwonking/Mori' }],
    sidebar: [
      { text: '开始使用', items: [
        { text: '介绍与接入', link: '/user-guide' },
        { text: 'iOS 上传插件', link: '/ios-upload' },
        { text: '组件总览', link: '/component-guides' },
        { text: '平台兼容性', link: '/compatibility' },
        { text: '能力与边界', link: '/component-coverage' }
      ] },
      ...groups.map(group => ({ text: group, collapsed: false, items: componentManifest.filter(c => c.group === group).map(c => ({ text: `${english(c.name)} ${c.title}`, link: `/components/${c.name}` })) }))
    ],
    search: { provider: 'local', options: { locales: { root: { translations: { button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' }, modal: { noResultsText: '没有找到相关内容', resetButtonTitle: '清空', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } } } } } } },
    outline: { label: '本页内容', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    editLink: { pattern: 'https://github.com/xxxwonking/Mori/edit/master/docs/:path', text: '在 GitHub 上编辑此页' },
    returnToTopLabel: '回到顶部', sidebarMenuLabel: '组件目录', darkModeSwitchLabel: '外观',
    footer: { message: '为每一个移动项目，打磨好用的基础。', copyright: 'Mori UI · 基于 VitePress 构建' }
  }
});
