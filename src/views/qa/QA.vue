<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部搜索栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索专家或问题"
        shape="round"
        background="#f9f9f9"
        class="flex-1"
      />
      <van-button
        type="primary"
        size="small"
        class="ml-2"
        @click="goToAskQuestion"
      >
        提问
      </van-button>
    </header>

    <!-- 专家列表 -->
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">专家列表</h2>
      <div
        v-for="(expert, index) in experts"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer"
        @click="goToExpertDetail(expert.id)"
      >
        <div class="flex items-center">
          <img
            :src="expert.avatar || defaultAvatar"
            alt="头像"
            class="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <div class="font-semibold text-sm">{{ expert.name }}</div>
            <div class="text-xs text-gray-500">{{ expert.title }}</div>
            <div class="text-xs text-gray-500 mt-1">擅长：{{ expert.specialty.join('、') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门问题 -->
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">热门问题</h2>
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 mb-4"
      >
        <div class="font-semibold text-sm">{{ question.title }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ question.content }}</div>
        <div class="flex justify-between items-center mt-3">
          <div class="text-xs text-gray-500">
            {{ question.expert ? '专家回复' : '等待回复' }}
          </div>
          <van-tag
            v-if="question.expert"
            type="primary"
            size="small"
          >
            专家
          </van-tag>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 默认头像
const defaultAvatar = 'https://example.com/default-avatar.png'

// 搜索关键词
const searchKeyword = ref('')

// 专家列表数据
const experts = ref([
  {
    id: 1,
    name: '张医生',
    title: '主任医师',
    specialty: ['渐冻症', 'SMA'],
    avatar: ''
  },
  {
    id: 2,
    name: '李医生',
    title: '副主任医师',
    specialty: ['法布里病', '戈谢病'],
    avatar: ''
  }
])

// 热门问题数据
const questions = ref([
  {
    id: 1,
    title: '渐冻症患者如何延缓病情发展？',
    content: '最近确诊为渐冻症，想了解有哪些治疗方法...',
    expert: true
  },
  {
    id: 2,
    title: 'SMA患儿的康复训练建议？',
    content: '孩子刚确诊SMA，希望能得到专业的康复指导...',
    expert: false
  }
])

// 跳转到提问页面
const goToAskQuestion = () => {
  router.push('/qa/ask')
}

// 跳转到专家详情页
const goToExpertDetail = (expertId: number) => {
  router.push(`/qa/expert/${expertId}`)
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
</style>