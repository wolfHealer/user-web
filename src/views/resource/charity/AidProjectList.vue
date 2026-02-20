<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">公益救助项目</h2>

    <div
      v-for="item in list"
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
        机构：{{ item.org }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ item.desc }}
      </div>

      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary" @click="apply(item)">
          申请救助
        </van-button>
        <van-button size="small" plain @click="detail(item)">
          查看详情
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const list = [
  {
    id: 1,
    title: '渐冻症专项援助计划',
    org: '某公益基金会',
    desc: '提供最高3万元医疗补助',
    status: 'open'
  }
]

const apply = (item: any) => {
  console.log('apply', item)
}

const detail = (item: any) => {
  console.log('detail', item)
}
</script>