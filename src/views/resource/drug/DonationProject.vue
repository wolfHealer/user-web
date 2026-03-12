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
      <h2 class="text-lg font-bold">药品赠药/援助项目</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" type="spinner" class="py-8">
      加载中...
    </van-loading>

    <!-- 空状态 -->
    <div v-else-if="projects.length === 0" class="text-center text-gray-400 py-8">
      暂无援助项目
    </div>

    <!-- 项目列表 -->
    <div class="p-4 space-y-3" v-else>
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-xl p-4 shadow-sm"
      >
        <div class="font-semibold">{{ project.name }}</div>

        <div class="text-sm text-gray-500 mt-1">
          条件：{{ project.condition }} | 周期：{{ project.period }}
        </div>

        <div class="text-sm mt-2">{{ project.desc }}</div>

        <!-- 状态标签 -->
        <div class="mt-2">
          <van-tag :type="project.status === 'active' ? 'success' : 'danger'">
            {{ project.status === 'active' ? '进行中' : '已截止' }}
          </van-tag>
          <span class="text-xs text-gray-400 ml-2">截止：{{ project.deadline }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2 mt-3">
          <van-button 
            size="small" 
            type="primary" 
            @click="apply(project)"
            :disabled="project.status !== 'active'"
          >
            申请援助
          </van-button>
          <van-button size="small" plain @click="checkProgress(project)">
            查询进度
          </van-button>
          <van-button size="small" plain @click="downloadGuide(project)">
            下载指南
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import { showToast, showSuccessToast, showDialog } from 'vant'

// 类型定义
interface Project {
  id: number
  name: string
  condition: string
  period: string
  desc: string
  status: 'active' | 'expired'
  deadline: string
  guideUrl?: string
}

// 响应式数据
const projects = ref<Project[]>([])
const loading = ref(false)
const router = useRouter()

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/drug/donation/list')
    projects.value = res.data.data?.list || res.data.data || res.data || []
  } catch (error) {
    console.error('获取援助项目列表失败:', error)
    projects.value = []
    showToast('加载项目列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 申请援助
// const apply = async (project: Project) => {
//   if (project.status !== 'active') {
//     showToast('该项目已截止申请')
//     return
//   }
  
//   showDialog({
//     title: '申请援助',
//     content: '请填写申请信息',
//     showInput: true,
//     confirmButtonText: '提交',
//     cancelButtonText: '取消'
//   }).then(async ({ value }: any) => {
//     if (!value) {
//       showToast('请输入申请信息')
//       return
//     }
    
//     try {
//       await request.post(`/api/resource/drug/donation/apply/${project.id}`, {
//         description: value
//       })
//       showSuccessToast('申请提交成功，请等待审核')
//     } catch (error) {
//       console.error('提交申请失败:', error)
//       showToast('申请提交失败，请稍后再试')
//     }
//   }).catch(() => {})
// }
// 申请援助 - 跳转申请页面
const apply = (project: Project) => {
  if (project.status !== 'active') {
    showToast('该项目已截止申请')
    return
  }
  router.push(`/resource/drug/donation/apply?projectId=${project.id}`)
}


// 查询进度
const checkProgress = async (project: Project) => {
  try {
    const res = await request.get(`/api/resource/drug/donation/progress/${project.id}`)
    const data = res.data.data
    
    showDialog({
      title: '申请进度',
      content: `
        项目：${data.projectName}<br>
        状态：${data.statusText}<br>
        提交时间：${data.submitTime}<br>
        更新时间：${data.updateTime}
      `,
      allowHtml: true
    })
  } catch (error) {
    console.error('查询进度失败:', error)
    showDialog({
      title: '申请进度',
      content: '暂无申请记录'
    })
  }
}

// 下载指南
const downloadGuide = async (project: Project) => {
  try {
    const res = await request.get(`/api/resource/drug/donation/guide/${project.id}`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name}_申请指南.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showSuccessToast('下载成功')
  } catch (error) {
    console.error('下载指南失败:', error)
    showToast('下载失败，请稍后再试')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  fetchProjects()
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