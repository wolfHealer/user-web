<template>
  <div class="p-4">
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" />

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 基本信息 -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-bold">{{ detail.name }}</h2>
        <div class="text-sm text-gray-500 mt-1">
          {{ detail.hospital }} · {{ detail.department }} · {{ detail.title }}
        </div>
        <div class="text-xs text-blue-500 mt-1">
          擅长：{{ detail.specialty }}
        </div>
      </div>

      <!-- 出诊信息 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.schedule">
        <h3 class="font-semibold mb-2">出诊时间</h3>
        <div class="text-sm text-gray-700">
          {{ detail.schedule }}
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.phone">
        <h3 class="font-semibold mb-2">联系方式</h3>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">
            {{ maskPhone(detail.phone) }}
          </span>
          <van-button size="small" plain @click="togglePhone">
            {{ showPhone ? '隐藏' : '查看' }}
          </van-button>
        </div>
      </div>

      <!-- 患者评价 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.reviews && detail.reviews.length > 0">
        <h3 class="font-semibold mb-2">患者评价 ({{ detail.reviewCount }})</h3>
        <div class="flex items-center gap-2 mb-3">
          <van-icon name="star" color="#ff976a" />
          <span class="text-lg font-bold">{{ detail.rating }}</span>
          <span class="text-sm text-gray-500">分</span>
        </div>
        <div class="space-y-2">
          <div v-for="review in detail.reviews" :key="review.id" class="border-t pt-2">
            <div class="text-sm text-gray-700">{{ review.content }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ review.date }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mt-4">
        <van-button type="primary" block @click="handleBooking">
          预约就诊
        </van-button>
        <van-button plain block @click="handleConsult">
          在线咨询
        </van-button>
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="医生信息不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface Review {
  id: number
  content: string
  date: string
  rating: number
}

interface DoctorDetail {
  id: number
  name: string
  hospital: string
  department: string
  title: string
  specialty: string
  schedule?: string
  phone?: string
  rating?: number
  reviewCount?: number
  reviews?: Review[]
  isNetworkMember?: boolean
}

// 响应式数据
const detail = ref<DoctorDetail | null>(null)
const loading = ref<boolean>(false)
const showPhone = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/medical/directory/doctor/${id}`)
    detail.value = res.data.data
  } catch (error) {
    console.error('加载医生详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!showPhone.value) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return phone
}

// 切换手机显示
const togglePhone = () => {
  showPhone.value = !showPhone.value
}

// 预约就诊
const handleBooking = () => {
  if (detail.value?.id) {
    router.push(`/resource/medical/booking/doctor/${detail.value.id}`)
  }
}

// 在线咨询
const handleConsult = () => {
  if (detail.value?.id) {
    router.push(`/resource/medical/consult/doctor/${detail.value.id}`)
  }
}

// 生命周期
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.rounded-xl {
  border-radius: 12px;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>