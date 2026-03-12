<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">生活实用模板</h2>

    <van-cell-group>
      <van-cell
        v-for="item in templates"
        :key="item.id"
        :title="item.name"
        is-link
        @click="downloadTemplate(item)"
      />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
const templates = [
  { id: 1, name: '请假条模板' },
  { id: 2, name: '残疾证申请模板' }
]

const downloadTemplate = (item: any) => console.log('下载模板', item)
</script>