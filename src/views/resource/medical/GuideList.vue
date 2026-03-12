<template>
  <div class="p-4">
    <!-- 筛选 -->
    <div class="flex gap-2 mb-3">
      <van-button size="small" plain @click="showCategory = true">
        {{ diseaseLabel }} <van-icon name="arrow-down" />
      </van-button>
      <van-button size="small" plain @click="resetFilters">
        重置
      </van-button>
    </div>

    <!-- 分类选择弹窗（第一级） -->
    <van-popup v-model:show="showCategory" position="bottom">
      <van-picker
        :columns="categoryOptions"
        @confirm="onCategoryConfirm"
        @cancel="showCategory = false"
      />
    </van-popup>

    <!-- 疾病选择弹窗（第二级） -->
    <van-popup v-model:show="showDisease" position="bottom">
      <van-picker
        :columns="diseaseOptions"
        @confirm="onDiseaseConfirm"
        @cancel="showDisease = false"
      />
    </van-popup>

    <!-- 列表 -->
    <van-cell-group class="mt-3">
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :label="item.org + ' · ' + item.year"
        is-link
        @click="open(item)"
      >
        <template #right-icon>
          <van-tag type="primary">官方</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无指南数据" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface GuideItem {
  id: number
  title: string
  org: string
  year: string
  summary?: string
  pdfUrl?: string
}

// 响应式数据
const categoryId = ref<number | null>(null)
const diseaseId = ref<number | null>(null)
const categoryOptions = ref<{ text: string; value: number; children: { text: string; value: number }[] }[]>([])
const diseaseOptions = ref<{ text: string; value: number | null }[]>([])
const list = ref<GuideItem[]>([])
const loading = ref<boolean>(false)
const router = useRouter()

// 弹窗控制
const showCategory = ref(false)
const showDisease = ref(false)

// 计算显示标签
const diseaseLabel = computed(() => {
  const category = categoryOptions.value.find(c => c.value === categoryId.value)
  const disease = diseaseOptions.value.find(d => d.value === diseaseId.value)
  if (category && disease) {
    return `${category.text} - ${disease.text}`
  }
  return '请选择疾病'
})

// 获取分类及疾病数据 - 调用 /api/knowledge/disease-tree
const fetchCategoryOptions = async () => {
  try {
    const res = await request.get('/api/knowledge/disease-tree')
    const categories = res.data.data || []
    return categories.map((category: any) => ({
      text: category.name,
      value: category.id,
      children: category.children.map((disease: any) => ({
        text: disease.name,
        value: disease.id
      }))
    }))
  } catch (error) {
    console.error('获取分类数据失败:', error)
    return []
  }
}

// 确认分类（第一级）
const onCategoryConfirm = ({ selectedOptions }: any) => {
  categoryId.value = selectedOptions[0].value
  diseaseId.value = null

  // 动态生成疾病选项，插入"全部疾病"
  const children = selectedOptions[0].children || []
  diseaseOptions.value = [
    { text: '全部疾病', value: null },
    ...children.map((disease: any) => ({
      text: disease.text,
      value: disease.value
    }))
  ]

  showCategory.value = false
  showDisease.value = true
}

// 确认疾病（第二级）
const onDiseaseConfirm = ({ selectedOptions }: any) => {
  diseaseId.value = selectedOptions[0].value === null ? null : selectedOptions[0].value
  showDisease.value = false
}

// 加载指南列表
const loadGuideList = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/medical/guides', {
      params: { disease: diseaseId.value, page: 1, pageSize: 20 }
    })
    list.value = res.data.data.list || []
  } catch (error) {
    console.error('加载指南列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置筛选条件
const resetFilters = () => {
  categoryId.value = null
  diseaseId.value = null
  diseaseOptions.value = []
}

// 监听筛选条件变化，重新加载列表
watch([categoryId, diseaseId], () => {
  loadGuideList()
})

// 打开详情页
const open = (item: GuideItem) => {
  router.push(`/resource/medical/guides/${item.id}`)
}

// 生命周期
onMounted(async () => {
  categoryOptions.value = await fetchCategoryOptions()
  loadGuideList()
})
</script>

<style scoped>
/* 可添加自定义样式 */
</style>