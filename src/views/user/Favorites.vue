<template>
  <div class="min-h-screen bg-blue-50 p-6">
    <h1 class="text-2xl font-bold mb-6">我的收藏</h1>
    <div v-if="favorites.length === 0" class="text-gray-500 text-center py-10">
      暂无收藏内容
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in favorites"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 border border-blue-200"
      >
        <div class="font-semibold text-blue-700">{{ item.title }}</div>
        <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟收藏数据
const favorites = ref([
  { title: '收藏的文章1', description: '这是一篇很棒的文章...' },
  { title: '收藏的文章2', description: '值得反复阅读的内容...' }
])
</script>