// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 默认重定向到首页
  { path: '/', redirect: '/home' },

  // 首页
  { path: '/home', component: () => import('../views/main/Home.vue') },
  { path: '/messages', component: () => import('../views/main/Messages.vue') },
  { path: '/reward', component: () => import('../views/reward/RewardPage.vue') },

  // 登录页
  { path: '/login', component: () => import('../views/user/Login.vue') },

  // 核心功能模块路由
  { path: '/knowledge', component: () => import('../views/knowledge/Knowledge.vue') }, // 知识库



  { path: '/community', component: () => import('../views/community/Community.vue') }, // 病友交流
{
  path: '/post/:id',
  name: 'PostDetail',
  component: () => import('../views/community/PostDetail.vue')
},

  { path: '/qa', component: () => import('../views/qa/QA.vue') }, // 专家答疑

  // 病种详情页（新增）
  { path: '/disease/:id', component: () => import('../views/knowledge/DiseaseDetail.vue') },
  {
    path: '/category/:id',
    component: () => import('../views/knowledge/CategoryDetail.vue'), // 病种分类详情页
  },

  { path: '/resources', component: () => import('../views/resource/Resources.vue') }, // 资源下载
  {
    path: '/resources/category/:id',
    component: () => import('../views/resource/CategoryDetail.vue'),
    props: true // 启用路由参数作为组件 props
  },// 资源分类详情页

  // 个人中心
  { path: '/profile', component: () => import('../views/user/Profile.vue') },

  // 404 页面（可选）
  { path: '/:catchAll(.*)', redirect: '/home' },

  // 用户相关页面
  { path: '/favorites', component: () => import('../views/user/Favorites.vue') },
  { path: '/my-posts', component: () => import('../views/user/MyPosts.vue') },
  { path: '/my-questions', component: () => import('../views/user/MyQuestions.vue') },
  { path: '/profile/edit', component: () => import('../views/user/ProfileEdit.vue') },


  //资源下载
    { path: '/resource/medical', component: () => import('../views/resource/medical/MedicalResource.vue') },
    { path: '/resource/medical/guides/:id', component: () => import('../views/resource/medical/GuideDetail.vue') },
    { path: '/resource/medical/inspection/:id',component: () => import('@/views/resource/medical/InspectionDetail.vue')},
    { path: '/resource/medical/directory',component: () => import('@/views/resource/medical/DoctorDirectory.vue')},
    { path: '/resource/medical/directory/doctor/:id', component: () => import('@/views/resource/medical/DoctorDetail.vue')},
    { path: '/resource/medical/directory/hospital/:id', component: () => import('@/views/resource/medical/HospitalDetail.vue')},
    
    { path: '/resource/charity', component: () => import('../views/resource/charity/CharityResource.vue') },


    { path: '/resource/drug', component: () => import('../views/resource/drug/DrugResource.vue') },
    { path: '/resource/drug/detail/:id',component: () => import('../views/resource/drug/DrugDetail.vue')},//药品详情页
    { path: '/resource/drug/donation/apply',  component: () => import('../views/resource/drug/DonationApply.vue')},

    
    { path: '/resource/rehab', component: () => import('../views/resource/rehab/RehabResource.vue') },
    { path: '/resource/drug/channel/detail/:id', component: () => import('../views/resource/drug/ChannelDetail.vue')}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router