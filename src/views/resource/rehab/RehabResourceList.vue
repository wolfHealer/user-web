<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">康复资源对接</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterRegion" :options="regionOptions" />
      <van-dropdown-item v-model="filterDeviceCategory" :options="deviceCategoryOptions" />
    </van-dropdown-menu>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 康复机构名录 -->
    <div v-if="!loading" class="mt-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold">康复机构名录</h3>
        <van-button size="small" plain @click="viewAllInstitutions">
          查看全部
        </van-button>
      </div>
      <van-cell-group>
        <van-cell
          v-for="item in institutions"
          :key="item.id"
          :title="item.name"
          :label="`${item.region} · ${item.contact}`"
          is-link
          @click="viewDetails(item)"
        >
          <template #right-icon>
            <van-tag v-if="item.isInsurance" type="success" size="mini">医保</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 机构分页 -->
      <div v-if="!loading && institutions.length > 0" class="flex justify-center mt-4">
        <van-pagination
          v-model="institutionPage"
          :total="institutionTotal"
          :page-size="institutionPageSize"
          @change="onInstitutionPageChange"
        />
      </div>

      <!-- 机构空状态 -->
      <van-empty v-if="!loading && institutions.length === 0" description="暂无康复机构" />
    </div>

    <!-- 康复器械指南 -->
    <div v-if="!loading" class="mt-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold">康复器械指南</h3>
        <van-button size="small" plain @click="viewAllDevices">
          查看全部
        </van-button>
      </div>
      <van-cell-group>
        <van-cell
          v-for="device in devices"
          :key="device.id"
          :title="device.name"
          :label="device.desc"
          is-link
          @click="downloadGuide(device)"
        >
          <template #right-icon>
            <van-tag v-if="device.insuranceCovered" type="success" size="mini">医保</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 器械分页 -->
      <div v-if="!loading && devices.length > 0" class="flex justify-center mt-4">
        <van-pagination
          v-model="devicePage"
          :total="deviceTotal"
          :page-size="devicePageSize"
          @change="onDevicePageChange"
        />
      </div>

      <!-- 器械空状态 -->
      <van-empty v-if="!loading && devices.length === 0" description="暂无器械指南" />
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
const filterRegion = ref('all')
const filterDeviceCategory = ref('all')

// 机构分页
const institutionPage = ref(1)
const institutionPageSize = ref(5)
const institutionTotal = ref(0)

// 器械分页
const devicePage = ref(1)
const devicePageSize = ref(5)
const deviceTotal = ref(0)

// 筛选项
const regionOptions = ref<{ text: string; value: string }[]>([])
const deviceCategoryOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const institutions = ref<any[]>([])
const devices = ref<any[]>([])
const loading = ref(false)

// 获取地区选项
const fetchRegionOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/regions')
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
    regionOptions.value = [
      { text: '全部地区', value: 'all' },
      { text: '北京', value: 'bj' },
      { text: '上海', value: 'sh' },
      { text: '广州', value: 'gz' },
      { text: '深圳', value: 'sz' }
    ]
  }
}

// 获取器械类别选项
const fetchDeviceCategoryOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/device-categories')
    const data = res.data.data || res.data || {}

    if (data.categories && Array.isArray(data.categories)) {
      deviceCategoryOptions.value = [
        { text: '全部类别', value: 'all' },
        ...data.categories.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取器械类别选项失败:', error)
    deviceCategoryOptions.value = [
      { text: '全部类别', value: 'all' },
      { text: '轮椅类', value: 'wheelchair' },
      { text: '助行类', value: 'walker' },
      { text: '站立训练类', value: 'standing_frame' },
      { text: '护理床类', value: 'bed' }
    ]
  }
}

// 获取康复机构列表
const fetchInstitutions = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: institutionPage.value,
      pageSize: institutionPageSize.value
    }
    if (filterRegion.value !== 'all') params.region = filterRegion.value

    const res = await request.get('/api/resource/rehab/institutions', { params })
    const responseData = res.data.data || res.data || {}
    institutions.value = responseData.list || []
    institutionTotal.value = responseData.total || 0
  } catch (error) {
    console.error('获取康复机构失败:', error)
    institutions.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 获取康复器械列表
const fetchDevices = async () => {
  try {
    const params: Record<string, any> = {
      page: devicePage.value,
      pageSize: devicePageSize.value
    }
    if (filterDeviceCategory.value !== 'all') params.category = filterDeviceCategory.value

    const res = await request.get('/api/resource/rehab/devices', { params })
    const responseData = res.data.data || res.data || {}
    devices.value = responseData.list || []
    deviceTotal.value = responseData.total || 0
  } catch (error) {
    console.error('获取康复器械失败:', error)
    devices.value = []
    showToast('器械加载失败')
  }
}

// 机构分页变化
const onInstitutionPageChange = () => {
  fetchInstitutions()
}

// 器械分页变化
const onDevicePageChange = () => {
  fetchDevices()
}

// 查看全部机构
const viewAllInstitutions = () => {
  router.push('/resource/rehab/institutions')
}

// 查看全部器械
const viewAllDevices = () => {
  router.push('/resource/rehab/devices')
}

// 查看机构详情
const viewDetails = (item: any) => {
  if (!item?.id) {
    showToast('机构信息不完整')
    return
  }
  router.push(`/resource/rehab/institutions/detail/${item.id}`)
}

// 下载器械指南
const downloadGuide = async (device: any) => {
  if (!device?.id) {
    showToast('器械信息不完整')
    return
  }
  try {
    // 优先使用 guideUrl
    if (device.guideUrl) {
      if (device.guideUrl.startsWith('http')) {
        window.open(device.guideUrl, '_blank')
        showToast('下载已开始')
        return
      }
    }

    // 调用下载接口
    const res = await request.get(`/api/resource/rehab/devices/${device.id}/guide`, {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${device.name}使用指南.pdf`
    a.click()
    URL.revokeObjectURL(url)
    showToast('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
}

// 监听筛选条件变化
watch([filterRegion], () => {
  institutionPage.value = 1
  fetchInstitutions()
})

watch([filterDeviceCategory], () => {
  devicePage.value = 1
  fetchDevices()
})

// 组件挂载时初始化
onMounted(() => {
  fetchRegionOptions()
  fetchDeviceCategoryOptions()
  fetchInstitutions()
  fetchDevices()
})
</script>