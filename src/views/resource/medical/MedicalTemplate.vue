<template>
  <div class="p-4">
    <div
      v-for="item in templates"
      :key="item.id"
      class="bg-white p-4 rounded-lg shadow-sm mb-3"
    >
      <div class="font-medium">{{ item.title }}</div>

      <div class="text-xs text-gray-500 mt-1">
        格式：Word / Excel / PDF
      </div>

      <van-button
        size="small"
        type="primary"
        class="mt-2"
        @click="download(item)"
      >
        下载模板
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const templates = [
  { id: 1, title: '渐冻症标准病历模板' }
]

const download = (item: any) => {
  console.log('download', item)
}
</script>