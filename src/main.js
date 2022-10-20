import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import cronLight from '@vue-js-cron/light'
import '@vue-js-cron/light/dist/light.css'

createApp(App)
    .use(router)
    .use(cronLight)
    .mount('#app')
