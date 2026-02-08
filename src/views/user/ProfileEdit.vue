<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-2xl font-bold mb-6">个人信息</h1>

    <!-- 头像上传 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center">
        <img
          :src="userInfo.avatar || defaultAvatar"
          alt="头像"
          class="w-16 h-16 rounded-full mr-4 cursor-pointer"
          @click="uploadAvatar"
        />
        <span class="text-blue-500 cursor-pointer" @click="uploadAvatar">点击更换头像</span>
      </div>
    </div>

    <!-- 昵称修改 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <van-field
        v-model="userInfo.nickname"
        label="昵称"
        placeholder="请输入昵称"
      />
    </div>

    <!-- 保存按钮 -->
    <van-button
      type="primary"
      block
      :loading="saving"
      @click="saveProfile"
    >
      保存
    </van-button>

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
import { showToast } from 'vant'

const router = useRouter()

// 默认头像
const defaultAvatar = 'https://example.com/default-avatar.png'

// 用户信息
const userInfo = ref({
  nickname: '用户名',
  avatar: ''
})

// 头像上传弹窗状态
const showAvatarPopup = ref(false)
const avatarFileList = ref([])

// 保存状态
const saving = ref(false)

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

// 保存个人信息
const saveProfile = () => {
  saving.value = true
  // 模拟保存请求
  setTimeout(() => {
    saving.value = false
    showToast('保存成功')
    router.back()
  }, 1000)
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