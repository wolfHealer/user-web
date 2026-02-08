// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 默认重定向到首页
  { path: '/', redirect: '/home' },

  // 首页
  { path: '/home', component: () => import('../views/main/Home.vue') },
  { path: '/messages', component: () => import('../views/main/Messages.vue') },

  // 登录页
  { path: '/login', component: () => import('../views/user/Login.vue') },

  // 核心功能模块路由
  { path: '/knowledge', component: () => import('../views/knowledge/Knowledge.vue') }, // 知识库
  { path: '/community', component: () => import('../views/community/Community.vue') }, // 病友交流
  { path: '/qa', component: () => import('../views/qa/QA.vue') }, // 专家答疑
  { path: '/resources', component: () => import('../views/resource/Resources.vue') }, // 资源下载

  // 病种详情页（新增）
  { path: '/disease/:id', component: () => import('../views/knowledge/DiseaseDetail.vue') },

  // 新增：资源分类详情页
  {
    path: '/resources/category/:id',
    component: () => import('../views/resource/CategoryDetail.vue'),
    props: true // 启用路由参数作为组件 props
  },

  // 个人中心
  { path: '/profile', component: () => import('../views/user/Profile.vue') },

  // 404 页面（可选）
  { path: '/:catchAll(.*)', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router