<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <PostCard
        v-for="item in list"
        :key="item.id"
        :post="item"
        @comment="onComment"
        @preview-image="onPreviewImage"
      />
    </van-list>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PostCard from './PostCard.vue'
import request from '@/utils/request.ts'

const props = defineProps<{
  categoryId: number | null
  diseaseId: number | null
  type: string
  sort: string
}>()

const emit = defineEmits(['comment', 'preview-image'])

const list = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
let page = 1

// 获取动态数据
const fetchPosts = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/community/posts', {
      params: {
        category_id: props.categoryId,
        disease_id: props.diseaseId,
        type: props.type === 'all' ? undefined : props.type,
        sort: props.sort,
        page,
        limit: 10
      }
    })

    const records = res.data.data.records || []
    list.value.push(...records)
    finished.value = records.length < 10
    page++
  } catch (error) {
    console.error('获取动态失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置并重新加载
const resetAndReload = () => {
  page = 1
  list.value = []
  finished.value = false
  fetchPosts()
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  resetAndReload()
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

// 上拉加载更多
const onLoadMore = () => {
  fetchPosts()
}

// 处理评论事件
const onComment = (data: { post: any; newComment?: any; comments?: any[] }) => {
  console.log('接收到评论数据:', data.newComment || data.comments)
  emit('comment', data)
}

// 预览图片事件
const onPreviewImage = (url: string) => {
  emit('preview-image', url)
}

// 监听筛选条件变化
watch(
  () => [props.categoryId, props.diseaseId, props.type, props.sort],
  () => {
    resetAndReload()
  }
)
</script>