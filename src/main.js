import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from '@/utils/zh-cn.js'

const app = createApp(App)
app.use(ElementPlus, { locale })
app.mount('#app')

export default app
