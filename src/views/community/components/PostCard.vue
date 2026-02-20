<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-4 transition-colors hover:bg-blue-50 cursor-pointer">
    <!-- 用户信息 -->
    <div class="flex items-center mb-3">
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
        <van-icon name="user-o" size="20" color="#999" />
      </div>
      <div>
        <div class="font-semibold text-sm text-gray-700">
          {{ post.display_name || '病友' + post.user_id }}
        </div>
        <div class="text-xs text-gray-500">{{ post.created_at }}</div>
      </div>
    </div>

    <!-- 动态内容 -->
    <div class="text-gray-700 text-sm mb-3 leading-relaxed">
      {{ post.content }}
    </div>

    <!-- 图片展示 -->
    <div v-if="post.images?.length" class="grid grid-cols-3 gap-2 mb-3">
      <img
        v-for="(img, i) in post.images"
        :key="i"
        :src="img"
        alt="动态图片"
        class="rounded cursor-pointer object-cover aspect-square"
        @click="$emit('preview-image', img)"
      />
    </div>

    <!-- 互动按钮 -->
    <div class="flex justify-between items-center text-gray-500 text-sm">
      <div class="flex space-x-4">
        <div
          class="flex items-center cursor-pointer"
          :class="{ 'text-red-500': post.is_liked }"
          @click="onLike"
        >
          <van-icon name="like" size="16" />
          <span class="ml-1">{{ post.like_count }}</span>
        </div>
        <div class="flex items-center cursor-pointer" @click="toggleCommentInput">
          <van-icon name="chat" size="16" />
          <span class="ml-1">{{ post.comment_count }}</span>
        </div>
      </div>
      <div class="text-red-500 cursor-pointer" @click="onReport">举报</div>
    </div>

    <!-- 评论输入区域 -->
    <div v-if="showCommentInput" class="mt-3">
      <textarea
        v-model="newComment"
        placeholder="请输入评论内容..."
        class="w-full p-2 border border-gray-300 rounded resize-none"
        rows="3"
      ></textarea>
      <div class="flex justify-end mt-2">
        <van-button size="small" type="primary" @click="onCreateComment">提交</van-button>
        <van-button size="small" class="ml-2" @click="toggleCommentInput">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '@/utils/request.ts'

const props = defineProps<{ post: any }>()
const emit = defineEmits(['preview-image', 'comment'])

// 控制评论输入框显示
const showCommentInput = ref(false)
const newComment = ref('')

// 点赞事件
const onLike = async () => {
  try {
    const res = await request.post(`/api/community/posts/${props.post.id}/like`)
    console.log('点赞成功:', res.data)
    props.post.is_liked = !props.post.is_liked
    props.post.like_count += props.post.is_liked ? 1 : -1
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 切换评论输入框显示
const toggleCommentInput = () => {
  showCommentInput.value = !showCommentInput.value
  newComment.value = '' // 清空输入框
}

// 创建评论事件
const onCreateComment = async () => {
  if (!newComment.value.trim()) {
    alert('评论内容不能为空')
    return
  }

  try {
    const res = await request.post(`/api/community/posts/${props.post.id}/comments`, {
      content: newComment.value,
      user_id: 123, // 可从全局状态或 token 中获取
      target_type: 'post',
    })

    console.log('评论创建成功:', res.data)
    props.post.comment_count += 1 // 更新评论数
    newComment.value = '' // 清空输入框
    showCommentInput.value = false // 隐藏输入框

    // 触发父组件事件，传递新评论数据
    emit('comment', { post: props.post, newComment: res.data.data })
  } catch (error) {
    console.error('评论创建失败:', error)
  }
}

// 举报事件
const onReport = () => {
  alert('已提交举报')
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
.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
.hover\:bg-blue-50:hover {
  background-color: #e0f2fe;
}
.object-cover {
  object-fit: cover;
}
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>