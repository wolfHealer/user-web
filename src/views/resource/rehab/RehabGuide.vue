<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">康复训练指南</h2>

    <!-- 疾病筛选 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterDisease" :options="diseaseOptions" />
      <van-dropdown-item v-model="filterStage" :options="stageOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 训练列表 -->
    <div
      v-else
      v-for="item in list"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4"
    >
      <div class="font-semibold">{{ item.title }}</div>

      <div class="text-sm text-gray-500 mt-1">
        类型：{{ item.type }} | 阶段：{{ getStageLabel(item.stage) }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ item.desc }}
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary" @click="viewDetails(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadGuide(item)">
          下载 PDF 版
        </van-button>
        <van-button size="small" plain @click="previewOnline(item)">
          在线预览
        </van-button>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无训练指南" />

    <!-- 分页 -->
    <div v-if="!loading && list.length > 0" class="flex justify-center mt-4">
      <van-pagination
        v-model="currentPage"
        :total="total"
        :page-size="pageSize"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

const router = useRouter()

// 筛选条件
const filterDisease = ref('all')
const filterStage = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选项
const diseaseOptions = ref<{ text: string; value: string }[]>([])
const stageOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)

// 阶段标签映射
const stageLabels: Record<string, string> = {
  early: '早期',
  mid: '中期',
  late: '晚期'
}

// 获取阶段标签
const getStageLabel = (stage: string) => {
  return stageLabels[stage] || stage
}

// 获取筛选选项
const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/dictionaries')
    const data = res.data.data || res.data || {}

    if (data.diseases && Array.isArray(data.diseases)) {
      diseaseOptions.value = [
        { text: '全部疾病', value: 'all' },
        ...data.diseases.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }

    if (data.stages && Array.isArray(data.stages)) {
      stageOptions.value = [
        { text: '全部阶段', value: 'all' },
        ...data.stages.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
    // 使用默认选项
    diseaseOptions.value = [
      { text: '全部疾病', value: 'all' },
      { text: '脑瘫', value: '1' },
      { text: '脑卒中', value: '2' },
      { text: '骨折术后', value: '3' },
      { text: '类风湿关节炎', value: '4' }
    ]
    stageOptions.value = [
      { text: '全部阶段', value: 'all' },
      { text: '早期', value: 'early' },
      { text: '中期', value: 'mid' },
      { text: '晚期', value: 'late' }
    ]
  }
}

// 获取训练列表
const fetchTrainings = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterDisease.value !== 'all') params.disease = filterDisease.value
    if (filterStage.value !== 'all') params.stage = filterStage.value

    const res = await request.get('/api/resource/rehab/trainings', { params })
    const responseData = res.data.data || res.data || {}
    list.value = responseData.list || []
    total.value = responseData.total || 0
  } catch (error) {
    console.error('获取列表失败:', error)
    list.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 分页变化
const onPageChange = () => {
  fetchTrainings()
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  fetchTrainings()
}

// 查看详情
// 查看详情
const viewDetails = (item: any) => {
  if (!item?.id) {
    showToast('指南信息不完整')
    return
  }
  // 修改前：/api/resource/rehab/detail/${item.id}
  // 修改后：
  router.push(`/resource/rehab/detail/${item.id}`)
}

// 下载 PDF 版
const downloadGuide = async (item: any) => {
  try {
    const res = await request.get(`/api/resource/rehab/trainings/${item.id}/resource`, {
      params: { type: 'pdf' },
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.title}.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
}

// 在线预览
// 在线预览
const previewOnline = (item: any) => {
  if (!item?.id) {
    showToast('指南信息不完整')
    return
  }
  // 可以直接跳转到详情页，详情页包含视频播放
  router.push(`/resource/rehab/detail/${item.id}`)
}

// 监听筛选条件变化
watch([filterDisease, filterStage], () => {
  onFilterChange()
})

// 组件挂载时初始化
onMounted(() => {
  fetchOptions()
  fetchTrainings()
})
</script>