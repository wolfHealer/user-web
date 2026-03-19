<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">救助案例分享</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterDisease" :options="diseaseOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 案例列表 -->
    <div
      v-else
      v-for="item in list"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4 mb-3"
    >
      <!-- 封面图 -->
      <van-image
        v-if="item.coverUrl"
        :src="item.coverUrl"
        class="w-full h-40 mb-3 rounded-lg"
        fit="cover"
        @click="viewCase(item)"
      />

      <div class="font-semibold">{{ item.title }}</div>
      <div class="text-sm text-gray-500 mt-1">
        疾病：{{ item.disease }} | 救助金额：{{ item.amount }}
      </div>
      <div class="text-sm mt-2 line-clamp-2">{{ item.summary }}</div>
      <div class="flex gap-2 mt-3">
        <van-button size="small" plain @click="viewCase(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadCase(item)">
          下载案例 PDF
        </van-button>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无案例分享" />

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

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选项
const diseaseOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)

// 获取疾病选项
const fetchDiseaseOptions = async () => {
  try {
    const res = await request.get('/api/resource/charity/cases/diseases')
    const data = res.data.data || res.data || {}

    if (data.diseases && Array.isArray(data.diseases)) {
      diseaseOptions.value = [
        { text: '全部疾病', value: 'all' },
        ...data.diseases.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取疾病选项失败:', error)
    // 使用默认选项
    diseaseOptions.value = [
      { text: '全部疾病', value: 'all' },
      { text: '血友病', value: 'hemophilia' },
      { text: '渐冻症', value: 'als' },
      { text: '白血病', value: 'leukemia' },
      { text: '脑瘫', value: 'cerebral_palsy' }
    ]
  }
}

// 获取案例列表
const fetchCases = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterDisease.value !== 'all') params.disease = filterDisease.value

    const res = await request.get('/api/resource/charity/cases', { params })
    const responseData = res.data.data || res.data || {}
    list.value = responseData.list || []
    total.value = responseData.total || 0
  } catch (error) {
    console.error('获取案例列表失败:', error)
    list.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 分页变化
const onPageChange = () => {
  fetchCases()
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  fetchCases()
}

// 查看案例详情
const viewCase = (item: any) => {
  if (!item?.id) {
    showToast('案例信息不完整')
    return
  }
  router.push(`/resource/charity/cases/detail/${item.id}`)
}

// 下载案例 PDF
const downloadCase = async (item: any) => {
  try {
    const res = await request.get(`/api/resource/charity/cases/${item.id}/pdf`, {
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

// 监听筛选条件变化
watch([filterDisease], () => {
  onFilterChange()
})

// 组件挂载时初始化
onMounted(() => {
  fetchDiseaseOptions()
  fetchCases()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>