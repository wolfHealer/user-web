<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">康复训练指南</h2>

    <div
      v-for="item in list"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4"
    >
      <div class="font-semibold">{{ item.title }}</div>

      <div class="text-sm text-gray-500 mt-1">
        类型：{{ item.type }}
      </div>

      <div class="mt-3">
        <van-button size="small" type="primary">
          观看教程
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const list = [
  {
    id: 1,
    title: '呼吸训练基础',
    type: '视频教程'
  }
]
</script>