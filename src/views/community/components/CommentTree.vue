<!-- <template>
  <div class="comment-tree">
    <div v-for="comment in comments" :key="comment.id" class="mb-3">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
          <van-icon name="user-o" size="16" color="#999" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-700">
            {{ comment.user_id }}
          </div>
          <div class="text-xs text-gray-500">{{ comment.created_at }}</div>
          <div class="text-gray-700 text-sm mt-1">{{ comment.content }}</div>
        </div>
      </div>

      递归渲染子评论 
      <div class="ml-10 mt-2">
<CommentTree
  v-if="comment.children && comment.children.length > 0"
  :comments="comment.children"
/>      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  comments: any[]
}>()
</script>

<style scoped>
.comment-tree {
  border-left: 2px solid #e5e7eb;
  padding-left: 10px;
}
</style> -->

<template>
  <div class="comment-tree">
    <div v-for="comment in comments" :key="comment.id" class="mb-3">
      <div class="flex items-start">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
          <van-icon name="user-o" size="16" color="#999" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-700">
            {{ comment.display_name }}
          </div>
          <div class="text-xs text-gray-500">{{ comment.created_at }}</div>
          <div class="text-gray-700 text-sm mt-1">{{ comment.content }}</div>
          <div class="text-blue-500 text-xs cursor-pointer mt-1" @click="replyTo(comment.id)">
            回复
          </div>
        </div>
      </div>

      <!-- 递归渲染子评论 -->
      <div class="ml-10 mt-2">
        <CommentTree
          v-if="comment.children && comment.children.length > 0"
          :comments="comment.children"
          @reply="onReply"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['reply'])
defineProps<{
  comments: any[]
}>()

const replyTo = (parentId: number) => {
  const content = prompt('请输入回复内容:')
  if (content) {
    emit('reply', parentId, content)
  }
}
</script>