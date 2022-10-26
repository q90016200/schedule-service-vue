import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import cronLight from '@vue-js-cron/light'
import '@vue-js-cron/light/dist/light.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import cronElementPlus from '@vue-js-cron/element-plus'
import '@vue-js-cron/element-plus/dist/element-plus.css'


createApp(App)
    .use(router)
    .use(cronLight)
    .use(ElementPlus)
    .use(cronElementPlus)
    .mount('#app')
