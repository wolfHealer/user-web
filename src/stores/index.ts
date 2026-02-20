// src/stores/index.ts
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()
pinia.use(persist) // 启用持久化插件

export default pinia

// 模块化导出 Store
export * from './modules/user'