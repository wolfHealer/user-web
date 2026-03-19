<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">求助通道指引</h2>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 求助渠道列表 -->
    <van-cell-group v-else>
      <van-cell
        v-for="item in channels"
        :key="item.id"
        :title="item.name"
        :label="item.desc"
        is-link
        @click="contact(item)"
      >
        <template #right-icon>
          <van-tag :type="getChannelTypeTag(item.type)">
            {{ getChannelTypeLabel(item.type) }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 空状态 -->
    <van-empty v-if="!loading && channels.length === 0" description="暂无求助渠道" />

    <!-- 模板下载 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadTemplate" :loading="downloading">
        下载求助模板
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import request from '@/utils/request'
import { useRouter } from 'vue-router'


// 渠道类型
interface Channel {
  id: number
  name: string
  desc: string
  type: string
  contactValue: string
  serviceTime: string
  available: boolean
}

// 列表数据
const channels = ref<Channel[]>([])
const loading = ref(false)
const downloading = ref(false)

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

// 获取求助渠道列表
const fetchChannels = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/charity/channels')
    const data = res.data.data || res.data || {}
    channels.value = data.channels || []
  } catch (error) {
    console.error('获取求助渠道失败:', error)
    channels.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 联系求助渠道
// const contact = (item: Channel) => {
//   if (!item.available) {
//     showToast('该渠道暂不可用')
//     return
//   }

//   switch (item.type) {
//     case 'phone':
//       // 拨打电话
//       showDialog({
//         title: '拨打求助热线',
//         message: `确定拨打 ${item.name}：${item.contactValue} 吗？`,
//         showCancelButton: true
//       }).then(() => {
//         window.location.href = `tel:${item.contactValue}`
//       }).catch(() => {})
//       break

//     case 'chat':
//       // 打开在线客服链接
//       window.open(item.contactValue, '_blank')
//       break

//     case 'email':
//       // 打开邮件客户端
//       window.location.href = `mailto:${item.contactValue}`
//       break

//     case 'offline':
//       // 显示地址信息
//       showDialog({
//         title: item.name,
//         message: `地址：${item.contactValue}\n服务时间：${item.serviceTime}`,
//         showCancelButton: true,
//         confirmButtonText: '导航前往',
//         cancelButtonText: '取消'
//       }).then(() => {
//         // 打开地图导航（可使用高德/百度地图 API）
//         window.open(`https://uri.amap.com/search?query=${encodeURIComponent(item.contactValue)}`, '_blank')
//       }).catch(() => {})
//       break

//     default:
//       showToast('未知的渠道类型')
//   }
// }

const router = useRouter()
// 联系求助渠道
const contact = (item: Channel) => {
  // 修改：先跳转到详情页
  if (!item?.id) {
    showToast('渠道信息不完整')
    return
  }
  router.push(`/resource/charity/channels/detail/${item.id}`)
}

// 下载求助模板
const downloadTemplate = async () => {
  downloading.value = true
  try {
    const res = await request.get('/api/resource/charity/channels/template')
    const data = res.data.data || res.data || {}

    if (data.templates && data.templates.length > 0) {
      // 如果有多个模板，显示选择弹窗
      if (data.templates.length > 1) {
        showDialog({
          title: '选择模板',
          message: data.templates.map((t: any) => `${t.name} (${t.size})`).join('\n'),
          showCancelButton: true,
          confirmButtonText: '下载全部'
        }).then(() => {
          data.templates.forEach((template: any) => {
            window.open(template.url, '_blank')
          })
          showToast('下载已开始')
        }).catch(() => {
          // 用户取消
        })
      } else {
        // 只有一个模板，直接下载
        const template = data.templates[0]
        window.open(template.url, '_blank')
        showToast('下载已开始')
      }
    } else {
      showToast('暂无可下载模板')
    }
  } catch (error) {
    console.error('下载模板失败:', error)
    showToast('下载失败，请重试')
  } finally {
    downloading.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  fetchChannels()
})
</script>