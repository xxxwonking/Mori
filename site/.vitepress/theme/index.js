import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import MoriHome from './MoriHome.vue';
import './style.css';

export default { extends: DefaultTheme, Layout, enhanceApp({ app }) { app.component('MoriHome', MoriHome); } };
