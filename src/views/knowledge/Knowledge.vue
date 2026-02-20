<template>
  <div class="min-h-screen bg-blue-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-blue-600 shadow-sm p-4 w-full flex items-center text-white">
      <van-icon
        name="arrow-left"
        size="24"
        color="#FFFFFF"
        class="cursor-pointer mr-4"
        @click="goBack"
      />
      <h1 class="text-lg font-bold">知识库</h1>
    </header>

    <!-- 内容区域 -->
    <main class="flex-1 overflow-y-auto">
      <!-- 顶部搜索栏 -->
      <section class="p-4 max-w-4xl mx-auto">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索病种、症状、药物..."
          shape="round"
          background="#f9f9f9"
          @search="handleSearch"
        />
        <!-- 实时联想 -->
        <div v-if="suggestions.length > 0" class="mt-2 bg-white rounded shadow-blue-200 p-2 border border-blue-200">
          <div
            v-for="(item, index) in suggestions"
            :key="index"
            class="py-2 px-3 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors"
            @click="selectSuggestion(item)"
          >
            {{ item }}
          </div>
        </div>
      </section>

      <!-- 病种分类 -->
      <section class="p-4 max-w-4xl mx-auto">
        <h2 class="text-lg font-bold mb-4 text-blue-800">病种分类</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-blue-200 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            @click="goToCategory(category.id)"
          >
            <van-icon :name="category.icon" size="32" color="#1E90FF" />
            <span class="mt-2 text-sm text-gray-700">{{ category.name }}</span>
          </div>
        </div>
      </section>

      <!-- 热门病种推荐 -->
      <section class="p-4 max-w-4xl mx-auto">
        <h2 class="text-lg font-bold mb-4 text-blue-800">热门病种</h2>
        <div class="space-y-3">
          <div
            v-for="(disease, index) in hotDiseases"
            :key="index"
            class="bg-white rounded-lg shadow-blue-200 p-4 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            @click="goToDiseaseDetail(disease.id)"
          >
            <div class="font-semibold text-sm text-blue-700">{{ disease.name }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ disease.summary }}</div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>


<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'

import request from '@/utils/request'

import BottomNav from '@/components/BottomNav.vue' // 引入底部导航组件

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 实时联想结果
const suggestions = ref<string[]>([])

// 病种分类数据
// const categories = ref([
//   { id: 1, name: '神经肌肉类', icon: 'location-o' },
//   { id: 2, name: '代谢类', icon: 'balance-o' },
//   { id: 3, name: '免疫类', icon: 'shield-o' },
//   { id: 4, name: '遗传类', icon: 'dna' }
// ])
// 病种分类数据（从后端接口获取）
const categories = ref<{ id: number; name: string; icon: string }[]>([])
// 获取病种分类数据
const fetchCategories = async () => {
  try {
    const response = await request.get('/api/knowledge/categories')
    const { categories: categoryList } = response.data.data

    // 映射为前端所需格式
    categories.value = categoryList.map((item: any) => ({
      id: item.id,
      name: item.name,
      icon: item.icon_url
    }))
  } catch (error) {
    console.error('获取分类数据失败:', error)
    alert('数据加载失败，请稍后重试')
  }
}
// 热门病种数据
const hotDiseases = ref([
  { id: 1, name: '肌萎缩侧索硬化症', summary: '一种罕见的神经系统退行性疾病...' },
  { id: 2, name: '法布里病', summary: '一种X染色体连锁的溶酶体贮积病...' }
])

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

// 选择联想词
const selectSuggestion = (word: string) => {
  searchKeyword.value = word
  handleSearch()
}

// 跳转到分类页面
const goToCategory = (categoryId: number) => {
  router.push(`/category/${categoryId}`)
}

// 跳转到病种详情页
const goToDiseaseDetail = (diseaseId: number) => {
  router.push(`/disease/${diseaseId}`)
}

// 返回上一级页面
const goBack = () => {
  router.back()
}

// 页面加载时获取分类数据
onMounted(() => {
  fetchCategories()
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

.text-blue-800 {
  color: #1e3a8a; /* 深天蓝色标题 */
}

.bg-white {
  background-color: #ffffff; /* 白色卡片背景 */
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

.rounded-lg {
  border-radius: 10px;
}

.cursor-pointer:hover {
  opacity: 0.9;
}
</style>