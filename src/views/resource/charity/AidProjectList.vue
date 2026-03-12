=<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">公益救助项目</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterType" :options="types" />
      <van-dropdown-item v-model="filterDisease" :options="diseases" />
      <van-dropdown-item v-model="filterAmount" :options="amounts" />
      <van-dropdown-item v-model="filterDifficulty" :options="difficulties" />
    </van-dropdown-menu>

    <!-- 项目列表 -->
    <div
      v-for="item in filteredList"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4"
    >
      <div class="flex justify-between items-center">
        <div class="font-semibold">{{ item.title }}</div>
        <van-tag :type="item.status === 'open' ? 'success' : 'default'">
          {{ item.status === 'open' ? '可申请' : '已结束' }}
        </van-tag>
      </div>

      <div class="text-sm text-gray-500 mt-1">
        机构：{{ item.org }} | 金额：{{ item.amount }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ item.desc }}
      </div>

      <!-- 申请按钮 -->
      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary" @click="apply(item)">
          申请救助
        </van-button>
        <van-button size="small" plain @click="detail(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadDocs(item)">
          下载资料包
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 筛选条件
const filterType = ref('all')
const filterDisease = ref('all')
const filterAmount = ref('all')
const filterDifficulty = ref('all')

// 筛选项
const types = [
  { text: '全部类型', value: 'all' },
  { text: '医疗费用救助', value: 'medical' },
  { text: '生活补助', value: 'living' }
]
const diseases = [
  { text: '全部疾病', value: 'all' },
  { text: '血友病', value: 'hemophilia' },
  { text: '渐冻症', value: 'als' }
]
const amounts = [
  { text: '全部金额', value: 'all' },
  { text: '<1万', value: 'lt1w' },
  { text: '1-5万', value: '1w-5w' }
]
const difficulties = [
  { text: '全部难度', value: 'all' },
  { text: '简单', value: 'easy' },
  { text: '复杂', value: 'hard' }
]

// 数据列表
const list = ref([
  {
    id: 1,
    title: '渐冻症专项援助计划',
    org: '某公益基金会',
    desc: '提供最高3万元医疗补助',
    status: 'open',
    type: 'medical',
    disease: 'als',
    amount: '1-3万',
    difficulty: 'easy'
  }
])

// 筛选后的列表
const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchType = filterType.value === 'all' || item.type === filterType.value
    const matchDisease = filterDisease.value === 'all' || item.disease === filterDisease.value
    const matchAmount = filterAmount.value === 'all' || item.amount.includes(filterAmount.value)
    const matchDifficulty = filterDifficulty.value === 'all' || item.difficulty === filterDifficulty.value
    return matchType && matchDisease && matchAmount && matchDifficulty
  })
})

// 方法
const apply = (item: any) => console.log('申请救助', item)
const detail = (item: any) => console.log('查看详情', item)
const downloadDocs = (item: any) => console.log('下载资料包', item)
</script>