<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">康复资源对接</h2>

    <!-- 康复机构名录 -->
    <van-cell-group>
      <van-cell
        v-for="item in institutions"
        :key="item.id"
        :title="item.name"
        :label="`${item.region} · ${item.contact}`"
        is-link
        @click="viewDetails(item)"
      />
    </van-cell-group>

    <!-- 康复器械指南 -->
    <div class="mt-4">
      <h3 class="font-semibold">康复器械指南</h3>
      <van-cell-group>
        <van-cell
          v-for="device in devices"
          :key="device.id"
          :title="device.name"
          :label="device.desc"
          is-link
          @click="downloadGuide(device)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
const institutions = [
  {
    id: 1,
    name: '某康复医院',
    region: '北京',
    contact: '010-xxxx-xxxx'
  }
]

const devices = [
  {
    id: 1,
    name: '轮椅',
    desc: '适用于行动不便患者'
  }
]

const viewDetails = (item: any) => console.log('查看详情', item)
const downloadGuide = (device: any) => console.log('下载指南', device)
</script>