<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部筛选栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="messageType"
          :options="messageTypes"
          @change="filterMessages"
        />
      </van-dropdown-menu>
    </header>

    <!-- 消息列表 -->
    <section class="p-4">
      <div
        v-for="(message, index) in filteredMessages"
        :key="index"
        class="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer"
        :class="{ 'font-bold': !message.isRead }"
        @click="readMessage(message)"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="text-sm">{{ message.title }}</div>
            <div class="text-xs text-gray-500 mt-1">
              来自：{{ message.sender }} · {{ message.time }}
            </div>
          </div>
          <van-tag
            :type="getMessageTagType(message.type)"
            :size="tagSize"
          >
            {{ getMessageTypeName(message.type) }}
          </van-tag>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 消息类型选项
const messageTypes = ref([
  { text: '全部', value: 'all' },
  { text: '评论回复', value: 'comment' },
  { text: '专家答疑', value: 'qa' },
  { text: '资源更新', value: 'resource' }
])

// 当前筛选类型
const messageType = ref('all')

// 消息数据
const messages = ref([
  {
    id: 1,
    title: '您的评论收到了新回复',
    sender: '用户A',
    time: '2小时前',
    type: 'comment',
    isRead: false,
    link: '/post/123'
  },
  {
    id: 2,
    title: '专家已回复您的问题',
    sender: '张医生',
    time: '1天前',
    type: 'qa',
    isRead: true,
    link: '/qa/question/456'
  },
  {
    id: 3,
    title: '您关注的资源已更新',
    sender: '系统通知',
    time: '3天前',
    type: 'resource',
    isRead: false,
    link: '/resources/detail/789'
  }
])

// 筛选后的消息
const filteredMessages = computed(() => {
  if (messageType.value === 'all') return messages.value
  return messages.value.filter((msg) => msg.type === messageType.value)
})

// 获取消息标签类型
const getMessageTagType = (type: string) => {
  switch (type) {
    case 'comment':
      return 'primary'
    case 'qa':
      return 'success'
    case 'resource':
      return 'warning'
    default:
      return 'default'
  }
}

// 获取消息类型名称
const getMessageTypeName = (type: string) => {
  switch (type) {
    case 'comment':
      return '评论回复'
    case 'qa':
      return '专家答疑'
    case 'resource':
      return '资源更新'
    default:
      return '未知'
  }
}

// 筛选消息
const filterMessages = () => {
  console.log('筛选类型:', messageType.value)
}

// 阅读消息并跳转
const readMessage = (message: any) => {
  message.isRead = true
  router.push(message.link)
}


// 定义 tag 尺寸类型
type TagSize = 'large' | 'medium' | 'small';

// 使用 ref 定义尺寸变量
const tagSize = ref<TagSize>('small');
</script>

<style scoped>
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.cursor-pointer {
  cursor: pointer;
}
.font-bold {
  font-weight: bold;
}
</style>