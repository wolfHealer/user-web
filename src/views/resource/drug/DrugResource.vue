<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-blue-600 shadow-sm p-4 w-full flex items-center text-white">
      <van-icon
        name="arrow-left"
        size="24"
        color="#FFFFFF"
        class="cursor-pointer mr-4"
        @click="goBack"
      />
      <h1 class="text-lg font-bold">用药信息平台</h1>
    </header>

    <!-- 内容区域 -->
    <main class="flex-1 overflow-y-auto">
      <!-- 功能模块 -->
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="罕见病药品名录">
          <DrugList />
        </van-tab>
        <van-tab title="正规购药渠道">
          <ChannelList />
        </van-tab>
        <van-tab title="赠药/援助项目">
          <DonationProject />
        </van-tab>
        <van-tab title="用药管理工具">
          <MedicationTool />
        </van-tab>
      </van-tabs>
    </main>

    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DrugList from './DrugList.vue'
import ChannelList from './ChannelList.vue'
import DonationProject from './DonationProject.vue'
import MedicationTool from './MedicationTool.vue'
import BottomNav from '@/components/BottomNav.vue' // 引入底部导航组件

const router = useRouter()
const activeTab = ref(0)

// 返回上一级页面
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb; /* 浅灰色背景 */
}

.sticky.top-0 {
  background-color: #1E90FF; /* 深天蓝色顶部栏 */
  color: white;
}

.bg-white {
  background-color: #ffffff; /* 白色卡片背景 */
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.rounded-lg {
  border-radius: 10px;
}

.cursor-pointer:hover {
  opacity: 0.9;
}
</style>