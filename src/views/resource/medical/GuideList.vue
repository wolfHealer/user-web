<template>
  <div class="p-4">
    <!-- 筛选 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="disease" :options="diseaseOptions" />
    </van-dropdown-menu>

    <!-- 列表 -->
    <van-cell-group class="mt-3">
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :label="item.org + ' · ' + item.year"
        is-link
        @click="open(item)"
      >
        <template #right-icon>
          <van-tag type="primary">官方</van-tag>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const disease = ref(0)

const diseaseOptions = [
  { text: '全部疾病', value: 0 },
  { text: '渐冻症', value: 1 }
]

const list = ref([
  {
    id: 1,
    title: 'ALS诊疗指南（2024）',
    org: '中华医学会',
    year: '2024'
  }
])

const open = (item: any) => {
  console.log(item)
}
</script>