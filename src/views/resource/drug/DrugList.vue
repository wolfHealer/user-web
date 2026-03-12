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
      <h2 class="text-lg font-bold">罕见病药品名录</h2>
      <div class="w-6"></div>
    </header>

    <!-- 搜索栏 -->
    <div class="p-4 bg-white">
      <van-search 
        v-model="keyword" 
        placeholder="搜索药品名称" 
        @update:model-value="onSearchChange"
      />
    </div>

    <!-- 筛选栏 -->
    <div class="px-4 bg-white pb-2">
      <div class="flex gap-2">
        <van-button size="small" plain @click="showType = true">
          {{ typeLabel }} <van-icon name="arrow-down" />
        </van-button>
        <van-button size="small" plain @click="showInsurance = true">
          {{ insuranceLabel }} <van-icon name="arrow-down" />
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
      <div v-else-if="drugs.length === 0" class="text-center text-gray-400 py-8">
        暂无数据
      </div>

      <!-- 药品列表 -->
      <div
        v-else
        v-for="drug in drugs"
        :key="drug.id"
        class="bg-white rounded-xl p-4 shadow-sm mb-3"
      >
        <div class="flex justify-between">
          <div class="font-semibold">{{ drug.name }}</div>
          <van-tag :type="drug.insurance ? 'success' : 'default'">
            {{ drug.insurance ? '医保' : '非医保' }}
          </van-tag>
        </div>

        <div class="text-sm text-gray-500 mt-1">
          适应症：{{ drug.indication }} | 类型：{{ drug.type }}
        </div>

        <div class="text-sm mt-2 line-clamp-2">
          {{ drug.desc }}
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2 mt-3">
          <van-button size="small" type="primary" @click="viewDetails(drug)">
            查看详情
          </van-button>
          <van-button size="small" plain @click="downloadManual(drug)">
            下载说明书
          </van-button>
        </div>
      </div>
    </section>

    <!-- 名录下载 -->
    <div class="p-4 bg-white">
      <van-button type="primary" block @click="downloadList" :loading="exporting">
        下载药品名录 Excel 版
      </van-button>
    </div>

    <!-- 类型选择弹窗 -->
    <van-popup v-model:show="showType" position="bottom">
      <van-picker
        :columns="typeOptions"
        @confirm="onTypeConfirm"
        @cancel="showType = false"
      />
    </van-popup>

    <!-- 医保状态选择弹窗 -->
    <van-popup v-model:show="showInsurance" position="bottom">
      <van-picker
        :columns="insuranceOptions"
        @confirm="onInsuranceConfirm"
        @cancel="showInsurance = false"
      />
    </van-popup>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'

const router = useRouter()

// 弹窗控制
const showType = ref(false)
const showInsurance = ref(false)

// 搜索与筛选条件
const keyword = ref('')
const filterType = ref('all')
const filterInsurance = ref('all')

// 列表数据
const drugs = ref<any[]>([])
const loading = ref(false)
const exporting = ref(false)

// 筛选选项（从后端获取）
const typeOptions = ref<{ text: string; value: string }[]>([])
const insuranceOptions = ref<{ text: string; value: string | boolean }[]>([])

// 计算显示标签
const typeLabel = computed(() => {
  const found = typeOptions.value.find(t => t.value === filterType.value)
  return found ? found.text : '全部类型'
})

const insuranceLabel = computed(() => {
  const found = insuranceOptions.value.find(i => i.value === filterInsurance.value)
  return found ? found.text : '全部医保状态'
})

// 防抖搜索
let searchTimer: ReturnType<typeof setTimeout> | null = null
const onSearchChange = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchDrugs()
  }, 300)
}

// 获取筛选选项
const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/drug/options')
    const data = res.data.data || res.data || {}
    
    if (data.types) {
      typeOptions.value = [
        { text: '全部类型', value: 'all' },
        ...data.types.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.id
        }))
      ]
    }
    
    if (data.insurances) {
      insuranceOptions.value = [
        { text: '全部医保状态', value: 'all' },
        ...data.insurances.map((item: any) => ({
          text: item.text || item.name,
          value: item.value !== undefined ? item.value : item.id
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
    // 使用默认选项
    typeOptions.value = [
      { text: '全部类型', value: 'all' },
      { text: '进口药', value: 'imported' },
      { text: '国产药', value: 'domestic' }
    ]
    insuranceOptions.value = [
      { text: '全部医保状态', value: 'all' },
      { text: '医保', value: true },
      { text: '非医保', value: false }
    ]
  }
}

// 获取药品列表
const fetchDrugs = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterType.value !== 'all') params.type = filterType.value
    if (filterInsurance.value !== 'all') params.insurance = filterInsurance.value

    const res = await request.get('/api/resource/drug/list', { params })
    drugs.value = res.data.data?.list || res.data || []
  } catch (error) {
    console.error('获取药品列表失败:', error)
    drugs.value = []
  } finally {
    loading.value = false
  }
}

// 确认类型
const onTypeConfirm = ({ selectedOptions }: any) => {
  filterType.value = selectedOptions[0].value
  showType.value = false
  fetchDrugs()
}

// 确认医保状态
const onInsuranceConfirm = ({ selectedOptions }: any) => {
  filterInsurance.value = selectedOptions[0].value
  showInsurance.value = false
  fetchDrugs()
}

// 重置筛选条件
const resetFilters = () => {
  keyword.value = ''
  filterType.value = 'all'
  filterInsurance.value = 'all'
  fetchDrugs()
}

// 查看详情
const viewDetails = async (drug: any) => {
  try {
    const res = await request.get(`/api/resource/drug/detail/${drug.id}`)
    console.log('药品详情', res.data)
    // 可跳转详情页或弹窗展示
    // router.push(`/drug/detail/${drug.id}`)
  } catch (error) {
    console.error('获取详情失败:', error)
    alert('获取药品详情失败，请稍后再试！')
  }
}

// 下载说明书
const downloadManual = async (drug: any) => {
  try {
    const res = await request.get(`/api/resource/drug/manual/${drug.id}`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${drug.name}_说明书.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载说明书失败:', error)
    alert('下载说明书失败，请稍后再试！')
  }
}

// 导出名录
const downloadList = async () => {
  exporting.value = true
  try {
    const params: Record<string, any> = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterType.value !== 'all') params.type = filterType.value
    if (filterInsurance.value !== 'all') params.insurance = filterInsurance.value

    const res = await request.get('/api/resource/drug/export', {
      params,
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `药品名录_${new Date().toLocaleDateString()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出名录失败:', error)
    alert('导出名录失败，请稍后再试！')
  } finally {
    exporting.value = false
  }
}

// 返回上一级页面
const goBack = () => {
  router.back()
}

// 组件挂载时初始化
onMounted(() => {
  fetchOptions()
  fetchDrugs()
})
</script> -->


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'

const router = useRouter()

// 弹窗控制
const showType = ref(false)
const showInsurance = ref(false)

// 搜索与筛选条件
const keyword = ref('')
const filterType = ref('all')
const filterInsurance = ref('all')

// 列表数据
const drugs = ref<any[]>([])
const loading = ref(false)
const exporting = ref(false)

// 筛选选项（从后端获取）
const typeOptions = ref<{ text: string; value: string }[]>([])
const insuranceOptions = ref<{ text: string; value: string }[]>([])

// 计算显示标签
const typeLabel = computed(() => {
  const found = typeOptions.value.find(t => t.value === filterType.value)
  return found ? found.text : '全部类型'
})

const insuranceLabel = computed(() => {
  const found = insuranceOptions.value.find(i => i.value === filterInsurance.value)
  return found ? found.text : '全部医保状态'
})

// 防抖搜索
let searchTimer: ReturnType<typeof setTimeout> | null = null
const onSearchChange = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchDrugs()
  }, 300)
}

// 获取筛选选项
const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/drug/options')
    const data = res.data.data || res.data || {}
    
    if (data.types && Array.isArray(data.types)) {
      typeOptions.value = [
        { text: '全部类型', value: 'all' },
        ...data.types.map((item: any) => ({
          text: item.label,
          value: item.value
        }))
      ]
    }
    
    if (data.insurances && Array.isArray(data.insurances)) {
      insuranceOptions.value = [
        { text: '全部医保状态', value: 'all' },
        ...data.insurances.map((item: any) => ({
          text: item.label,
          value: item.value
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
    typeOptions.value = [
      { text: '全部类型', value: 'all' },
      { text: '进口药', value: '进口' },
      { text: '国产药', value: '国产' },
      { text: '仿制药', value: '仿制药' }
    ]
    insuranceOptions.value = [
      { text: '全部医保状态', value: 'all' },
      { text: '医保', value: 'true' },
      { text: '非医保', value: 'false' }
    ]
  }
}

// 获取药品列表
const fetchDrugs = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterType.value !== 'all') params.type = filterType.value
    if (filterInsurance.value !== 'all') params.insurance = filterInsurance.value

    const res = await request.get('/api/resource/drug/list', { params })
    drugs.value = res.data.data?.list || res.data.data || res.data || []
  } catch (error) {
    console.error('获取药品列表失败:', error)
    drugs.value = []
  } finally {
    loading.value = false
  }
}

// 确认类型
const onTypeConfirm = ({ selectedOptions }: any) => {
  filterType.value = selectedOptions[0].value
  showType.value = false
  fetchDrugs()
}

// 确认医保状态
const onInsuranceConfirm = ({ selectedOptions }: any) => {
  filterInsurance.value = selectedOptions[0].value
  showInsurance.value = false
  fetchDrugs()
}

// 重置筛选条件
const resetFilters = () => {
  keyword.value = ''
  filterType.value = 'all'
  filterInsurance.value = 'all'
  fetchDrugs()
}

// 查看详情
// const viewDetails = async (drug: any) => {
//   try {
//     const res = await request.get(`/api/resource/drug/detail/${drug.id}`)
//     console.log('药品详情', res.data)
//   } catch (error) {
//     console.error('获取详情失败:', error)
//     alert('获取药品详情失败，请稍后再试！')
//   }
// }
// 查看详情
const viewDetails = (drug: any) => {
  router.push(`/resource/drug/detail/${drug.id}`)
}

// 下载说明书
const downloadManual = async (drug: any) => {
  try {
    const res = await request.get(`/api/resource/drug/manual/${drug.id}`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${drug.name}_说明书.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载说明书失败:', error)
    alert('下载说明书失败，请稍后再试！')
  }
}

// 导出名录
const downloadList = async () => {
  exporting.value = true
  try {
    const params: Record<string, any> = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterType.value !== 'all') params.type = filterType.value
    if (filterInsurance.value !== 'all') params.insurance = filterInsurance.value

    const res = await request.get('/api/resource/drug/export', {
      params,
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `药品名录_${new Date().toLocaleDateString()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出名录失败:', error)
    alert('导出名录失败，请稍后再试！')
  } finally {
    exporting.value = false
  }
}

// 返回上一级页面
const goBack = () => {
  router.back()
}

// 组件挂载时初始化
onMounted(() => {
  fetchOptions()
  fetchDrugs()
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