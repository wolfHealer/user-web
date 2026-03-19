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
      <h2 class="text-lg font-bold">器械详情</h2>
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

      <!-- 器械基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.name }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.categoryName }}</van-tag>
          <van-tag v-if="detail.insuranceCovered" type="success">医保覆盖</van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>价格范围</span>
            <span class="text-gray-700">{{ detail.priceRange }}</span>
          </div>
        </div>
      </div>

      <!-- 器械描述 -->
      <div class="p-4 bg-white mt-3" v-if="detail.desc">
        <h3 class="font-semibold mb-2">器械说明</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.desc }}
        </div>
      </div>

      <!-- 适用人群 -->
      <div class="p-4 bg-white mt-3" v-if="detail.suitableFor && detail.suitableFor.length > 0">
        <h3 class="font-semibold mb-2">适用人群</h3>
        <div class="flex flex-wrap gap-2">
          <van-tag
            v-for="(item, index) in detail.suitableFor"
            :key="index"
            plain
          >
            {{ item }}
          </van-tag>
        </div>
      </div>

      <!-- 器械图片 -->
      <div class="p-4 bg-white mt-3" v-if="detail.images && detail.images.length > 0">
        <h3 class="font-semibold mb-2">器械图片</h3>
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

      <!-- 演示视频 -->
      <div class="p-4 bg-white mt-3" v-if="detail.videoUrl">
        <h3 class="font-semibold mb-2">演示视频</h3>
        <video 
          :src="detail.videoUrl" 
          controls 
          class="w-full rounded-lg"
          style="max-height: 400px;"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 使用指南 -->
      <div class="p-4 bg-white mt-3">
        <h3 class="font-semibold mb-2">使用指南</h3>
        <van-button 
          type="primary" 
          block 
          @click="downloadGuide"
          class="mb-2"
        >
          下载使用指南 PDF
        </van-button>
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
    <van-empty v-else description="器械信息不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { ImagePreview as VanImagePreview } from 'vant'
import request from '@/utils/request'

// 类型定义
interface DeviceDetail {
  id: number
  name: string
  category: string
  categoryName: string
  desc: string
  suitableFor: string[]
  priceRange: string
  insuranceCovered: boolean
  coverUrl: string
  images: string[]
  guideUrl: string
  videoUrl: string
  status: string
}

// 响应式数据
const detail = ref<DeviceDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/rehab/devices/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载器械详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 预览图片
const previewImage = (url: string) => {
  if (!detail.value) return
  
  // 构建图片列表
  const imageList: string[] = []
  if (detail.value.coverUrl) {
    imageList.push(detail.value.coverUrl)
  }
  if (detail.value.images && detail.value.images.length > 0) {
    imageList.push(...detail.value.images)
  }
  
  // 找到当前图片的索引
  const startPosition = imageList.indexOf(url)
  
  // 调用 ImagePreview
  VanImagePreview({
    images: imageList,
    startPosition: startPosition >= 0 ? startPosition : 0
  })
}

// 下载使用指南
const downloadGuide = async () => {
  if (!detail.value?.id) return
  
  try {
    // 优先使用 guideUrl
    if (detail.value.guideUrl) {
      if (detail.value.guideUrl.startsWith('http')) {
        window.open(detail.value.guideUrl, '_blank')
        showToast('下载已开始')
        return
      }
    }

    // 调用下载接口
    const res = await request.get(`/api/resource/rehab/devices/${detail.value.id}/guide`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${detail.value.name}使用指南.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
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