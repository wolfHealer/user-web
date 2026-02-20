<template>
  <div class="p-4">
    <van-search v-model="keyword" placeholder="搜索检查项目" />

    <van-cell-group>
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.name"
        :label="item.desc"
        is-link
      />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const list = ref([
  { id: 1, name: '基因检测指南', desc: '检测流程说明' }
])
</script>