<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">护理指南</h2>

    <van-collapse v-model="active">
      <van-collapse-item
        v-for="item in guides"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div class="text-sm leading-relaxed">
          {{ item.content }}
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref([])

const guides = [
  {
    id: 1,
    title: '吞咽困难护理',
    content: '建议采用半流质食物，避免呛咳...'
  },
  {
    id: 2,
    title: '卧床防褥疮',
    content: '每2小时翻身一次...'
  }
]
</script>