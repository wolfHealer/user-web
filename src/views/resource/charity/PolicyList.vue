<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">政策支持</h2>

    <van-dropdown-menu>
      <van-dropdown-item v-model="region" :options="regions" />
    </van-dropdown-menu>

    <van-cell-group class="mt-3">
      <van-cell
        v-for="item in list"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const region = ref('all')

const regions = [
  { text: '全国', value: 'all' },
  { text: '北京', value: 'bj' },
  { text: '上海', value: 'sh' }
]

const list = ref([
  {
    id: 1,
    title: '罕见病医保报销政策解读',
    region: '全国',
    date: '2024-01'
  }
])

const open = (item: any) => {
  console.log(item)
}
</script>