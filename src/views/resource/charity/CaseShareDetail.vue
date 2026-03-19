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
      <h2 class="text-lg font-bold">案例详情</h2>
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

      <!-- 案例基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.title }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.disease }}</van-tag>
          <van-tag plain>救助金额：{{ detail.amount }}</van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>发布日期</span>
            <span class="text-gray-700">{{ formatDate(detail.publishDate) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span>浏览次数</span>
            <span class="text-gray-700">{{ detail.viewCount || 0 }}</span>
          </div>
          <div class="flex justify-between py-2" v-if="detail.projectName">
            <span>救助项目</span>
            <span class="text-gray-700 cursor-pointer" @click="viewProject(detail.projectId)">
              {{ detail.projectName }}
            </span>
          </div>
        </div>
      </div>

      <!-- 案例摘要 -->
      <div class="p-4 bg-white mt-3" v-if="detail.summary">
        <h3 class="font-semibold mb-2">案例摘要</h3>
        <div class="text-sm text-gray-700 leading-relaxed">
          {{ detail.summary }}
        </div>
      </div>

      <!-- 案例详细内容 -->
      <div class="p-4 bg-white mt-3" v-if="detail.content">
        <h3 class="font-semibold mb-2">案例详情</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.content }}
        </div>
      </div>

      <!-- 案例图片 -->
      <div class="p-4 bg-white mt-3" v-if="detail.images && detail.images.length > 0">
        <h3 class="font-semibold mb-2">案例图片</h3>
        <div class="grid grid-cols-3 gap-2">
          <van-image
            v-for="(img, index) in detail.images"
            :key="index"
            :src="img"
            class="w-full h-24 rounded-lg"
            fit="cover"
            @click="previewImage(img)"
          />
        </div>
      </div>

      <!-- 案例视频 -->
      <div class="p-4 bg-white mt-3" v-if="detail.videoUrl">
        <h3 class="font-semibold mb-2">案例视频</h3>
        <video 
          :src="detail.videoUrl" 
          controls 
          class="w-full rounded-lg"
          poster=""
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 申请流程 -->
      <div class="p-4 bg-white mt-3" v-if="detail.applyProcess">
        <h3 class="font-semibold mb-2">申请流程</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.applyProcess }}
        </div>
      </div>

      <!-- 申请提示 -->
      <div class="p-4 bg-white mt-3" v-if="detail.tips">
        <h3 class="font-semibold mb-2 text-blue-600">申请提示</h3>
        <div class="text-sm text-blue-700 leading-relaxed whitespace-pre-line">
          {{ detail.tips }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          type="primary" 
          block 
          @click="downloadPdf"
          class="mb-2"
        >
          下载案例 PDF
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
    <van-empty v-else description="案例不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, ImagePreview } from 'vant'
import request from '@/utils/request'

// 类型定义
interface CaseDetail {
  id: number
  title: string
  disease: string
  diseaseCode: string
  amount: string
  amountValue: number
  summary: string
  content: string
  publishDate: string
  coverUrl: string
  images: string[]
  videoUrl: string
  projectName: string
  projectId: number
  applyProcess: string
  tips: string
  viewCount: number
  status: string
  pdfUrl: string
}

// 响应式数据
const detail = ref<CaseDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/charity/cases/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载案例详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 预览图片
const previewImage = (url: string) => {
  const imageList = detail.value?.images || []
  if (detail.value?.coverUrl) {
    imageList.unshift(detail.value.coverUrl)
  }
  ImagePreview({
    images: imageList,
    startPosition: imageList.indexOf(url)
  })
}

// 查看救助项目
const viewProject = (projectId: number) => {
  if (!projectId) {
    showToast('项目信息不可用')
    return
  }
  router.push(`/resource/charity/detail/${projectId}`)
}

// 下载案例 PDF
const downloadPdf = async () => {
  if (!detail.value?.id) return
  
  try {
    // 优先使用 pdfUrl
    if (detail.value.pdfUrl) {
      if (detail.value.pdfUrl.startsWith('http')) {
        window.open(detail.value.pdfUrl, '_blank')
        showToast('下载已开始')
        return
      }
    }
    
    // 调用下载接口
    const res = await request.get(`/api/resource/charity/cases/${detail.value.id}/pdf`, {
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