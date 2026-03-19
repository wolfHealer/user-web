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
      <h2 class="text-lg font-bold">求助渠道详情</h2>
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
          <van-tag :type="getChannelTypeTag(detail.type)">
            {{ getChannelTypeLabel(detail.type) }}
          </van-tag>
          <van-tag :type="detail.available ? 'success' : 'default'">
            {{ detail.available ? '可用' : '暂不可用' }}
          </van-tag>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="p-4 bg-white mt-3">
        <h3 class="font-semibold mb-2">联系方式</h3>
        <div class="text-sm text-gray-700">
          <div class="flex items-center gap-2 py-2 border-b">
            <van-icon name="phone" v-if="detail.type === 'phone'" />
            <van-icon name="chat" v-else-if="detail.type === 'chat'" />
            <van-icon name="envelop" v-else-if="detail.type === 'email'" />
            <van-icon name="location" v-else-if="detail.type === 'offline'" />
            <span>{{ detail.contactValue }}</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-2 mt-3">
          <van-button 
            v-if="detail.type === 'phone'"
            size="small" 
            type="primary" 
            block 
            @click="makeCall"
          >
            立即拨打
          </van-button>
          <van-button 
            v-if="detail.type === 'chat'"
            size="small" 
            type="primary" 
            block 
            @click="openChat"
          >
            在线咨询
          </van-button>
          <van-button 
            v-if="detail.type === 'email'"
            size="small" 
            type="primary" 
            block 
            @click="sendEmail"
          >
            发送邮件
          </van-button>
          <van-button 
            v-if="detail.type === 'offline'"
            size="small" 
            type="primary" 
            block 
            @click="openNavigation"
          >
            导航前往
          </van-button>
        </div>
      </div>

      <!-- 服务时间 -->
      <div class="p-4 bg-white mt-3" v-if="detail.serviceTime">
        <h3 class="font-semibold mb-2">服务时间</h3>
        <div class="text-sm text-gray-700">
          <van-icon name="clock" class="mr-1" />
          {{ detail.serviceTime }}
        </div>
      </div>

      <!-- 渠道说明 -->
      <div class="p-4 bg-white mt-3" v-if="detail.desc">
        <h3 class="font-semibold mb-2">渠道说明</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.desc }}
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="p-4 bg-white mt-3" v-if="detail.instructions">
        <h3 class="font-semibold mb-2">使用说明</h3>
        <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ detail.instructions }}
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="p-4 bg-white mt-3" v-if="detail.notes">
        <h3 class="font-semibold mb-2 text-orange-600">注意事项</h3>
        <div class="text-sm text-orange-700 leading-relaxed whitespace-pre-line">
          {{ detail.notes }}
        </div>
      </div>

      <!-- 相关资源 -->
      <div class="p-4 bg-white mt-3" v-if="detail.resources && detail.resources.length > 0">
        <h3 class="font-semibold mb-2">相关资源</h3>
        <div class="space-y-2">
          <van-button 
            v-for="(resource, index) in detail.resources"
            :key="index"
            size="small" 
            plain 
            block 
            @click="downloadResource(resource)"
          >
            {{ resource.name }}
          </van-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="p-4 bg-white mt-3">
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
import { showToast, showDialog } from 'vant'
import request from '@/utils/request'

// 类型定义
interface Resource {
  name: string
  url: string
  type: string
}

interface ChannelDetail {
  id: number
  name: string
  desc: string
  type: string
  contactValue: string
  serviceTime: string
  available: boolean
  instructions?: string
  notes?: string
  resources?: Resource[]
}

// 响应式数据
const detail = ref<ChannelDetail | null>(null)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

// 获取渠道类型标签
const getChannelTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    phone: 'success',
    chat: 'primary',
    email: 'warning',
    offline: 'default'
  }
  return tagMap[type] || 'default'
}

// 获取渠道类型标签文字
const getChannelTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    phone: '电话',
    chat: '在线',
    email: '邮件',
    offline: '线下'
  }
  return labelMap[type] || '其他'
}

// 加载详情
const loadDetail = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const res = await request.get(`/api/resource/charity/channels/detail/${id}`)
    detail.value = res.data.data || res.data
  } catch (error) {
    console.error('加载渠道详情失败:', error)
    detail.value = null
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 拨打电话
const makeCall = () => {
  if (!detail.value?.contactValue) return
  showDialog({
    title: '拨打求助热线',
    message: `确定拨打 ${detail.value.name}：${detail.value.contactValue} 吗？`,
    showCancelButton: true
  }).then(() => {
    window.location.href = `tel:${detail.value?.contactValue}`
  }).catch(() => {})
}

// 打开在线客服
const openChat = () => {
  if (!detail.value?.contactValue) return
  window.open(detail.value.contactValue, '_blank')
}

// 发送邮件
const sendEmail = () => {
  if (!detail.value?.contactValue) return
  window.location.href = `mailto:${detail.value.contactValue}`
}

// 打开地图导航
const openNavigation = () => {
  if (!detail.value?.contactValue) return
  showDialog({
    title: detail.value.name,
    message: `地址：${detail.value.contactValue}\n服务时间：${detail.value.serviceTime}`,
    showCancelButton: true,
    confirmButtonText: '导航前往',
    cancelButtonText: '取消'
  }).then(() => {
    window.open(`https://uri.amap.com/search?query=${encodeURIComponent(detail.value?.contactValue || '')}`, '_blank')
  }).catch(() => {})
}

// 下载资源
const downloadResource = async (resource: Resource) => {
  try {
    if (resource.url.startsWith('http')) {
      window.open(resource.url, '_blank')
      showToast(`${resource.name}已开始下载`)
      return
    }
    
    const res = await request.get(resource.url, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resource.name}.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showToast(`${resource.name}已开始下载`)
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
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

.whitespace-pre-line {
  white-space: pre-line;
}
</style>