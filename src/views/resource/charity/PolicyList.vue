=<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">医保政策解读</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="region" :options="regions" />
    </van-dropdown-menu>

    <!-- 政策列表 -->
    <van-cell-group class="mt-3">
      <van-cell
        v-for="item in filteredPolicies"
        :key="item.id"
        :title="item.title"
        :label="item.region + ' · ' + item.date"
        is-link
        @click="open(item)"
      >
        <template #right-icon>
          <van-tag type="primary">政策</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 下载资料 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadMaterials">
        下载医保报销流程图解
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const region = ref('all')

const regions = [
  { text: '全国', value: 'all' },
  { text: '北京', value: 'bj' },
  { text: '上海', value: 'sh' }
]

const policies = ref([
  {
    id: 1,
    title: '罕见病医保报销政策解读',
    region: '全国',
    date: '2024-01',
    content: '戈谢病在北京市医保报销比例为70%，年度最高报销50万'
  }
])

const filteredPolicies = computed(() => {
  return region.value === 'all'
    ? policies.value
    : policies.value.filter(p => p.region === region.value)
})

const open = (item: any) => console.log('查看政策详情', item)
const downloadMaterials = () => console.log('下载资料')
</script>