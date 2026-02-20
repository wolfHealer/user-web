<template>
  <div class="p-4">
    <van-search placeholder="搜索医生/医院" />

    <div class="space-y-3 mt-3">
      <div
        v-for="doc in doctors"
        :key="doc.id"
        class="bg-white rounded-xl p-4 shadow-sm"
      >
        <div class="font-semibold">{{ doc.name }}</div>
        <div class="text-sm text-gray-500">
          {{ doc.hospital }} · {{ doc.title }}
        </div>

        <div class="text-xs text-blue-500 mt-1">
          擅长：{{ doc.specialty }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const doctors = [
  {
    id: 1,
    name: '张医生',
    hospital: '协和医院',
    title: '主任医师',
    specialty: '渐冻症'
  }
]
</script>