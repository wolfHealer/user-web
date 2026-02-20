<template>
  <div class="min-h-screen bg-blue-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-blue-600 shadow-sm p-4 flex items-center text-white">
      <van-icon name="arrow-left" size="24" color="#FFFFFF" @click="goBack" />
      <h1 class="ml-4 text-lg font-bold">{{ categoryName }}</h1>
    </header>

    <!-- 分类下的病种列表 -->
    <main class="flex-1 overflow-y-auto p-4">
      <h2 class="text-lg font-bold mb-4 text-blue-800">相关病种</h2>
      <div v-if="diseases.length > 0" class="space-y-3">
        <div
          v-for="(disease, index) in diseases"
          :key="index"
          class="bg-white rounded-lg shadow-blue-200 p-4 cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
          @click="goToDiseaseDetail(disease.id)"
        >
          <div class="font-semibold text-sm text-blue-700">{{ disease.name }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ disease.introduction }}</div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        暂无相关病种数据
      </div>
    </main>

    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/utils/request'
import BottomNav from '@/components/BottomNav.vue' // 引入底部导航组件

const router = useRouter()
const route = useRoute()

// 当前分类名称
const categoryName = ref('')

// 分类下的病种列表
const diseases = ref<{ id: number; name: string; introduction: string }[]>([])

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到病种详情页
const goToDiseaseDetail = (diseaseId: number) => {
  router.push(`/disease/${diseaseId}`)
}

// 根据分类 ID 加载病种列表
const loadDiseasesByCategory = async (categoryId: number) => {
  try {
    // 调用后端接口
    const response = await request.get(`/api/knowledge/category/${categoryId}/diseases`)
    console.log('接口响应:', response.data)

    // 解构返回数据
    const { categoryName: name, diseases: diseaseList } = response.data.data

    // 更新页面状态
    categoryName.value = name
    diseases.value = diseaseList.map((item: any) => ({
      id: item.id,
      name: item.name,
      introduction: item.introduction,
    }))
  } catch (error) {
    console.error('加载分类病种失败：', error)
    alert('数据加载失败，请稍后重试')
    // 设置默认值以保证页面正常显示
    categoryName.value = '未知分类'
    diseases.value = []
  }
}

// 页面加载时获取参数并加载数据
onMounted(() => {
  const categoryId = parseInt(route.params.id as string, 10)
  loadDiseasesByCategory(categoryId)
})
</script>

<style scoped>
.min-h-screen {
  background-color: #eff6ff; /* 浅天蓝色背景 */
}

.sticky.top-0 {
  background-color: #1E90FF; /* 深天蓝色顶部栏 */
  color: white;
}

.font-semibold.text-sm {
  color: #1E90FF; /* 天蓝色疾病名称 */
  font-weight: 600;
}

.rounded-lg {
  border-radius: 10px;
}

.shadow-blue-200 {
  box-shadow: 0 1px 3px rgba(30, 144, 255, 0.2); /* 天蓝色阴影 */
}

.border.border-blue-200 {
  border-color: #bfdbfe; /* 浅天蓝色边框 */
}

.hover\:bg-blue-100:hover {
  background-color: #dbeafe; /* 鼠标悬停时的浅天蓝色背景 */
}
</style>