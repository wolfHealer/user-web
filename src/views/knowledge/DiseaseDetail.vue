<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
      <van-icon name="arrow-left" size="24" @click="goBack" />
      <div class="flex space-x-4">
        <van-icon
          :name="isFavorite ? 'star-filled' : 'star'"
          size="24"
          :color="isFavorite ? '#ff6b6b' : '#ccc'"
          @click="toggleFavorite"
        />
        <van-icon name="share" size="24" @click="shareContent" />
        <van-icon name="warning" size="24" @click="reportError" />
      </div>
    </header>

    <!-- 病种详情内容 -->
    <section class="p-4">
      <h1 class="text-xl font-bold mb-4">{{ diseaseInfo.name }}</h1>
      <div class="text-sm text-gray-700 leading-relaxed">
        <p class="mb-4"><strong>病种简介：</strong>{{ diseaseInfo.introduction }}</p>
        <p class="mb-4"><strong>常见症状：</strong>{{ diseaseInfo.symptoms }}</p>
        <p class="mb-4"><strong>诊疗指南：</strong>{{ diseaseInfo.guidelines }}</p>
        <p class="mb-4"><strong>用药推荐：</strong>{{ diseaseInfo.medications }}</p>
        <p><strong>病友经验：</strong>{{ diseaseInfo.experiences }}</p>
      </div>
    </section>

    <!-- 图片展示 -->
    <section v-if="diseaseInfo.images.length > 0" class="p-4">
      <h2 class="text-lg font-bold mb-4">相关图片</h2>
      <div class="grid grid-cols-2 gap-2">
        <img
          v-for="(img, index) in diseaseInfo.images"
          :key="index"
          :src="img"
          alt="图片"
          class="rounded cursor-pointer"
          @click="previewImage(img)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import { useRouter,useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()


// 病种详情数据
const diseaseInfo = ref({
  name: '',
  introduction: '',
  symptoms: '',
  guidelines: '',
  medications: '',
  experiences: '',
  images: [] as string[]
})


// 是否已收藏
const isFavorite = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 收藏/取消收藏
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 分享内容
const shareContent = () => {
  alert('分享功能待开发')
}

// 纠错反馈
const reportError = () => {
  alert('纠错功能待开发')
}

// 预览图片
const previewImage = (url: string) => {
  window.open(url, '_blank')
}

// 根据 ID 加载病种详情
const loadDiseaseDetail = async (id: string) => {
  // 模拟 API 请求
  const mockData = {
    1: {
      name: '肌萎缩侧索硬化症',
      introduction: '一种罕见的神经系统退行性疾病...',
      symptoms: '肌肉无力、吞咽困难、呼吸衰竭...',
      guidelines: '早期诊断、综合治疗、康复训练...',
      medications: '利鲁唑、依达拉奉...',
      experiences: '患者分享的就医经验和护理心得...',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ]
    },
    2: {
      name: '法布里病',
      introduction: '一种X染色体连锁的溶酶体贮积病...',
      symptoms: '疼痛、皮肤病变、肾功能损害...',
      guidelines: '酶替代疗法、对症治疗...',
      medications: '阿加糖酶β...',
      experiences: '患者分享的治疗经历...',
      images: []
    }
  }
  try{
    diseaseInfo.value = mockData[id as keyof typeof mockData] || {}
  }catch(error){
    console.error('加载病种详情失败：', error)
    alert('数据加载失败，请稍后重试')
  }
}

// 页面加载时获取参数并加载数据
onMounted(() => {
  const diseaseId = route.params.id as string
  loadDiseaseDetail(diseaseId)
})
</script>

<style scoped>
.text-sm {
  font-size: 16px;
}
.leading-relaxed {
  line-height: 1.75;
}
.rounded {
  border-radius: 8px;
}
</style>