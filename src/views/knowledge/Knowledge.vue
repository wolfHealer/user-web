<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center">
      <!-- 返回按钮 -->
      <van-icon
        name="arrow-left"
        size="24"
        class="cursor-pointer mr-4"
        @click="goBack"
      />
      <h1 class="text-lg font-bold">知识库</h1>
    </header>

    <!-- 顶部搜索栏 -->
    <section class="p-4">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索病种、症状、药物..."
        shape="round"
        background="#f9f9f9"
        @search="handleSearch"
      />
      <!-- 实时联想 -->
      <div v-if="suggestions.length > 0" class="mt-2 bg-white rounded shadow p-2">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="py-2 px-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
          @click="selectSuggestion(item)"
        >
          {{ item }}
        </div>
      </div>
    </section>

    <!-- 病种分类 -->
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">病种分类</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
          @click="goToCategory(category.id)"
        >
          <van-icon :name="category.icon" size="32" color="#409EFF" />
          <span class="mt-2 text-sm text-gray-700">{{ category.name }}</span>
        </div>
      </div>
    </section>

    <!-- 热门病种推荐 -->
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">热门病种</h2>
      <div class="space-y-3">
        <div
          v-for="(disease, index) in hotDiseases"
          :key="index"
          class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-blue-50 transition-colors"
          @click="goToDiseaseDetail(disease.id)"
        >
          <div class="font-semibold text-sm">{{ disease.name }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ disease.summary }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 实时联想结果
const suggestions = ref<string[]>([])

// 病种分类数据
const categories = ref([
  { id: 1, name: '神经肌肉类', icon: 'location-o' },
  { id: 2, name: '代谢类', icon: 'balance-o' },
  { id: 3, name: '免疫类', icon: 'shield-o' },
  { id: 4, name: '遗传类', icon: 'dna' }
])

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
</script>

<style scoped>
.text-sm {
  font-size: 16px;
}
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.cursor-pointer:hover {
  opacity: 0.8;
}
</style>