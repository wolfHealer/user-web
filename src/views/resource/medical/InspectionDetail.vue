<template>
  <div class="p-4">
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" />

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <h2 class="text-lg font-bold">{{ detail.name }}</h2>

      <div class="text-xs text-gray-500 mt-1">
        <span v-if="detail.category">分类：{{ detail.category }} · </span>
        <span v-if="detail.duration">检测周期：{{ detail.duration }}</span>
      </div>

      <!-- 价格信息 -->
      <div class="mt-3 text-sm text-red-500 font-medium" v-if="detail.price">
        ¥ {{ detail.price }}
      </div>

      <!-- 操作 -->
      <div class="flex gap-2 mt-3">
        <van-button 
          size="small" 
          type="primary" 
          @click="handleBooking"
        >
          预约检测
        </van-button>
        <van-button 
          size="small" 
          @click="handleConsult"
        >
          在线咨询
        </van-button>
      </div>

      <!-- 检测说明 -->
      <div class="mt-4 text-sm leading-relaxed">
        {{ detail.desc }}
      </div>

      <!-- 准备事项 -->
      <div class="mt-4 text-sm text-gray-700" v-if="detail.preparation">
        <h3 class="font-bold mb-2">检测前准备</h3>
        <p>{{ detail.preparation }}</p>
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="检查项目不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface InspectionDetail {
  id: number
  name: string
  desc: string
  category?: string
  price?: number
  duration?: string
  preparation?: string
  imageUrl?: string
  createdAt?: string
}

// 响应式数据
const detail = ref<InspectionDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/medical/inspections/${id}`)
    detail.value = res.data.data
  } catch (error) {
    console.error('加载检查项目详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 预约检测
const handleBooking = () => {
  if (detail.value?.id) {
    router.push(`/resource/medical/booking/${detail.value.id}`)
  }
}

// 在线咨询
const handleConsult = () => {
  if (detail.value?.id) {
    router.push(`/resource/medical/consult/${detail.value.id}`)
  }
}

// 生命周期
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
/* 可添加自定义样式 */
</style>