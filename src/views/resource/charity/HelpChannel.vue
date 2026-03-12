<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">求助通道指引</h2>

    <van-cell-group>
      <van-cell
        v-for="item in channels"
        :key="item.id"
        :title="item.name"
        :label="item.desc"
        is-link
        @click="contact(item)"
      />
    </van-cell-group>

    <!-- 模板下载 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadTemplate">
        下载求助模板
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const channels = [
  {
    id: 1,
    name: '24小时公益求助热线',
    desc: '响应时间：即时'
  }
]

const contact = (item: any) => console.log('联系求助渠道', item)
const downloadTemplate = () => console.log('下载求助模板')
</script>