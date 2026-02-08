<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-2xl font-bold mb-6">个人中心</h1>

    <!-- 用户信息 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center">
        <img
          :src="userInfo.avatar || defaultAvatar"
          alt="头像"
          class="w-16 h-16 rounded-full mr-4 cursor-pointer"
          @click="uploadAvatar"
        />
        <div>
          <div class="font-semibold">{{ userInfo.nickname || '用户名' }}</div>
          <div class="text-sm text-gray-500">手机号：{{ userInfo.phone }}</div>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer"
        @click="handleMenuClick(item.action)"
      >
        <span>{{ item.label }}</span>
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <van-button type="danger" block @click="logout">退出登录</van-button>

    <!-- 头像上传弹窗 -->
    <van-popup v-model:show="showAvatarPopup" position="bottom">
      <div class="p-4">
        <van-uploader
          v-model="avatarFileList"
          :max-count="1"
          :after-read="handleAvatarUpload"
        />
        <van-button
          type="primary"
          block
          class="mt-4"
          @click="confirmAvatarUpload"
        >
          确认上传
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

const router = useRouter()

// 默认头像
const defaultAvatar = 'https://example.com/default-avatar.png'

// 用户信息
const userInfo = ref({
  nickname: '用户名',
  phone: '138****8888',
  avatar: ''
})

// 菜单项
const menuItems = ref([
  { label: '我的收藏', action: 'favorites' },
  { label: '我的发布', action: 'posts' },
  { label: '我的提问', action: 'questions' },
  { label: '个人信息', action: 'profile-edit' }
])

// 头像上传弹窗状态
const showAvatarPopup = ref(false)
const avatarFileList = ref([])

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
  showAvatarPopup.value = true
}

// 处理头像上传
const handleAvatarUpload = (file: any) => {
  // 压缩图片并上传
  console.log('上传头像:', file)
}

// 确认上传头像
const confirmAvatarUpload = () => {
  showToast('头像上传成功')
  showAvatarPopup.value = false
}

// 退出登录
const logout = () => {
  showDialog({
    title: '提示',
    message: '确定要退出登录吗？',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.cursor-pointer {
  cursor: pointer;
}
</style>