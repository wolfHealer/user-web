<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部标题栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <van-icon
        name="arrow-left"
        size="24"
        color="#000000"
        class="cursor-pointer"
        @click="goBack"
      />
      <h2 class="text-lg font-bold">机构详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 封面图片 -->
      <div class="w-full h-48 bg-gray-200" v-if="detail.coverUrl">
        <van-image
          :src="detail.coverUrl"
          class="w-full h-full"
          fit="cover"
          @click="previewImage(detail.coverUrl)"
        />
      </div>

      <!-- 机构基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.name }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.typeName }}</van-tag>
          <van-tag v-if="detail.isFree" type="success">免费</van-tag>
          <van-tag :type="detail.status === 'active' ? 'success' : 'default'">
            {{ detail.status === 'active' ? '服务中' : '已停业' }}
          </van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex items-center gap-2 py-2 border-b">
            <van-icon name="location" />
            <span>{{ detail.address || '线上服务' }}</span>
          </div>
          <div class="flex items-center gap-2 py-2 border-b">
            <van-icon name="phone" />
            <span @click="makeCall" class="cursor-pointer text-blue-600">{{ detail.phone }}</span>
          </div>
          <div class="flex items-center gap-2 py-2 border-b">
            <van-icon name="clock" />
            <span>{{ detail.serviceTime || '请咨询' }}</span>
          </div>
          <div class="flex items-center gap-2 py-2" v-if="detail.rating">
            <van-icon name="star" color="#ff976a" />
            <span>评分：{{ detail.rating }}</span>
          </div>
        </div>
      </div>

      <!-- 机构描述 -->
      <div class="p-4 bg-white mt-3" v-if="detail.description">
        <h3 class="font-semibold mb-2">机构介绍</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.description }}
        </div>
      </div>

      <!-- 服务项目 -->
      <div class="p-4 bg-white mt-3" v-if="detail.services && detail.services.length > 0">
        <h3 class="font-semibold mb-2">服务项目</h3>
        <div class="flex flex-wrap gap-2">
          <van-tag
            v-for="(service, index) in detail.services"
            :key="index"
            plain
          >
            {{ service }}
          </van-tag>
        </div>
      </div>

      <!-- 机构图片 -->
      <div class="p-4 bg-white mt-3" v-if="detail.images && detail.images.length > 0">
        <h3 class="font-semibold mb-2">机构环境</h3>
        <div class="flex flex-wrap gap-2">
          <van-image
            v-for="(img, index) in detail.images"
            :key="index"
            :src="img"
            :style="{ width: '30%', height: '100px' }"
            fit="cover"
            @click="previewImage(img)"
          />
        </div>
      </div>

      <!-- 咨询师团队 -->
      <div class="p-4 bg-white mt-3" v-if="detail.counselors && detail.counselors.length > 0">
        <h3 class="font-semibold mb-2">咨询师团队</h3>
        <van-cell-group>
          <van-cell
            v-for="(counselor, index) in detail.counselors"
            :key="index"
            :title="counselor.name"
            :label="`${counselor.title} · ${counselor.specialty}`"
          />
        </van-cell-group>
      </div>

      <!-- 联系方式 -->
      <div class="p-4 bg-white mt-3">
        <h3 class="font-semibold mb-2">联系方式</h3>
        <div class="space-y-2">
          <van-button 
            size="small" 
            type="primary" 
            block 
            @click="makeCall"
            class="mb-2"
          >
            拨打电话
          </van-button>
          <van-button 
            v-if="detail.website"
            size="small" 
            plain 
            block 
            @click="openWebsite"
            class="mb-2"
          >
            访问官网
          </van-button>
          <van-button 
            v-if="detail.address"
            size="small" 
            plain 
            block 
            @click="openNavigation"
          >
            导航前往
          </van-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          plain 
          block 
          @click="goBack"
        >
          返回列表
        </van-button>
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="机构不存在或已停业" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { ImagePreview as VanImagePreview } from 'vant'
import request from '@/utils/request'

// 类型定义
interface Counselor {
  name: string
  title: string
  specialty: string
}

interface OrganizationDetail {
  id: number
  name: string
  type: string
  typeName: string
  region: string
  regionCode: string
  address: string
  contact: string
  phone: string
  email: string
  website: string
  isFree: boolean
  serviceTime: string
  description: string
  services: string[]
  rating: number
  coverUrl: string
  images: string[]
  counselors: Counselor[]
  status: string
}

// 响应式数据
const detail = ref<OrganizationDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/rehab/psychological/organizations/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载机构详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 预览图片
const previewImage = (url: string) => {
  if (!detail.value) return
  
  const imageList: string[] = []
  if (detail.value.coverUrl) {
    imageList.push(detail.value.coverUrl)
  }
  if (detail.value.images && detail.value.images.length > 0) {
    imageList.push(...detail.value.images)
  }
  
  const startPosition = imageList.indexOf(url)
  
  VanImagePreview({
    images: imageList,
    startPosition: startPosition >= 0 ? startPosition : 0
  })
}

// 拨打电话
const makeCall = () => {
  if (!detail.value?.phone) return
  showDialog({
    title: '拨打机构电话',
    message: `确定拨打 ${detail.value.name}：${detail.value.phone} 吗？`,
    showCancelButton: true
  }).then(() => {
    window.location.href = `tel:${detail.value?.phone}`
  }).catch(() => {})
}

// 访问官网
const openWebsite = () => {
  if (!detail.value?.website) return
  window.open(detail.value.website, '_blank')
}

// 打开地图导航
const openNavigation = () => {
  if (!detail.value?.address) return
  showDialog({
    title: detail.value.name,
    message: `地址：${detail.value.address}`,
    showCancelButton: true,
    confirmButtonText: '导航前往',
    cancelButtonText: '取消'
  }).then(() => {
    window.open(`https://uri.amap.com/search?query=${encodeURIComponent(detail.value?.address || '')}`, '_blank')
  }).catch(() => {})
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb;
}

.sticky.top-0 {
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>