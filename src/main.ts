import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import {Icon} from 'vant'
import 'vant/lib/index.css'
import './style.css'
import './assets/tailwind.css'

const app = createApp(App)
app.use(Icon)
app.use(Vant)
app.use(router)
app.mount('#app')