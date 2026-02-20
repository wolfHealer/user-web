<!-- src/components/BottomNav.vue -->
<template>
  <footer class="bg-white border-t border-gray-200 p-2 flex justify-around">
    <div
      v-for="(nav, index) in bottomNavs"
      :key="index"
      class="flex flex-col items-center text-xs text-gray-600 cursor-pointer"
      @click="handleNavClick(nav.path)"
    >
      <van-icon :name="nav.icon" size="20" />
      <span class="mt-1">{{ nav.title }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 底部导航数据
const bottomNavs = [
  { title: '首页', icon: 'home-o', path: '/' },
  { title: '我的', icon: 'user-o', path: '/profile' }
]

// 处理导航点击事件
const handleNavClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.border-t {
  border-top: 1px solid #e5e7eb;
}

.text-xs {
  font-size: 12px;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>