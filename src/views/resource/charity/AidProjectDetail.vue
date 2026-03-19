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
      <h2 class="text-lg font-bold">项目详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 项目基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.title }}</h2>
        
        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>截止日期</span>
            <span class="text-gray-700">{{ formatDate(detail.deadline) }}</span>
          </div>
        </div>
      </div>

      <!-- 项目内容 -->
      <div class="p-4 bg-white mt-3" v-if="detail.content">
        <h3 class="font-semibold mb-2">项目内容</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.content }}
        </div>
      </div>

      <!-- 申请条件 -->
      <div class="p-4 bg-white mt-3" v-if="detail.requirements">
        <h3 class="font-semibold mb-2">申请条件</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.requirements }}
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="p-4 bg-white mt-3" v-if="detail.contact">
        <h3 class="font-semibold mb-2">联系方式</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.contact }}
        </div>
      </div>

      <!-- 资料下载 -->
      <div class="p-4 bg-white mt-3">
        <h3 class="font-semibold mb-2">资料下载</h3>
        <div class="space-y-2">
          <van-button 
            v-if="detail.applyForm"
            size="small" 
            plain 
            block 
            @click="downloadFile(detail.applyForm, '申请表')"
          >
            下载申请表
          </van-button>
          <van-button 
            v-if="detail.applyGuide"
            size="small" 
            plain 
            block 
            @click="downloadFile(detail.applyGuide, '申请指南')"
          >
            下载申请指南
          </van-button>
          <van-button 
            v-if="detail.materialList"
            size="small" 
            plain 
            block 
            @click="downloadFile(detail.materialList, '材料清单')"
          >
            下载材料清单
          </van-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          type="primary" 
          block 
          @click="handleApply"
          class="mb-2"
        >
          申请救助
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
    <van-empty v-else description="项目不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

// 类型定义
interface ProjectDetail {
  id: number
  title: string
  content: string
  requirements: string
  deadline: string
  contact: string
  applyForm: string
  applyGuide: string
  materialList: string
}

// 响应式数据
const detail = ref<ProjectDetail | null>(null)
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
    const res = await request.get(`/api/resource/charity/projects/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载项目详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 申请救助
const handleApply = async () => {
  if (!detail.value?.id) return
  
  try {
    const res = await request.post('/api/resource/charity/apply', {
      projectId: detail.value.id
    })
    if (res.data.code === 200) {
      showToast('申请提交成功')
      goBack()
    } else {
      showToast(res.data.message || '申请失败')
    }
  } catch (error) {
    console.error('申请失败:', error)
    showToast('申请失败，请重试')
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