<template>
  <div class="p-4">
    <h2 class="text-lg font-bold">{{ detail.title }}</h2>

    <div class="text-xs text-gray-500 mt-1">
      发布机构：{{ detail.org }}
    </div>

    <!-- 操作 -->
    <div class="flex gap-2 mt-3">
      <van-button size="small" type="primary">在线预览</van-button>
      <van-button size="small">下载PDF</van-button>
    </div>

    <div class="mt-4 text-sm leading-relaxed">
      {{ detail.summary }}
    </div>
  </div>
</template>

<script setup lang="ts">
const detail = {
  title: 'ALS诊疗指南',
  org: '中华医学会',
  summary: '本指南适用于...'
}
</script>