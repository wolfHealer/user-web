<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">罕见病药物库</h2>

    <van-search v-model="keyword" placeholder="搜索药物名称" />

    <div
      v-for="drug in list"
      :key="drug.id"
      class="bg-white rounded-xl p-4 shadow-sm"
    >
      <div class="flex justify-between">
        <div class="font-semibold">{{ drug.name }}</div>
        <van-tag type="success">已审核</van-tag>
      </div>

      <div class="text-sm text-gray-500 mt-1">
        适应症：{{ drug.indication }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ drug.desc }}
      </div>

      <van-button
        size="small"
        class="mt-3"
        type="primary"
        @click="view(drug)"
      >
        查看详情
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const list = [
  {
    id: 1,
    name: '依达拉奉',
    indication: 'ALS',
    desc: '用于延缓神经退行性疾病进展'
  }
]

const view = (drug: any) => console.log(drug)
</script>