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
      <h2 class="text-lg font-bold">政策详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 政策基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.title }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.category }}</van-tag>
          <van-tag plain>{{ detail.region }}</van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>发布地区</span>
            <span class="text-gray-700">{{ detail.region }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span>发布日期</span>
            <span class="text-gray-700">{{ formatDate(detail.publishDate) }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span>政策类别</span>
            <span class="text-gray-700">{{ detail.category }}</span>
          </div>
        </div>
      </div>

      <!-- 政策内容 -->
      <div class="p-4 bg-white mt-3" v-if="detail.content">
        <h3 class="font-semibold mb-2">政策解读</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.content }}
        </div>
      </div>

      <!-- 相关文件 -->
      <div class="p-4 bg-white mt-3" v-if="detail.fileUrl">
        <h3 class="font-semibold mb-2">政策文件</h3>
        <van-button 
          size="small" 
          plain 
          block 
          @click="downloadFile(detail.fileUrl, '政策文件')"
        >
          下载政策原文
        </van-button>
      </div>

      <!-- 相关政策 -->
      <div class="p-4 bg-white mt-3" v-if="detail.relatedPolicies && detail.relatedPolicies.length > 0">
        <h3 class="font-semibold mb-2">相关政策</h3>
        <van-cell-group>
          <van-cell
            v-for="policy in detail.relatedPolicies"
            :key="policy.id"
            :title="policy.title"
            is-link
            @click="viewRelated(policy.id)"
          />
        </van-cell-group>
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
    <van-empty v-else description="政策不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

// 类型定义
interface PolicyDetail {
  id: number
  title: string
  region: string
  regionCode: string
  publishDate: string
  category: string
  content: string
  fileUrl: string
  relatedPolicies?: Array<{
    id: number
    title: string
  }>
}

// 响应式数据
const detail = ref<PolicyDetail | null>(null)
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
    const res = await request.get(`/api/resource/charity/policies/detail/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载政策详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 下载文件
const downloadFile = async (url: string, fileName: string) => {
  try {
    // 如果是完整 URL，直接打开新窗口下载
    if (url.startsWith('http')) {
      window.open(url, '_blank')
      showToast(`${fileName}已开始下载`)
      return
    }
    
    // 如果是相对路径，通过 request 下载
    const res = await request.get(url, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `${fileName}.pdf`
    a.click()
    URL.revokeObjectURL(blobUrl)
    showToast(`${fileName}已开始下载`)
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
}

// 查看相关政策
const viewRelated = (id: number) => {
  router.push(`/resource/charity/policies/detail/${id}`)
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