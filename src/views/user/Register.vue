<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <h1 class="text-2xl font-bold mb-6">注册</h1>

    <!-- 手机号输入 -->
    <van-field
      v-model="registerForm.phone"
      label="手机号"
      placeholder="请输入手机号"
      type="tel"
      class="w-full mb-4"
    />

    <!-- 验证码输入 -->
    <van-field
      v-model="registerForm.code"
      center
      clearable
      label="短信验证码"
      placeholder="请输入验证码"
      class="w-full mb-4"
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          :disabled="codeTimer > 0"
          @click="sendCode"
        >
          {{ codeTimer > 0 ? `${codeTimer}s后重发` : '发送验证码' }}
        </van-button>
      </template>
    </van-field>

    <!-- 密码输入 -->
    <van-field
      v-model="registerForm.password"
      label="密码"
      placeholder="请输入密码（6-12位）"
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

    <!-- 隐私提示 -->
    <div class="text-xs text-gray-500 mb-6">
      仅用于登录验证，不泄露个人信息
    </div>

    <!-- 注册按钮 -->
    <van-button
      type="primary"
      block
      class="w-45"
      :loading="loading"
      @click="handleRegister"
    >
      注册
    </van-button>

    <!-- 登录入口 -->
    <div class="mt-6 text-sm">
      已有账号？
      <span class="text-blue-500 cursor-pointer" @click="goToLogin">立即登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 注册表单数据
const registerForm = ref({
  phone: '',
  code: '',
  password: ''
})

// 显示/隐藏密码
const showPassword = ref(false)

// 验证码倒计时
const codeTimer = ref(0)

// 加载状态
const loading = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 发送验证码
const sendCode = () => {
  if (!registerForm.value.phone) {
    showToast('请输入手机号')
    return
  }
  showToast('验证码已发送')
  codeTimer.value = 60
  const timer = setInterval(() => {
    codeTimer.value--
    if (codeTimer.value <= 0) clearInterval(timer)
  }, 1000)
}

// 处理注册
const handleRegister = () => {
  if (
    !registerForm.value.phone ||
    !registerForm.value.code ||
    !registerForm.value.password
  ) {
    showToast('请填写完整信息')
    return
  }
  if (registerForm.value.password.length < 6 || registerForm.value.password.length > 12) {
    showToast('密码长度需为6-12位')
    return
  }
  loading.value = true
  // 模拟注册请求
  setTimeout(() => {
    loading.value = false
    showToast('注册成功')
    router.push('/home')
  }, 1000)
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
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