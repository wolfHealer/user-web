<template>
  <div class="p-4">
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" />

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <h2 class="text-lg font-bold">{{ detail.title }}</h2>

      <div class="text-xs text-gray-500 mt-1">
        发布机构：{{ detail.org }} · {{ detail.year }}
      </div>

      <!-- 操作 -->
      <div class="flex gap-2 mt-3">
        <van-button 
          size="small" 
          type="primary" 
          @click="handlePreview"
        >
          在线预览
        </van-button>
        <van-button 
          size="small" 
          @click="handleDownload"
        >
          下载 PDF
        </van-button>
      </div>

      <div class="mt-4 text-sm leading-relaxed">
        {{ detail.summary }}
      </div>

      <!-- 详细内容 -->
      <div class="mt-4 text-sm text-gray-700" v-if="detail.content">
        {{ detail.content }}
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="指南不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface GuideDetail {
  id: number
  title: string
  org: string
  year: string
  summary: string
  content?: string
  pdfUrl?: string
  createdAt?: string
}

// 响应式数据
const detail = ref<GuideDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
// const router = useRouter()

// 加载详情
// const loadDetail = async () => {
//   loading.value = true
//   try {
//     const id = Number(route.params.id)
//     // const res = await getGuideDetail(id)
//     // detail.value = res.data
//     // 模拟数据
//     detail.value = {
//       id: 1,
//       title: 'ALS 诊疗指南（2024）',
//       org: '中华医学会',
//       year: '2024',
//       summary: '本指南适用于...',
//       content: '完整的指南内容...',
//       pdfUrl: 'https://example.com/guide.pdf',
//       createdAt: '2024-01-01'
//     }
//   } catch (error) {
//     console.error('加载指南详情失败:', error)
//     detail.value = null
//   } finally {
//     loading.value = false
//   }
// }
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/medical/guides/${id}`)
    detail.value = res.data.data
  } catch (error) {
    console.error('加载指南详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 在线预览
const handlePreview = () => {
  if (detail.value?.pdfUrl) {
    window.open(detail.value.pdfUrl, '_blank')
  }
}

// 下载 PDF
const handleDownload = () => {
  if (detail.value?.pdfUrl) {
    const link = document.createElement('a')
    link.href = detail.value.pdfUrl
    link.download = `${detail.value.title}.pdf`
    link.click()
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