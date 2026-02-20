<template>
  <div class="min-h-screen bg-blue-50 p-6">
    <h1 class="text-2xl font-bold mb-6">我的发布</h1>
    <div v-if="posts.length === 0" class="text-gray-500 text-center py-10">
      暂无发布内容
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="(post, index) in posts"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 border border-blue-200"
      >
        <div class="font-semibold text-blue-700">{{ post.title }}</div>
        <div class="text-sm text-gray-500 mt-1">{{ post.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟发布数据
const posts = ref([
  { title: '我的第一篇动态', content: '这是我发布的第一个动态...' },
  { title: '我的第二篇动态', content: '继续分享生活点滴...' }
])
</script>