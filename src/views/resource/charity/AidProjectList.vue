<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-bold">公益救助项目</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterType" :options="typeOptions" />
      <van-dropdown-item v-model="filterDisease" :options="diseaseOptions" />
      <van-dropdown-item v-model="filterAmount" :options="amountOptions" />
      <van-dropdown-item v-model="filterDifficulty" :options="difficultyOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 项目列表 -->
    <div
      v-else
      v-for="item in list"
      :key="item.id"
      class="bg-white rounded-xl shadow-sm p-4"
    >
      <div class="flex justify-between items-center">
        <div class="font-semibold">{{ item.title }}</div>
        <van-tag :type="item.status === 'open' ? 'success' : 'default'">
          {{ item.status === 'open' ? '可申请' : '已结束' }}
        </van-tag>
      </div>

      <div class="text-sm text-gray-500 mt-1">
        机构：{{ item.org }} | 金额：{{ item.amount }}
      </div>

      <div class="text-sm mt-2 line-clamp-2">
        {{ item.desc }}
      </div>

      <!-- 申请按钮 -->
      <div class="flex gap-2 mt-3">
        <van-button size="small" type="primary" @click="apply(item)">
          申请救助
        </van-button>
        <van-button size="small" plain @click="detail(item)">
          查看详情
        </van-button>
        <van-button size="small" plain @click="downloadDocs(item)">
          下载资料包
        </van-button>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无救助项目" />

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
import { ref, onMounted,watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

const router = useRouter()

// 筛选条件
const filterType = ref('all')
const filterDisease = ref('all')
const filterAmount = ref('all')
const filterDifficulty = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选项
const typeOptions = ref<{ text: string; value: string }[]>([])
const diseaseOptions = ref<{ text: string; value: string }[]>([])
const amountOptions = ref<{ text: string; value: string }[]>([])
const difficultyOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)

// 获取筛选选项
const fetchOptions = async () => {
  try {
    const res = await request.get('/api/resource/charity/filters')
    const data = res.data.data || res.data || {}

    if (data.types && Array.isArray(data.types)) {
      typeOptions.value = [
        { text: '全部类型', value: 'all' },
        ...data.types.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }

    if (data.diseases && Array.isArray(data.diseases)) {
      diseaseOptions.value = [
        { text: '全部疾病', value: 'all' },
        ...data.diseases.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }

    if (data.amounts && Array.isArray(data.amounts)) {
      amountOptions.value = [
        { text: '全部金额', value: 'all' },
        ...data.amounts.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }

    if (data.difficulties && Array.isArray(data.difficulties)) {
      difficultyOptions.value = [
        { text: '全部难度', value: 'all' },
        ...data.difficulties.map((item: any) => ({
          text: item.label || item.text,
          value: item.value || item.id
        }))
      ]
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
    // 使用默认选项
    typeOptions.value = [
      { text: '全部类型', value: 'all' },
      { text: '康复补贴', value: '康复补贴' },
      { text: '医疗费用', value: '医疗费用' },
      { text: '药品救助', value: '药品救助' }
    ]
    diseaseOptions.value = [
      { text: '全部疾病', value: 'all' },
      { text: '脑瘫', value: '1' },
      { text: '脊髓性肌萎缩症', value: '5' },
      { text: '白血病', value: '1' },
      { text: '糖尿病', value: '2' }
    ]
    amountOptions.value = [
      { text: '全部金额', value: 'all' },
      { text: '<1 万', value: 'lt1w' },
      { text: '1-5 万', value: '1w-5w' },
      { text: '>5 万', value: 'gt5w' }
    ]
    difficultyOptions.value = [
      { text: '全部难度', value: 'all' },
      { text: '简单', value: '简单' },
      { text: '中等', value: '中等' },
      { text: '复杂', value: '复杂' }
    ]
  }
}

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (filterType.value !== 'all') params.type = filterType.value
    if (filterDisease.value !== 'all') params.disease = filterDisease.value
    if (filterAmount.value !== 'all') params.amountRange = filterAmount.value
    if (filterDifficulty.value !== 'all') params.difficulty = filterDifficulty.value

    const res = await request.get('/api/resource/charity/projects', { params })
    const responseData = res.data.data || res.data || {}
    list.value = responseData.list || []
    total.value = responseData.total || 0
  } catch (error) {
    console.error('获取项目列表失败:', error)
    list.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 分页变化
const onPageChange = () => {
  fetchProjects()
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  fetchProjects()
}

// 申请救助
const apply = async (item: any) => {
  try {
    const res = await request.post('/api/resource/charity/apply', {
      projectId: item.id
    })
    if (res.data.code === 200) {
      showToast('申请提交成功')
    } else {
      showToast(res.data.message || '申请失败')
    }
  } catch (error) {
    console.error('申请失败:', error)
    showToast('申请失败，请重试')
  }
}

// 查看详情
const detail = (item: any) => {
  if (!item?.id) {
    showToast('项目信息不完整')
    return
  }
  router.push(`/resource/charity/detail/${item.id}`)
}
// 下载资料包
const downloadDocs = async (item: any) => {
  try {
    const res = await request.get(`/api/resource/charity/projects/${item.id}/docs`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `资料包_${item.title}.zip`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
}

// 监听筛选条件变化
watch([filterType, filterDisease, filterAmount, filterDifficulty], () => {
  onFilterChange()
})

// 组件挂载时初始化
onMounted(() => {
  fetchOptions()
  fetchProjects()
})
</script>