<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部筛选栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full">
      <div class="flex justify-between items-center">
        <van-dropdown-menu>
          <van-dropdown-item v-model="currentPartition" :options="partitions" @change="filterByPartition" />
          <van-dropdown-item v-model="sortType" :options="sortOptions" @change="sortByType" />
        </van-dropdown-menu>
      </div>
    </header>

    <!-- 动态列表 -->
    <section class="flex-1 overflow-y-auto p-4">
      <div
        v-for="(post, index) in posts"
        :key="index"
        class="bg-white rounded-lg shadow-sm mb-4 p-4"
      >
        <!-- 用户信息 -->
        <div class="flex items-center mb-3">
          <img
            :src="post.avatar || defaultAvatar"
            alt="头像"
            class="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div class="font-semibold text-sm">{{ post.nickname }}</div>
            <div class="text-xs text-gray-500">{{ post.time }}</div>
          </div>
        </div>

        <!-- 动态内容 -->
        <div class="text-gray-700 text-sm mb-3">{{ post.content }}</div>

        <!-- 图片展示 -->
        <div v-if="post.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
          <img
            v-for="(img, idx) in post.images"
            :key="idx"
            :src="img"
            alt="图片"
            class="rounded cursor-pointer"
            @click="previewImage(img)"
          />
        </div>

        <!-- 互动按钮 -->
        <div class="flex justify-between items-center text-gray-500 text-sm">
          <div class="flex space-x-4">
            <div
              class="flex items-center cursor-pointer"
              :class="{ 'text-red-500': post.isLiked }"
              @click="toggleLike(post)"
            >
              <van-icon name="like" size="16" />
              <span class="ml-1">{{ post.likeCount }}</span>
            </div>
            <div class="flex items-center cursor-pointer" @click="toggleComment(post)">
              <van-icon name="chat" size="16" />
              <span class="ml-1">{{ post.commentCount }}</span>
            </div>
          </div>
          <van-icon name="warning" size="16" @click="reportPost(post)" />
        </div>

        <!-- 评论区 -->
        <div v-if="post.showComments" class="mt-3 border-t pt-3">
          <div
            v-for="(comment, idx) in post.comments"
            :key="idx"
            class="flex items-start mb-2"
          >
            <img
              :src="comment.avatar || defaultAvatar"
              alt="头像"
              class="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <div class="text-xs font-semibold">{{ comment.nickname }}</div>
              <div class="text-xs text-gray-600">{{ comment.content }}</div>
            </div>
          </div>
          <div class="flex items-center mt-2">
            <input
              v-model="post.newComment"
              type="text"
              placeholder="输入评论..."
              class="flex-1 border rounded-l px-2 py-1 text-sm"
              @keyup.enter="addComment(post)"
            />
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded-r text-sm"
              @click="addComment(post)"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 发布按钮 -->
    <footer class="fixed bottom-4 right-4">
      <van-button
        type="primary"
        round
        icon="edit"
        size="large"
        @click="showPublishModal = true"
      />
    </footer>

    <!-- 发布弹窗 -->
    <van-popup v-model:show="showPublishModal" position="bottom" :style="{ height: '40%' }">
      <div class="p-4">
        <textarea
          v-model="newPostContent"
          placeholder="分享你的故事..."
          class="w-full h-32 border rounded p-2 text-sm"
        ></textarea>
        <div class="flex justify-between mt-4">
          <van-button @click="showPublishModal = false">取消</van-button>
          <van-button type="primary" @click="publishPost">发布</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 默认头像
const defaultAvatar = 'https://example.com/default-avatar.png'

// 分区选项
const partitions = ref([
  { text: '全部动态', value: 'all' },
  { text: '渐冻症交流区', value: 'als' },
  { text: 'SMA交流区', value: 'sma' },
  { text: '家属互助', value: 'family' },
  { text: '心理疏导', value: 'psychology' }
])

// 排序选项
const sortOptions = ref([
  { text: '最新', value: 'latest' },
  { text: '最热', value: 'hot' }
])

// 当前分区和排序
const currentPartition = ref('all')
const sortType = ref('latest')

// 动态数据
const posts = ref([
  {
    id: 1,
    nickname: '用户A',
    avatar: '',
    time: '2小时前',
    content: '今天去医院复查，医生说恢复得不错！',
    images: [],
    likeCount: 12,
    commentCount: 5,
    isLiked: false,
    showComments: false,
    comments: [],
    newComment: ''
  }
])

// 发布弹窗状态
const showPublishModal = ref(false)
const newPostContent = ref('')

// 筛选分区
const filterByPartition = () => {
  console.log('筛选分区:', currentPartition.value)
}

// 排序
const sortByType = () => {
  console.log('排序方式:', sortType.value)
}

// 点赞/取消点赞
const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1
}

// 展开/收起评论
const toggleComment = (post: any) => {
  post.showComments = !post.showComments
}

// 添加评论
const addComment = (post: any) => {
  if (post.newComment.trim()) {
    post.comments.push({
      nickname: '我',
      avatar: defaultAvatar,
      content: post.newComment
    })
    post.commentCount++
    post.newComment = ''
  }
}

// 发布动态
const publishPost = () => {
  if (newPostContent.value.trim()) {
    posts.value.unshift({
      id: Date.now(),
      nickname: '我',
      avatar: defaultAvatar,
      time: '刚刚',
      content: newPostContent.value,
      images: [],
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      showComments: false,
      comments: [],
      newComment: ''
    })
    newPostContent.value = ''
    showPublishModal.value = false
  }
}

// 举报动态
const reportPost = (post: any) => {
  alert(`举报动态 ID: ${post.id}`)
}

// 预览图片
const previewImage = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.text-sm {
  font-size: 16px;
}
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>