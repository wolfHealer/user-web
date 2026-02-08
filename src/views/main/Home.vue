<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部搜索栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <van-search
        v-model="searchValue"
        placeholder="搜索病种 / 症状"
        shape="round"
        background="#f9f9f9"
        class="flex-1"
      />
      <!-- 消息提醒入口 -->
      <div class="relative ml-4">
        <van-icon
          name="bell"
          size="24"
          class="cursor-pointer"
          @click="goToMessages"
        />
        <!-- 未读消息红点 -->
        <div
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </div>
      </div>
    </header>

    <!-- 核心功能入口 -->
    <section class="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="(item, index) in coreFeatures"
        :key="index"
        class="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
        @click="handleFeatureClick(item.path)"
      >
        <van-icon :name="item.icon" size="32" color="#409EFF" />
        <span class="mt-2 text-sm text-gray-700">{{ item.title }}</span>
      </div>
    </section>

    <!-- 最新动态 -->
    <section class="flex-1 overflow-y-auto p-4">
      <div
        v-for="(post, index) in posts"
        :key="index"
        class="bg-white rounded-lg shadow-sm mb-4 p-4"
      >
        <div class="flex items-start">
          <img
            :src="post.avatar"
            alt="Avatar"
            class="w-10 h-10 rounded-full mr-3"
            loading="lazy"
          />
          <div class="flex-1">
            <div class="font-semibold text-sm">{{ post.author }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ post.time }}</div>
            <div class="mt-2 text-gray-700 text-sm">{{ post.content }}</div>
          </div>
        </div>
      </div>
      <!-- 加载更多提示 -->
      <div v-if="loading" class="text-center text-gray-500 py-4">加载中...</div>
    </section>

    <!-- 底部基础导航 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 搜索值
const searchValue = ref('')

// 核心功能入口数据
const coreFeatures = ref([
  { title: '知识库', icon: 'notes-o', path: '/knowledge' },
  { title: '病友交流', icon: 'friends-o', path: '/community' },
  { title: '专家答疑', icon: 'question-o', path: '/qa' },
  { title: '资源下载', icon: 'down', path: '/resources' }
])

// 底部导航数据
const bottomNavs = ref([
  { title: '首页', icon: 'home-o', path: '/' },
  { title: '我的', icon: 'user-o', path: '/profile' }
])

// 动态内容模拟数据
const posts = ref([
  {
    author: '用户A',
    avatar: 'https://example.com/avatar1.jpg',
    time: '2小时前',
    content: '分享一个关于罕见病的科普文章...'
  },
  {
    author: '用户B',
    avatar: 'https://example.com/avatar2.jpg',
    time: '5小时前',
    content: '求助：有没有治疗XXX的方法？'
  }
])

// 加载状态
const loading = ref(false)

// 处理核心功能入口点击事件
const handleFeatureClick = (path: string) => {
  router.push(path)
}

// 处理底部导航点击事件
const handleNavClick = (path: string) => {
  router.push(path)
}

// 模拟下拉刷新
const onRefresh = () => {
  loading.value = true
  setTimeout(() => {
    posts.value.unshift({
      author: '新用户',
      avatar: 'https://example.com/new-avatar.jpg',
      time: '刚刚',
      content: '最新动态内容...'
    })
    loading.value = false
  }, 1000)
}

// 模拟上拉加载更多
const onLoadMore = () => {
  loading.value = true
  setTimeout(() => {
    posts.value.push({
      author: '更多用户',
      avatar: 'https://example.com/more-avatar.jpg',
      time: '稍早',
      content: '更多动态内容...'
    })
    loading.value = false
  }, 1000)
}


// 未读消息数量
const unreadCount = ref(5)

// 跳转到消息页面
const goToMessages = () => {
  router.push('/messages')
}
</script>

<style scoped>
/* 移动端优先设计 */
.text-sm {
  font-size: 16px;
}
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.bg-blue-light {
  background-color: #e0f2fe;
}
.bg-green-light {
  background-color: #e8f5e8;
}

/* 响应式适配 */
@media (min-width: 640px) {
  .grid.grid-cols-2 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>