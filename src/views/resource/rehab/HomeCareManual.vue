<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">居家护理手册</h2>

    <!-- 护理内容 -->
    <van-collapse v-model="active">
      <van-collapse-item
        v-for="item in manuals"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div class="text-sm leading-relaxed">
          {{ item.content }}
        </div>
      </van-collapse-item>
    </van-collapse>

    <!-- 工具下载 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadChecklist">
        下载护理清单
      </van-button>
      <van-button type="primary" class="ml-2" @click="downloadRecordForm">
        下载观察记录表
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref([])

const manuals = [
  {
    id: 1,
    title: '饮食指导',
    content: '代谢类罕见病需严格控制蛋白质摄入...'
  },
  {
    id: 2,
    title: '皮肤护理',
    content: '每日清洁皮肤，预防压疮...'
  }
]

const downloadChecklist = () => console.log('下载护理清单')
const downloadRecordForm = () => console.log('下载观察记录表')
</script>