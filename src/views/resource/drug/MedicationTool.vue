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
      <h2 class="text-lg font-bold">用药管理工具</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" type="spinner" class="py-8">
      加载中...
    </van-loading>

    <!-- 空状态 -->
    <div v-else-if="tools.length === 0" class="text-center text-gray-400 py-8">
      暂无可用工具
    </div>

    <!-- 工具列表 -->
    <div class="p-4" v-else>
      <van-cell-group>
        <van-cell
          v-for="tool in tools"
          :key="tool.id"
          :title="tool.title"
          :label="tool.description"
          is-link
          @click="downloadFile(tool)"
        >
          <template #right-icon>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400">{{ tool.fileSize }}</span>
              <van-icon name="download" size="18" color="#1989fa" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import { showToast, showSuccessToast } from 'vant'

// 类型定义
interface Tool {
  id: number
  title: string
  description: string
  fileType: 'excel' | 'word' | 'pdf'
  fileSize: string
  downloadUrl: string
  updatedAt: string
}

// 响应式数据
const tools = ref<Tool[]>([])
const loading = ref(false)
const router = useRouter()

// 获取工具列表
const fetchTools = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/drug/tool/list')
    tools.value = res.data.data?.list || res.data.data || res.data || []
  } catch (error) {
    console.error('获取工具列表失败:', error)
    tools.value = []
    showToast('加载工具列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 下载文件
const downloadFile = async (tool: Tool) => {
  try {
    const res = await request.get(`/api/resource/drug/tool/download/${tool.id}`, {
      responseType: 'blob'
    })
    
    // 根据文件类型设置 MIME
    const mimeTypes: Record<string, string> = {
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      word: 'application/msword',
      pdf: 'application/pdf'
    }
    
    const blob = new Blob([res.data], { 
      type: mimeTypes[tool.fileType] || 'application/octet-stream' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.title}.${tool.fileType}`
    a.click()
    URL.revokeObjectURL(url)
    
    showSuccessToast('下载成功')
  } catch (error) {
    console.error('下载文件失败:', error)
    showToast('下载失败，请稍后再试')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  fetchTools()
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