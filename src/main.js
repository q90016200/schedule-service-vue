import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import CronElementPlus from '@vue-js-cron/element-plus'
import '@vue-js-cron/element-plus/dist/element-plus.css'

// dark mode
import 'element-plus/theme-chalk/dark/css-vars.css'

createApp(App)
    .use(router)
    .use(CronElementPlus)
    .use(ElementPlus)
    .mount('#app')
