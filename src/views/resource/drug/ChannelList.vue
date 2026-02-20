<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">用药获取渠道</h2>

    <van-notice-bar
      left-icon="warning-o"
      text="请警惕非正规渠道购药风险"
    />

    <div
      v-for="item in channels"
      :key="item.id"
      class="bg-white rounded-xl p-4 shadow-sm"
    >
      <div class="font-semibold">{{ item.name }}</div>

      <div class="text-sm text-gray-500 mt-1">
        类型：{{ item.type }}
      </div>

      <div class="text-sm mt-2">{{ item.desc }}</div>

      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary">联系渠道</van-button>
        <van-button size="small" plain>复制信息</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const channels = [
  {
    id: 1,
    name: '协和医院药房',
    type: '国内医院',
    desc: '需专家处方购买'
  }
]
</script>