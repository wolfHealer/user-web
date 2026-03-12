<!-- <template>
  <div class="min-h-screen bg-gray-50 p-4">
    <h1 class="text-xl font-bold mb-6">提问</h1>

    病种选择 
    <van-field
      v-model="selectedDisease"
      label="关联病种"
      placeholder="请选择病种"
      readonly
      @click="showDiseasePicker = true"
    />
    <van-popup v-model:show="showDiseasePicker" position="bottom">
      <van-picker
        :columns="diseases"
        @confirm="onDiseaseConfirm"
        @cancel="showDiseasePicker = false"
      />
    </van-popup>

    问题标题
    <van-field
      v-model="questionTitle"
      label="问题标题"
      placeholder="请输入问题标题"
      class="mt-4"
    />

    问题描述 
    <van-field
      v-model="questionContent"
      label="问题描述"
      type="textarea"
      placeholder="请详细描述您的问题..."
      rows="4"
      class="mt-4"
    />

     图片上传
    <div class="mt-4">
      <div class="text-sm mb-2">上传图片（如检查报告）</div>
      <van-uploader v-model="imageList" multiple />
    </div>

    提交按钮
    <van-button
      type="primary"
      block
      class="mt-6"
      :loading="loading"
      @click="submitQuestion"
    >
      提交问题
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 病种选项
const diseases = ref(['渐冻症', 'SMA', '法布里病', '戈谢病'])

// 表单数据
const selectedDisease = ref('')
const questionTitle = ref('')
const questionContent = ref('')
const imageList = ref([])

// 弹窗状态
const showDiseasePicker = ref(false)

// 加载状态
const loading = ref(false)

// 确认选择病种
const onDiseaseConfirm = ({ selectedValues }: any) => {
  selectedDisease.value = selectedValues[0]
  showDiseasePicker.value = false
}

// 提交问题
const submitQuestion = () => {
  if (!selectedDisease.value || !questionTitle.value || !questionContent.value) {
    showToast('请填写完整信息')
    return
  }
  loading.value = true
  // 模拟提交请求
  setTimeout(() => {
    loading.value = false
    showToast('问题已提交，等待专家回复')
    router.back()
  }, 1000)
}
</script>

<style scoped>
.text-sm {
  font-size: 16px;
}
</style> -->


<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <!-- 提示图标 -->
    <van-icon name="info-o" size="48" color="#1E90FF" class="mb-4" />

    <!-- 提示文字 -->
    <div class="text-center">
      <h1 class="text-xl font-bold text-gray-800 mb-2">功能正在开发中</h1>
      <p class="text-gray-600 mb-6">
        专家答疑模块暂未上线，敬请期待！您可以先浏览其他资源或关注我们的更新通知。
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-4">
      <van-button type="primary" @click="goToResources">查看资源中心</van-button>
      <van-button plain @click="goBack">返回上一页</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到资源中心
const goToResources = () => {
  router.push('/resource')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb; /* 浅灰色背景 */
}

.text-xl {
  font-size: 1.25rem;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-600 {
  color: #4b5563;
}
</style>