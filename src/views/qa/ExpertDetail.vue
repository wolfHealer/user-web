<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 专家信息 -->
    <section class="bg-white p-6">
      <div class="flex items-center">
        <img
          :src="expert.avatar || defaultAvatar"
          alt="头像"
          class="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <div class="font-semibold text-lg">{{ expert.name }}</div>
          <div class="text-sm text-gray-500">{{ expert.title }}</div>
          <div class="text-sm text-gray-500 mt-1">擅长：{{ expert.specialty.join('、') }}</div>
        </div>
      </div>
      <van-button
        type="primary"
        block
        class="mt-4"
        @click="goToAskQuestion"
      >
        向该专家提问
      </van-button>
    </section>

    <!-- 历史回复 -->
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">历史回复</h2>
      <div
        v-for="(reply, index) in replies"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 mb-4"
      >
        <div class="font-semibold text-sm">{{ reply.question }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ reply.answer }}</div>
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

// 专家信息
const expert = ref({
  id: 1,
  name: '张医生',
  title: '主任医师',
  specialty: ['渐冻症', 'SMA'],
  avatar: ''
})

// 历史回复数据
const replies = ref([
  {
    question: '渐冻症患者如何延缓病情发展？',
    answer: '建议尽早进行康复训练，配合药物治疗...'
  },
  {
    question: 'SMA患儿的饮食注意事项？',
    answer: '需保证营养均衡，避免高糖高脂食物...'
  }
])

// 跳转到提问页面
const goToAskQuestion = () => {
  router.push(`/qa/ask?expertId=${expert.value.id}`)
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