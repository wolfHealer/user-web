<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <h1 class="text-2xl font-bold mb-6">登录</h1>

    <!-- 手机号输入 -->
    <van-field
      v-model="loginForm.phone"
      label="手机号"
      placeholder="请输入手机号"
      type="tel"
      class="w-full mb-4"
    />

    <!-- 密码输入 -->
    <van-field
      v-model="loginForm.password"
      label="密码"
      placeholder="请输入密码"
      :type="showPassword ? 'text' : 'password'"
      class="w-full mb-4"
    >
      <template #button>
        <van-icon
          :name="showPassword ? 'eye-o' : 'closed-eye'"
          @click="togglePasswordVisibility"
        />
      </template>
    </van-field>

    <!-- 忘记密码入口 -->
    <div class="text-right w-full mb-6">
      <span class="text-blue-500 text-sm cursor-pointer" @click="goToForgotPassword">
        忘记密码？
      </span>
    </div>

    <!-- 登录按钮 -->
    <van-button
      type="primary"
      block
      class="w-45"
      :loading="loading"
      @click="handleLogin"
    >
      登录
    </van-button>

    <!-- 注册入口 -->
    <div class="mt-6 text-sm">
      还没有账号？
      <span class="text-blue-500 cursor-pointer" @click="goToRegister">立即注册</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 登录表单数据
const loginForm = ref({
  phone: '',
  password: ''
})

// 显示/隐藏密码
const showPassword = ref(false)

// 加载状态
const loading = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 处理登录
const handleLogin = () => {
  if (!loginForm.value.phone || !loginForm.value.password) {
    showToast('请填写完整信息')
    return
  }
  loading.value = true
  // 模拟登录请求
  setTimeout(() => {
    loading.value = false
    showToast('登录成功')
    router.push('/home')
  }, 1000)
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
.w-full {
  width: 100%;
}
.w-45 {
  width: 80%;
}
</style>