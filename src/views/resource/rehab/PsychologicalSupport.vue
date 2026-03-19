<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">心理支持资源</h2>

    <!-- 筛选栏 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="filterTarget" :options="targetOptions" />
      <van-dropdown-item v-model="filterRegion" :options="regionOptions" />
      <van-dropdown-item v-model="filterOrgType" :options="orgTypeOptions" />
    </van-dropdown-menu>

    <!-- 搜索栏 -->
    <div class="mt-3">
      <van-search
        v-model="keyword"
        placeholder="搜索指南或机构"
        shape="round"
        @search="onSearch"
        @clear="onSearch"
      />
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4">加载中...</van-loading>

    <!-- 心理疏导指南 -->
    <div v-if="!loading" class="mt-4">
      <h3 class="font-semibold mb-2">心理疏导指南</h3>
      <van-cell-group>
        <van-cell
          v-for="item in guides"
          :key="item.id"
          :title="item.title"
          :label="item.targetName"
          is-link
          @click="downloadGuide(item)"
        >
          <template #right-icon>
            <van-tag type="primary" size="mini">PDF</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 指南分页 -->
      <div v-if="guides.length > 0" class="flex justify-center mt-4">
        <van-pagination
          v-model="guidePage"
          :total="guideTotal"
          :page-size="guidePageSize"
          @change="onGuidePageChange"
        />
      </div>

      <!-- 指南空状态 -->
      <van-empty v-if="guides.length === 0" description="暂无心理疏导指南" />
    </div>

    <!-- 咨询机构名录 -->
    <div class="mt-4">
      <h3 class="font-semibold mb-2">心理咨询机构</h3>
      <van-cell-group>
        <van-cell
          v-for="org in organizations"
          :key="org.id"
          :title="org.name"
          :label="`${org.typeName} · ${org.contact}`"
          is-link
          @click="contactOrg(org)"
        >
          <template #right-icon>
            <van-tag v-if="org.isFree" type="success" size="mini">免费</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 机构分页 -->
      <div v-if="organizations.length > 0" class="flex justify-center mt-4">
        <van-pagination
          v-model="orgPage"
          :total="orgTotal"
          :page-size="orgPageSize"
          @change="onOrgPageChange"
        />
      </div>

      <!-- 机构空状态 -->
      <van-empty v-if="organizations.length === 0" description="暂无心理咨询机构" />
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
const filterTarget = ref('all')
const filterRegion = ref('all')
const filterOrgType = ref('all')
const keyword = ref('')

// 指南分页
const guidePage = ref(1)
const guidePageSize = ref(10)
const guideTotal = ref(0)

// 机构分页
const orgPage = ref(1)
const orgPageSize = ref(10)
const orgTotal = ref(0)

// 筛选项
const targetOptions = ref<{ text: string; value: string }[]>([])
const regionOptions = ref<{ text: string; value: string }[]>([])
const orgTypeOptions = ref<{ text: string; value: string }[]>([])

// 列表数据
const guides = ref<any[]>([])
const organizations = ref<any[]>([])
const loading = ref(false)

// 防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null

// 获取目标人群选项
const fetchTargetOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/psychological/guides/targets')
    const data = res.data.data || res.data || {}

    if (data.targets && Array.isArray(data.targets)) {
      targetOptions.value = [
        { text: '全部人群', value: 'all' },
        ...data.targets.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取目标人群选项失败:', error)
    targetOptions.value = [
      { text: '全部人群', value: 'all' },
      { text: '患者', value: 'patient' },
      { text: '家属', value: 'family' },
      { text: '儿童', value: 'child' }
    ]
  }
}

// 获取地区选项
const fetchRegionOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/psychological/organizations/regions')
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
      { text: '全国', value: 'all' },
      { text: '北京', value: 'bj' },
      { text: '上海', value: 'sh' }
    ]
  }
}

// 获取机构类型选项
const fetchOrgTypeOptions = async () => {
  try {
    const res = await request.get('/api/resource/rehab/psychological/organizations/types')
    const data = res.data.data || res.data || {}

    if (data.types && Array.isArray(data.types)) {
      orgTypeOptions.value = [
        { text: '全部类型', value: 'all' },
        ...data.types.map((item: any) => ({
          text: item.text || item.name,
          value: item.value || item.code
        }))
      ]
    }
  } catch (error) {
    console.error('获取机构类型选项失败:', error)
    orgTypeOptions.value = [
      { text: '全部类型', value: 'all' },
      { text: '心理热线', value: 'hotline' },
      { text: '心理中心', value: 'center' },
      { text: '心理医院', value: 'hospital' }
    ]
  }
}

// 获取心理疏导指南列表
const fetchGuides = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: guidePage.value,
      pageSize: guidePageSize.value
    }
    if (filterTarget.value !== 'all') params.target = filterTarget.value
    if (keyword.value) params.keyword = keyword.value

    const res = await request.get('/api/resource/rehab/psychological/guides', { params })
    const responseData = res.data.data || res.data || {}
    guides.value = responseData.list || []
    guideTotal.value = responseData.total || 0
  } catch (error) {
    console.error('获取指南列表失败:', error)
    guides.value = []
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 获取心理咨询机构列表
const fetchOrganizations = async () => {
  try {
    const params: Record<string, any> = {
      page: orgPage.value,
      pageSize: orgPageSize.value
    }
    if (filterRegion.value !== 'all') params.region = filterRegion.value
    if (filterOrgType.value !== 'all') params.type = filterOrgType.value
    if (keyword.value) params.keyword = keyword.value

    const res = await request.get('/api/resource/rehab/psychological/organizations', { params })
    const responseData = res.data.data || res.data || {}
    organizations.value = responseData.list || []
    orgTotal.value = responseData.total || 0
  } catch (error) {
    console.error('获取机构列表失败:', error)
    organizations.value = []
    showToast('机构加载失败')
  }
}

// 指南分页变化
const onGuidePageChange = () => {
  fetchGuides()
}

// 机构分页变化
const onOrgPageChange = () => {
  fetchOrganizations()
}

// 搜索（防抖）
const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    guidePage.value = 1
    orgPage.value = 1
    fetchGuides()
    fetchOrganizations()
  }, 300)
}

// 下载指南
const downloadGuide = async (item: any) => {
  if (!item?.id) {
    showToast('指南信息不完整')
    return
  }
  try {
    // 优先使用 downloadUrl
    if (item.downloadUrl) {
      if (item.downloadUrl.startsWith('http')) {
        window.open(item.downloadUrl, '_blank')
        showToast('下载已开始')
        return
      }
    }

    // 调用下载接口
    const res = await request.get(`/api/resource/rehab/psychological/guides/${item.id}/download`, {
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

// 联系机构
const contactOrg = (org: any) => {
  if (!org?.id) {
    showToast('机构信息不完整')
    return
  }
  router.push(`/resource/rehab/psychological/organizations/detail/${org.id}`)
}

// 监听筛选条件变化
watch([filterTarget], () => {
  guidePage.value = 1
  fetchGuides()
})

watch([filterRegion, filterOrgType], () => {
  orgPage.value = 1
  fetchOrganizations()
})

// 组件挂载时初始化
onMounted(() => {
  fetchTargetOptions()
  fetchRegionOptions()
  fetchOrgTypeOptions()
  fetchGuides()
  fetchOrganizations()
})
</script>