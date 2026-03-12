<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部标题栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <van-icon
        name="arrow-left"
        size="24"
        color="#000000"
        class="cursor-pointer"
        @click="goBack"
      />
      <h2 class="text-lg font-bold">渠道详情</h2>
      <div class="w-6"></div>
    </header>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-8" type="spinner">
      加载中...
    </van-loading>

    <!-- 内容区域 -->
    <template v-else-if="detail">
      <!-- 渠道基本信息 -->
      <div class="p-4 bg-white mt-3">
        <h2 class="text-xl font-bold">{{ detail.name }}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <van-tag type="primary">{{ detail.type }}</van-tag>
          <van-tag :type="detail.verified ? 'success' : 'default'">
            {{ detail.verified ? '已认证' : '未认证' }}
          </van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-3">
          <div class="flex justify-between py-2 border-b">
            <span>地区</span>
            <span class="text-gray-700">{{ detail.region || '暂无' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span>配送方式</span>
            <span class="text-gray-700">{{ detail.delivery || '暂无' }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span>地址</span>
            <span class="text-gray-700">{{ detail.address || '暂无' }}</span>
          </div>
        </div>
      </div>

      <!-- 渠道描述 -->
      <div class="p-4 bg-white mt-3" v-if="detail.desc">
        <h3 class="font-semibold mb-2">渠道说明</h3>
        <div class="text-sm text-gray-700 leading-relaxed">
          {{ detail.desc }}
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="p-4 bg-white mt-3">
        <h3 class="font-semibold mb-2">联系方式</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <van-icon name="phone" size="20" color="#1989fa" />
              <span class="text-sm text-gray-600">电话</span>
            </div>
            <span class="text-sm font-medium">{{ detail.phone || '暂无' }}</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <van-icon name="wechat" size="20" color="#07c160" />
              <span class="text-sm text-gray-600">微信</span>
            </div>
            <span class="text-sm font-medium">{{ detail.wechat || '暂无' }}</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <van-icon name="envelop" size="20" color="#1989fa" />
              <span class="text-sm text-gray-600">邮箱</span>
            </div>
            <span class="text-sm font-medium">{{ detail.email || '暂无' }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
        <van-button 
          type="primary" 
          block 
          @click="copyContact"
          class="mb-2"
        >
          复制联系方式
        </van-button>
        <van-button 
          plain 
          block 
          @click="goBack"
        >
          返回列表
        </van-button>
      </div>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="渠道不存在或已下架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import { showSuccessToast, showToast } from 'vant'

// 类型定义
interface ChannelDetail {
  id: number
  name: string
  type: string
  region?: string
  delivery?: string
  address?: string
  desc?: string
  phone?: string
  wechat?: string
  email?: string
  verified?: boolean
}

// 响应式数据
const detail = ref<ChannelDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/drug/channel/detail/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载渠道详情失败:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// 复制联系方式
const copyContact = () => {
  if (!detail.value) return
  
  const text = `渠道名称：${detail.value.name}
电话：${detail.value.phone || '暂无'}
微信：${detail.value.wechat || '暂无'}
邮箱：${detail.value.email || '暂无'}
地址：${detail.value.address || '暂无'}`
  
  navigator.clipboard.writeText(text).then(() => {
    showSuccessToast('联系方式已复制')
  }).catch(() => {
    showToast('复制失败，请手动复制')
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb;
}

.sticky.top-0 {
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>