<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">救助案例分享</h2>

    <div
      v-for="item in cases"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4 mb-3"
    >
      <div class="font-semibold">{{ item.title }}</div>
      <div class="text-sm text-gray-500 mt-1">
        疾病：{{ item.disease }} | 救助金额：{{ item.amount }}
      </div>
      <div class="text-sm mt-2">{{ item.summary }}</div>
      <div class="flex gap-2 mt-3">
        <van-button size="small" plain @click="viewCase(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadCase(item)">
          下载案例PDF
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cases = [
  {
    id: 1,
    title: '血友病患者成功申请救助案例',
    disease: '血友病',
    amount: '2万元',
    summary: '通过某公益基金申请，审核周期约30天'
  }
]

const viewCase = (item: any) => console.log('查看案例详情', item)
const downloadCase = (item: any) => console.log('下载案例PDF', item)
</script>