<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">医保政策解读</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="region" :options="regionOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 政策列表 -->
    <van-cell-group class="mt-3" v-else>
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :label="item.region + ' · ' + item.date"
        is-link
        @click="open(item)"
      >
        <template #right-icon>
          <van-tag type="primary">政策</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无政策解读" />

    <!-- 分页 -->
    <div v-if="!loading && list.length > 0" class="flex justify-center mt-4">
      <van-pagination
        v-model="currentPage"
        :total="total"
        :page-size="pageSize"
        @change="onPageChange"
      />
    </div>

    <!-- 下载资料 -->
    <div class="mt-4 text-center">
      <van-button type="primary" @click="downloadMaterials" :loading="downloading">
        下载医保报销流程图解
      </van-button>
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
const region = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选项
const regionOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const list = ref<any[]>([])
const loading = ref(false)
const downloading = ref(false)

// 获取地区选项
const fetchRegions = async () => {
  try {
    const res = await request.get('/api/resource/charity/policies/regions')
    const data = res.data.data || res.data || {}

    if (data.regions && Array.isArray(data.regions)) {
      regionOptions.value = [
        { text: '全部地区', value: 'all' },
        ...data.regions.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取地区选项失败:', error)
    // 使用默认选项
    regionOptions.value = [
      { text: '全部地区', value: 'all' },
      { text: '全国', value: 'all' },
      { text: '北京', value: 'bj' },
      { text: '上海', value: 'sh' },
      { text: '广州', value: 'gz' },
      { text: '深圳', value: 'sz' }
    ]
  }
}

// 获取政策列表
const fetchPolicies = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (region.value !== 'all') params.region = region.value

    const res = await request.get('/api/resource/charity/policies', { params })
    const responseData = res.data.data || res.data || {}
    list.value = responseData.list || []
    total.value = responseData.total || 0
  } catch (error) {
    console.error('获取政策列表失败:', error)
    list.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 分页变化
const onPageChange = () => {
  fetchPolicies()
}

// 筛选条件变化
const onFilterChange = () => {
  currentPage.value = 1
  fetchPolicies()
}

// 查看政策详情
const open = (item: any) => {
  if (!item?.id) {
    showToast('政策信息不完整')
    return
  }
  router.push(`/resource/charity/policies/detail/${item.id}`)
}

// 下载资料
const downloadMaterials = async () => {
  downloading.value = true
  try {
    // 先获取资料列表
    const res = await request.get('/api/resource/charity/policies/materials', {
      params: { type: 'flowchart' }
    })
    const data = res.data.data || res.data || {}
    
    if (data.materials && data.materials.length > 0) {
      const material = data.materials[0]
      // 打开新窗口下载
      window.open(material.url, '_blank')
      showToast('下载已开始')
    } else {
      showToast('暂无可下载资料')
    }
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败，请重试')
  } finally {
    downloading.value = false
  }
}

// 监听筛选条件变化
watch([region], () => {
  onFilterChange()
})

// 组件挂载时初始化
onMounted(() => {
  fetchRegions()
  fetchPolicies()
})
</script>