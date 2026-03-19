<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">居家护理手册</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterCategory" :options="categoryOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 护理内容 -->
    <van-collapse v-model="active" v-else>
      <van-collapse-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div class="text-sm leading-relaxed whitespace-pre-line">
          {{ item.content }}
        </div>
        <div class="text-xs text-gray-400 mt-2">
          更新时间：{{ formatDate(item.updateTime) }}
        </div>
      </van-collapse-item>
    </van-collapse>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无护理手册" />

    <!-- 工具下载 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadChecklist" :loading="downloadingChecklist">
        下载护理清单
      </van-button>
      <van-button type="primary" class="ml-2" @click="downloadRecordForm" :loading="downloadingRecord">
        下载观察记录表
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import request from '@/utils/request'


// 筛选条件
const filterCategory = ref('all')

// 展开的面板
const active = ref([])

// 筛选项
const categoryOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)
const downloadingChecklist = ref(false)
const downloadingRecord = ref(false)

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 获取分类选项
const fetchCategories = async () => {
  try {
    const res = await request.get('/api/resource/rehab/manuals/categories')
    const data = res.data.data || res.data || {}

    if (data.categories && Array.isArray(data.categories)) {
      categoryOptions.value = [
        { text: '全部类别', value: 'all' },
        ...data.categories.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取分类选项失败:', error)
    // 使用默认选项
    categoryOptions.value = [
      { text: '全部类别', value: 'all' },
      { text: '饮食指导', value: 'diet' },
      { text: '皮肤护理', value: 'skin' },
      { text: '康复训练', value: 'rehab' },
      { text: '用药指导', value: 'medication' },
      { text: '心理支持', value: 'psychology' }
    ]
  }
}

// 获取护理手册列表
const fetchManuals = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    if (filterCategory.value !== 'all') params.category = filterCategory.value

    const res = await request.get('/api/resource/rehab/manuals', { params })
    const responseData = res.data.data || res.data || {}
    list.value = responseData.manuals || []
  } catch (error) {
    console.error('获取护理手册失败:', error)
    list.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 筛选条件变化
const onFilterChange = () => {
  fetchManuals()
}

// 下载护理清单
const downloadChecklist = async () => {
  downloadingChecklist.value = true
  try {
    const res = await request.get('/api/resource/rehab/manuals/checklist', {
      params: { disease: filterCategory.value !== 'all' ? filterCategory.value : '' },
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `居家护理清单.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  } finally {
    downloadingChecklist.value = false
  }
}

// 下载观察记录表
const downloadRecordForm = async () => {
  downloadingRecord.value = true
  try {
    const res = await request.get('/api/resource/rehab/manuals/record-form', {
      params: { disease: filterCategory.value !== 'all' ? filterCategory.value : '' },
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `病情观察记录表.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  } finally {
    downloadingRecord.value = false
  }
}

// 监听筛选条件变化
watch([filterCategory], () => {
  onFilterChange()
})

// 组件挂载时初始化
onMounted(() => {
  fetchCategories()
  fetchManuals()
})
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}
</style>