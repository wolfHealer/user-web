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
      <h2 class="text-lg font-bold">药品详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 药品基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.name }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag :type="detail.insurance ? 'success' : 'default'">
            {{ detail.insurance ? '医保' : '非医保' }}
          </van-tag>
          <van-tag type="primary">{{ detail.type }}</van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>适应症</span>
            <span class="text-gray-700">{{ detail.indication }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span>药品类型</span>
            <span class="text-gray-700">{{ detail.type }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span>医保状态</span>
            <span class="text-gray-700">{{ detail.insurance ? '医保' : '非医保' }}</span>
          </div>
        </div>
      </div>

      <!-- 药品描述 -->
      <div class="p-4 bg-white mt-3" v-if="detail.desc">
        <h3 class="font-semibold mb-2">药品说明</h3>
        <div class="text-sm text-gray-700 leading-relaxed">
          {{ detail.desc }}
        </div>
      </div>

      <!-- 详细内容 -->
      <div class="p-4 bg-white mt-3" v-if="detail.content">
        <h3 class="font-semibold mb-2">详细信息</h3>
        <div class="text-sm text-gray-700 leading-relaxed">
          {{ detail.content }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          type="primary" 
          block 
          @click="handleDownload"
          class="mb-2"
        >
          下载说明书
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
    <van-empty v-else description="药品不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface DrugDetail {
  id: number
  name: string
  indication: string
  type: string
  insurance: boolean
  desc: string
  content?: string
  manualUrl?: string
  createdAt?: string
  updatedAt?: string
}

// 响应式数据
const detail = ref<DrugDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/drug/detail/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载药品详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 下载说明书
const handleDownload = async () => {
  if (!detail.value?.id) return
  
  try {
    const res = await request.get(`/api/resource/drug/manual/${detail.value.id}`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${detail.value.name}_说明书.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载说明书失败:', error)
    alert('下载说明书失败，请稍后再试！')
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
</style>