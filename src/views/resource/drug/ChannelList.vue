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
      <h2 class="text-lg font-bold">正规购药渠道</h2>
      <div class="w-6"></div>
    </header>

    <!-- 筛选栏 -->
    <div class="px-4 bg-white pb-2">
      <div class="flex gap-2">
        <van-button size="small" plain @click="showRegion = true">
          {{ regionLabel }} <van-icon name="arrow-down" />
        </van-button>
        <van-button size="small" plain @click="showDelivery = true">
          {{ deliveryLabel }} <van-icon name="arrow-down" />
        </van-button>
        <van-button size="small" plain @click="resetFilters">
          重置
        </van-button>
      </div>
    </div>

    <!-- 动态列表 -->
    <section class="flex-1 overflow-y-auto p-4">
      <!-- 加载状态 -->
      <van-loading v-if="loading" type="spinner" class="py-8">
        加载中...
      </van-loading>

      <!-- 空状态 -->
      <div v-else-if="channels.length === 0" class="text-center text-gray-400 py-8">
        暂无渠道数据
      </div>

      <!-- 渠道列表 -->
      <div
        v-else
        v-for="channel in channels"
        :key="channel.id"
        class="bg-white rounded-xl p-4 shadow-sm mb-3"
      >
        <div class="font-semibold">{{ channel.name }}</div>

        <div class="text-sm text-gray-500 mt-1">
          类型：{{ channel.type }} | 地址：{{ channel.address }}
        </div>

        <div class="text-sm mt-2">{{ channel.desc }}</div>

        <!-- 操作按钮 -->
        <div class="flex gap-2 mt-3">
          <van-button size="small" type="primary" @click="contact(channel)">
            联系渠道
          </van-button>
          <van-button size="small" plain @click="copyInfo(channel)">
            复制信息
          </van-button>
          <van-button size="small" plain @click="feedback(channel)">
            反馈评价
          </van-button>
        </div>
      </div>
    </section>

    <!-- 地区选择弹窗 -->
    <van-popup v-model:show="showRegion" position="bottom">
      <van-picker
        :columns="regionOptions"
        @confirm="onRegionConfirm"
        @cancel="showRegion = false"
      />
    </van-popup>

    <!-- 配送方式选择弹窗 -->
    <van-popup v-model:show="showDelivery" position="bottom">
      <van-picker
        :columns="deliveryOptions"
        @confirm="onDeliveryConfirm"
        @cancel="showDelivery = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import { showToast, showSuccessToast, showDialog } from 'vant'

const router = useRouter()

// 弹窗控制
const showRegion = ref(false)
const showDelivery = ref(false)

// 筛选条件
const filterRegion = ref('all')
const filterDelivery = ref('all')

// 列表数据
const channels = ref<any[]>([])
const loading = ref(false)

// 筛选选项（从后端获取）
const regionOptions = ref<{ text: string; value: string }[]>([])
const deliveryOptions = ref<{ text: string; value: string }[]>([])

// 计算显示标签
const regionLabel = computed(() => {
  const found = regionOptions.value.find(r => r.value === filterRegion.value)
  return found ? found.text : '全部地区'
})

const deliveryLabel = computed(() => {
  const found = deliveryOptions.value.find(d => d.value === filterDelivery.value)
  return found ? found.text : '全部配送方式'
})

// 获取筛选选项
const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/drug/channel/options')
    const data = res.data.data || res.data || {}
    
    if (data.regions && Array.isArray(data.regions)) {
      regionOptions.value = [
        { text: '全部地区', value: 'all' },
        ...data.regions.map((item: any) => ({
          text: item.label,
          value: item.value
        }))
      ]
    }
    
    if (data.deliveries && Array.isArray(data.deliveries)) {
      deliveryOptions.value = [
        { text: '全部配送方式', value: 'all' },
        ...data.deliveries.map((item: any) => ({
          text: item.label,
          value: item.value
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
    // 使用默认选项
    regionOptions.value = [
      { text: '全部地区', value: 'all' },
      { text: '北京', value: 'beijing' },
      { text: '上海', value: 'shanghai' }
    ]
    deliveryOptions.value = [
      { text: '全部配送方式', value: 'all' },
      { text: '自提', value: 'pickup' },
      { text: '快递', value: 'delivery' }
    ]
  }
}

// 获取渠道列表
const fetchChannels = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    if (filterRegion.value !== 'all') params.region = filterRegion.value
    if (filterDelivery.value !== 'all') params.delivery = filterDelivery.value

    const res = await request.get('/api/resource/drug/channel/list', { params })
    channels.value = res.data.data?.list || res.data.data || res.data || []
  } catch (error) {
    console.error('获取渠道列表失败:', error)
    channels.value = []
  } finally {
    loading.value = false
  }
}

// 确认地区
const onRegionConfirm = ({ selectedOptions }: any) => {
  filterRegion.value = selectedOptions[0].value
  showRegion.value = false
  fetchChannels()
}

// 确认配送方式
const onDeliveryConfirm = ({ selectedOptions }: any) => {
  filterDelivery.value = selectedOptions[0].value
  showDelivery.value = false
  fetchChannels()
}

// 重置筛选条件
const resetFilters = () => {
  filterRegion.value = 'all'
  filterDelivery.value = 'all'
  fetchChannels()
}

// 联系渠道
// const contact = async (channel: any) => {
//   try {
//     const res = await request.post(`/api/resource/drug/channel/contact/${channel.id}`, {
//       contactType: 'phone'
//     })
//     const contactInfo = res.data.data
    
//     showDialog({
//       title: '联系方式',
//       content: `
//         电话：${contactInfo.phone || '暂无'}<br>
//         微信：${contactInfo.wechat || '暂无'}<br>
//         邮箱：${contactInfo.email || '暂无'}
//       `,
//       allowHtml: true
//     })
//   } catch (error) {
//     console.error('获取联系方式失败:', error)
//     showToast('获取联系方式失败，请稍后再试！')
//   }
// }
// 联系渠道 - 跳转详情页
const contact = (channel: any) => {
  router.push(`/resource/drug/channel/detail/${channel.id}`)
}

// 复制信息
const copyInfo = (channel: any) => {
  const text = `渠道名称：${channel.name}\n类型：${channel.type}\n地址：${channel.address}\n说明：${channel.desc}`
  navigator.clipboard.writeText(text).then(() => {
    showSuccessToast('信息已复制')
  }).catch(() => {
    showToast('复制失败，请手动复制')
  })
}

// 反馈评价
const feedback = async (channel: any) => {
  showDialog({
    title: '反馈评价',
    content: '请输入您对渠道的评价',
    showInput: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消'
  }).then(async ({ value }: any) => {
    if (!value) {
      showToast('请输入评价内容')
      return
    }
    
    try {
      await request.post(`/api/resource/drug/channel/feedback/${channel.id}`, {
        rating: 5,
        content: value
      })
      showSuccessToast('评价提交成功')
    } catch (error) {
      console.error('提交评价失败:', error)
      showToast('评价提交失败，请稍后再试！')
    }
  }).catch(() => {})
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 组件挂载时初始化
onMounted(() => {
  fetchOptions()
  fetchChannels()
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