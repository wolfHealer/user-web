<template>
  <div class="min-h-screen bg-blue-50 p-6">
    <h1 class="text-2xl font-bold mb-6">我的提问</h1>
    <div v-if="questions.length === 0" class="text-gray-500 text-center py-10">
      暂无提问内容
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 border border-blue-200"
      >
        <div class="font-semibold text-blue-700">{{ question.title }}</div>
        <div class="text-sm text-gray-500 mt-1">{{ question.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟提问数据
const questions = ref([
  { title: '关于疾病的疑问', content: '我想了解这种病的治疗方法...' },
  { title: '用药咨询', content: '请问这种药有没有副作用？' }
])
</script>