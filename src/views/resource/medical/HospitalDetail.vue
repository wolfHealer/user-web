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
          {{ detail.level }}
          <van-tag type="success" size="mini" v-if="detail.isNetworkMember" class="ml-2">
            协作网成员
          </van-tag>
        </div>
        <div class="text-xs text-blue-500 mt-1">
          诊疗范围：{{ detail.specialty }}
        </div>
      </div>

      <!-- 地址信息 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.address">
        <h3 class="font-semibold mb-2">医院地址</h3>
        <div class="text-sm text-gray-700">
          {{ detail.address }}
        </div>
        <van-button size="small" plain class="mt-2" @click="openMap">
          <van-icon name="location-o" /> 导航
        </van-button>
      </div>

      <!-- 咨询电话 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.phone">
        <h3 class="font-semibold mb-2">咨询电话</h3>
        <a :href="`tel:${detail.phone}`" class="text-sm text-blue-500">
          {{ detail.phone }}
        </a>
      </div>

      <!-- 患者评价 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mt-3" v-if="detail.reviews && detail.reviews.length > 0">
        <h3 class="font-semibold mb-2">患者评价 ({{ detail.reviewCount }})</h3>
        <div class="flex items-center gap-2 mb-3">
          <van-icon name="star" color="#ff976a" />
          <span class="text-lg font-bold">{{ detail.rating }}</span>
          <span class="text-sm text-gray-500">分</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mt-4">
        <van-button type="primary" block @click="handleBooking">
          预约挂号
        </van-button>
        <van-button plain block @click="handleNavigate">
          导航到医院
        </van-button>
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="医院信息不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface HospitalDetail {
  id: number
  name: string
  level: string
  specialty: string
  address?: string
  phone?: string
  rating?: number
  reviewCount?: number
  reviews?: any[]
  isNetworkMember?: boolean
}

// 响应式数据
const detail = ref<HospitalDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/medical/directory/hospital/${id}`)
    detail.value = res.data.data
  } catch (error) {
    console.error('加载医院详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 打开地图导航
const openMap = () => {
  if (detail.value?.address) {
    window.open(`https://uri.amap.com/search?keyword=${encodeURIComponent(detail.value.address)}`, '_blank')
  }
}

// 预约挂号
const handleBooking = () => {
  if (detail.value?.id) {
    router.push(`/resource/medical/booking/hospital/${detail.value.id}`)
  }
}

// 导航到医院
const handleNavigate = () => {
  openMap()
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
</style>