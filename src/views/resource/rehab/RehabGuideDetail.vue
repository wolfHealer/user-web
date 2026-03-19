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
      <h2 class="text-lg font-bold">训练指南详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.title }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.difficulty }}</van-tag>
          <van-tag plain>时长：{{ detail.duration }}</van-tag>
        </div>
      </div>

      <!-- 训练视频 -->
      <div class="p-4 bg-white mt-3" v-if="detail.videoUrl">
        <h3 class="font-semibold mb-2">训练视频</h3>
        <video 
          :src="detail.videoUrl" 
          controls 
          class="w-full rounded-lg"
          poster=""
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 训练图片 -->
      <div class="p-4 bg-white mt-3" v-if="imageList.length > 0">
        <h3 class="font-semibold mb-2">训练图示</h3>
        <van-image
          v-for="(img, index) in imageList"
          :key="index"
          :src="img"
          class="w-full mb-2 rounded-lg"
          fit="cover"
          @click="previewImage(img)"
        />
      </div>

      <!-- 训练内容 -->
      <div class="p-4 bg-white mt-3" v-if="detail.content">
        <h3 class="font-semibold mb-2">训练内容</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.content }}
        </div>
      </div>

      <!-- 训练目的 -->
      <div class="p-4 bg-white mt-3" v-if="detail.purpose">
        <h3 class="font-semibold mb-2">训练目的</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.purpose }}
        </div>
      </div>

      <!-- 禁忌事项 -->
      <div class="p-4 bg-white mt-3" v-if="detail.forbidden">
        <h3 class="font-semibold mb-2 text-red-600">禁忌事项</h3>
        <div class="text-sm text-red-700 leading-relaxed whitespace-pre-line">
          {{ detail.forbidden }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          v-if="detail.videoUrl"
          type="primary" 
          block 
          @click="playVideo"
          class="mb-2"
        >
          播放视频
        </van-button>
        <van-button 
          plain 
          block 
          @click="downloadGuide"
          class="mb-2"
        >
          下载 PDF 版
        </van-button>
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
    <van-empty v-else description="指南不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, ImagePreview } from 'vant'
import request from '@/utils/request'

// 类型定义
interface GuideDetail {
  id: number
  title: string
  content: string
  videoUrl: string
  duration: string
  difficulty: string
  purpose: string
  forbidden: string
  picUrls: string
}

// 响应式数据
const detail = ref<GuideDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 图片列表
const imageList = computed(() => {
  if (!detail.value?.picUrls) return []
  return detail.value.picUrls.split(',').map(url => url.trim())
})

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/rehab/trainings/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载指南详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 预览图片
const previewImage = (url: string) => {
  ImagePreview({
    images: imageList.value,
    startPosition: imageList.value.indexOf(url)
  })
}

// 播放视频
const playVideo = () => {
  if (!detail.value?.videoUrl) return
  window.open(detail.value.videoUrl, '_blank')
}

// 下载 PDF 版
const downloadGuide = async () => {
  if (!detail.value?.id) return
  
  try {
    const res = await request.get(`/api/resource/rehab/trainings/${detail.value.id}/resource`, {
      params: { type: 'pdf' },
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${detail.value.title}.pdf`
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

video {
  max-height: 400px;
}
</style>