<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 返回按钮 -->
    <van-icon
      name="arrow-left"
      size="24"
      color="#000000"
      class="cursor-pointer mb-4"
      @click="goBack"
    />

    <!-- 帖子内容 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="font-semibold text-lg text-gray-800">{{ post.title }}</div>
      <div class="text-gray-700 text-sm mt-2">{{ post.content }}</div>
    </div>

    <!-- 评论区域 -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <h2 class="text-lg font-bold mb-4">评论</h2>

      <!-- 评论树 -->
      <CommentTree :comments="commentTree" @reply="onReply" />

      <!-- 发表评论输入框 -->
      <div class="mt-4">
        <textarea
          v-model="newComment"
          placeholder="请输入评论内容..."
          class="w-full p-2 border border-gray-300 rounded resize-none"
          rows="3"
        ></textarea>
        <div class="flex justify-end mt-2">
          <van-button size="small" type="primary" @click="submitComment">提交</van-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import CommentTree from './components/CommentTree.vue'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 帖子数据
const post = ref<any>({})
const commentTree = ref<any[]>([])
const newComment = ref('')

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    const res = await request.get(`/api/community/posts/${route.params.id}`)
    post.value = res.data.data
  } catch (error) {
    console.error('获取帖子详情失败:', error)
  }
}

// 获取评论树
const fetchComments = async () => {
  try {
    const res = await request.get(`/api/community/posts/${route.params.id}/comments`)
    const comments = res.data.data || []
    commentTree.value = buildCommentTree(comments)
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 构建评论树
const buildCommentTree = (comments: any[]) => {
  const map: Record<number, any> = {}
  const tree: any[] = []

  comments.forEach(comment => {
    map[comment.id] = { ...comment, children: comment.children || [] }
  })

  comments.forEach(comment => {
    if (comment.parent_id === 0) {
      tree.push(map[comment.id])
    } else {
      const parent = map[comment.parent_id]
      if (parent) {
        parent.children.push(map[comment.id])
      }
    }
  })

  return tree
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('评论内容不能为空')
    return
  }

  const userId = userStore.userInfo?.user_id
  if (!userId) {
    alert('用户未登录，请先登录！')
    return
  }

  try {
    const res = await request.post(`/api/community/posts/${route.params.id}/comments`, {
      content: newComment.value,
      user_id: userId,
      target_type: 'post',
      parent_id: 0 // 主评论
    })

    console.log('评论创建成功:', res.data)
    newComment.value = ''
    fetchComments() // 重新加载评论
  } catch (error) {
    console.error('评论创建失败:', error)
  }
}

// 回复评论
const onReply = async (parentId: number, content: string) => {
  const userId = userStore.userInfo?.user_id
  if (!userId) {
    alert('用户未登录，请先登录！')
    return
  }

  try {
    const res = await request.post(`/api/community/posts/${route.params.id}/comments`, {
      content,
      user_id: userId,
      target_type: 'post',
      parent_id: parentId // 回复评论
    })

    console.log('回复评论成功:', res.data)
    fetchComments() // 重新加载评论
  } catch (error) {
    console.error('回复评论失败:', error)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 页面加载时获取数据
onMounted(() => {
  fetchPostDetail()
  fetchComments()
})
</script>