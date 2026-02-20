<template>
  <div class="min-h-screen bg-blue-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-blue-600 shadow-sm p-4 w-full flex items-center text-white">
      <van-icon
        name="arrow-left"
        size="24"
        color="#FFFFFF"
        class="cursor-pointer mr-4"
        @click="goBack"
      />
      <h1 class="text-lg font-bold">个人中心</h1>
    </header>

    <!-- 内容区域 -->
    <main class="flex-1 overflow-y-auto p-6">
      <!-- 用户信息 -->
      <div class="bg-white rounded-lg shadow-blue-200 p-4 mb-6 border border-blue-200">
        <div class="flex items-center">
          <img
            :src="userInfo?.avatar || defaultAvatar"
            alt="头像"
            class="w-16 h-16 rounded-full mr-4 cursor-pointer"
            @click="uploadAvatar"
          />
          <div>
            <div class="font-semibold text-blue-700">{{ userInfo?.nickname || '用户名' }}</div>
            <div class="text-sm text-gray-500">手机号：{{ userInfo?.phone }}</div>
          </div>
        </div>
      </div>

      <!-- 功能列表 -->
      <div class="bg-white rounded-lg shadow-blue-200 p-4 mb-6 border border-blue-200">
        <div
          v-for="(item, index) in menuItems"
          :key="item.action"
          class="flex items-center justify-between py-3 border-b border-blue-100 last:border-0 cursor-pointer hover:bg-blue-100 transition-colors"
          @click="handleMenuClick(item.action)"
        >
          <span class="text-blue-700">{{ item.label }}</span>
          <van-icon name="arrow" color="#1E90FF" />
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <van-button type="primary" block class="bg-blue-600 hover:bg-blue-700" @click="logout">
        退出登录
      </van-button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 默认头像
const defaultAvatar = 'https://example.com/default-avatar.png'

// 从 Store 中获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 菜单项
const menuItems = [
  { label: '我的收藏', action: 'favorites' },
  { label: '我的发布', action: 'posts' },
  { label: '我的提问', action: 'questions' },
  { label: '个人信息', action: 'profile-edit' }
]

// 处理菜单点击
const handleMenuClick = (action: string) => {
  switch (action) {
    case 'favorites':
      router.push('/favorites')
      break
    case 'posts':
      router.push('/my-posts')
      break
    case 'questions':
      router.push('/my-questions')
      break
    case 'profile-edit':
      router.push('/profile/edit')
      break
  }
}

// 上传头像
const uploadAvatar = () => {
  showToast('头像上传功能待实现')
}

// 退出登录
const logout = () => {
  showDialog({
    title: '提示',
    message: '确定要退出登录吗？',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    userStore.clearUserInfo() // 清除用户信息
    router.push('/login')
  })
}

// 返回上一级页面
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.min-h-screen {
  background-color: #eff6ff; /* 浅天蓝色背景 */
}

.sticky.top-0 {
  background-color: #1E90FF; /* 深天蓝色顶部栏 */
  color: white;
}

.bg-white {
  background-color: #ffffff; /* 白色卡片背景 */
}

.shadow-blue-200 {
  box-shadow: 0 1px 3px rgba(30, 144, 255, 0.2); /* 天蓝色阴影 */
}

.border.border-blue-200 {
  border-color: #bfdbfe; /* 浅天蓝色边框 */
}

.hover\:bg-blue-100:hover {
  background-color: #dbeafe; /* 鼠标悬停时的浅天蓝色背景 */
}

.text-blue-700 {
  color: #1e3a8a; /* 深天蓝色文字 */
}

.rounded-lg {
  border-radius: 10px;
}

.cursor-pointer:hover {
  opacity: 0.9;
}
</style>