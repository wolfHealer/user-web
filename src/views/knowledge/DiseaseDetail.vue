<template>
  <div class="min-h-screen bg-blue-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-blue-600 shadow-sm p-4 flex justify-between items-center text-white">
      <van-icon name="arrow-left" size="24" color="#FFFFFF" @click="goBack" />
      <div class="flex space-x-4">
        <van-icon
          :name="isFavorite ? 'star-filled' : 'star'"
          size="24"
          :color="isFavorite ? '#ff6b6b' : '#FFFFFF'"
          @click="toggleFavorite"
        />
        <van-icon name="share" size="24" color="#FFFFFF" @click="shareContent" />
        <van-icon name="warning" size="24" color="#FFFFFF" @click="reportError" />
      </div>
    </header>

    <!-- 病种详情内容 -->
    <main class="flex-1 overflow-y-auto p-4">
      <h1 class="text-xl font-bold mb-4 text-blue-800">{{ diseaseInfo.name }}</h1>
      <div class="bg-white rounded-lg shadow-blue-200 p-4 border border-blue-200">
        <p class="mb-4 text-sm text-gray-700 leading-relaxed">
          <strong>病种简介：</strong>{{ diseaseInfo.introduction }}
        </p>
        <p class="mb-4 text-sm text-gray-700 leading-relaxed">
          <strong>常见症状：</strong>{{ diseaseInfo.symptoms }}
        </p>
        <p class="mb-4 text-sm text-gray-700 leading-relaxed">
          <strong>诊疗指南：</strong>{{ diseaseInfo.guidelines }}
        </p>
        <p class="mb-4 text-sm text-gray-700 leading-relaxed">
          <strong>用药推荐：</strong>{{ diseaseInfo.medications }}
        </p>
        <p class="text-sm text-gray-700 leading-relaxed">
          <strong>病友经验：</strong>{{ diseaseInfo.experiences }}
        </p>
      </div>

      <!-- 图片展示 -->
      <section v-if="diseaseInfo.images.length > 0" class="mt-4">
        <h2 class="text-lg font-bold mb-4 text-blue-800">相关图片</h2>
        <div class="grid grid-cols-2 gap-2">
          <img
            v-for="(img, index) in diseaseInfo.images"
            :key="index"
            :src="img"
            alt="图片"
            class="rounded-lg border border-blue-200 cursor-pointer hover:border-blue-400 transition-colors"
            @click="previewImage(img)"
          />
        </div>
      </section>
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

const diseaseInfo = ref({
  name: '',
  introduction: '',
  symptoms: '',
  guidelines: '',
  medications: '',
  experiences: '',
  images: [] as string[]
})

const isFavorite = ref(false)

const goBack = () => router.back()
const toggleFavorite = () => (isFavorite.value = !isFavorite.value)
const shareContent = () => alert('分享功能待开发')
const reportError = () => alert('纠错功能待开发')
const previewImage = (url: string) => window.open(url, '_blank')

const loadDiseaseDetail = async (id: string) => {
  try {
    const response = await request.get(`/api/knowledge/disease/${id}`)
    diseaseInfo.value = response.data.data
  } catch (error) {
    console.error('加载病种详情失败：', error)
    alert('数据加载失败，请稍后重试')
  }
}

onMounted(() => {
  const diseaseId = route.params.id as string
  loadDiseaseDetail(diseaseId)
})
</script>

<style scoped>
.min-h-screen {
  background-color: #eff6ff;
}

.sticky.top-0 {
  background-color: #1E90FF;
  color: white;
}

.text-blue-800 {
  color: #1e3a8a;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-blue-200 {
  box-shadow: 0 1px 3px rgba(30, 144, 255, 0.2);
}

.border.border-blue-200 {
  border-color: #bfdbfe;
}

.hover\:border-blue-400:hover {
  border-color: #60a5fa;
}

.rounded-lg {
  border-radius: 10px;
}

.leading-relaxed {
  line-height: 1.75;
}
</style>