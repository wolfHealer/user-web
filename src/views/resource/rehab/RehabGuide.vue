<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">康复训练指南</h2>

    <!-- 疾病筛选 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterDisease" :options="diseases" />
      <van-dropdown-item v-model="filterStage" :options="stages" />
    </van-dropdown-menu>

    <!-- 训练列表 -->
    <div
      v-for="item in filteredTrainings"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4"
    >
      <div class="font-semibold">{{ item.title }}</div>

      <div class="text-sm text-gray-500 mt-1">
        类型：{{ item.type }} | 阶段：{{ item.stage }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ item.desc }}
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary" @click="viewDetails(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadGuide(item)">
          下载PDF版
        </van-button>
        <van-button size="small" plain @click="previewOnline(item)">
          在线预览
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const filterDisease = ref('all')
const filterStage = ref('all')

const diseases = [
  { text: '全部疾病', value: 'all' },
  { text: '渐冻症', value: 'als' },
  { text: '亨廷顿舞蹈症', value: 'huntington' }
]
const stages = [
  { text: '全部阶段', value: 'all' },
  { text: '早期', value: 'early' },
  { text: '中期', value: 'mid' },
  { text: '晚期', value: 'late' }
]

const trainings = ref([
  {
    id: 1,
    title: '渐冻症肢体康复训练',
    type: '肢体训练',
    stage: '早期',
    desc: '重点保护关节活动度，避免肌肉萎缩'
  }
])

const filteredTrainings = computed(() => {
  return trainings.value.filter(training => {
    const matchDisease = filterDisease.value === 'all' || training.disease === filterDisease.value
    const matchStage = filterStage.value === 'all' || training.stage === filterStage.value
    return matchDisease && matchStage
  })
})

const viewDetails = (item: any) => console.log('查看详情', item)
const downloadGuide = (item: any) => console.log('下载PDF版', item)
const previewOnline = (item: any) => console.log('在线预览', item)
</script>