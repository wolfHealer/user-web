<template>
  <div class="p-4">
    <!-- 搜索框 -->
    <van-search 
      v-model="keyword" 
      placeholder="搜索医生/医院" 
      shape="round"
      clearable
    />

    <!-- 筛选按钮区域 -->
    <div class="flex gap-2 mt-3">
      <van-button size="small" plain @click="showDisease = true">
        {{ diseaseLabel }} <van-icon name="arrow-down" />
      </van-button>
      <van-button size="small" plain @click="showRegion = true">
        {{ regionLabel }} <van-icon name="arrow-down" />
      </van-button>
      <van-button size="small" plain @click="showLevel = true">
        {{ levelLabel }} <van-icon name="arrow-down" />
      </van-button>
      <van-button size="small" plain @click="resetFilters">
        重置
      </van-button>
    </div>

    <!-- 下载按钮 -->
    <div class="flex gap-2 mt-3">
      <van-button size="small" type="primary" @click="handleDownload('excel')">
        <van-icon name="down" /> 下载医生名录
      </van-button>
      <van-button size="small" @click="handleDownload('pdf')">
        <van-icon name="down" /> 下载医院名录
      </van-button>
    </div>

    <!-- 类型切换 -->
    <div class="flex gap-2 mt-3">
      <van-button 
        size="small" 
        :type="listType === 'all' ? 'primary' : 'default'" 
        @click="listType = 'all'"
      >
        全部
      </van-button>
      <van-button 
        size="small" 
        :type="listType === 'doctor' ? 'primary' : 'default'" 
        @click="listType = 'doctor'"
      >
        医生
      </van-button>
      <van-button 
        size="small" 
        :type="listType === 'hospital' ? 'primary' : 'default'" 
        @click="listType = 'hospital'"
      >
        医院
      </van-button>
    </div>

    <!-- 列表 -->
    <div class="space-y-3 mt-3">
      <div
        v-for="item in list"
        :key="item.id"
        class="bg-white rounded-xl p-4 shadow-sm"
        @click="open(item)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="font-semibold text-base">{{ item.name }}</div>
            <div class="text-sm text-gray-500 mt-1">
              <span v-if="item.type === 'doctor'">
                <span v-if="item.hospital">{{ item.hospital }}</span>
                <span v-if="item.department" class="mx-1">·</span>
                <span v-if="item.department">{{ item.department }}</span>
                <span v-if="item.title" class="mx-1">·</span>
                <span v-if="item.title">{{ item.title }}</span>
              </span>
              <span v-else>
                <span v-if="item.level">{{ item.level }}</span>
                <span v-if="item.address" class="mx-1">·</span>
                <span v-if="item.address">{{ item.address }}</span>
              </span>
            </div>
            <div class="text-xs text-blue-500 mt-1">
              擅长：{{ item.specialty }}
            </div>
            <!-- 协作网成员标识 -->
            <van-tag 
              type="success" 
              size="mini" 
              class="mt-1" 
              v-if="item.isNetworkMember"
            >
              协作网成员
            </van-tag>
          </div>
          <van-tag :type="item.type === 'doctor' ? 'primary' : 'success'">
            {{ item.type === 'doctor' ? '医生' : '医院' }}
          </van-tag>
        </div>

        <!-- 评价信息 -->
        <div class="flex items-center gap-2 mt-2 text-xs text-gray-400" v-if="item.rating">
          <van-icon name="star" color="#ff976a" />
          <span class="text-gray-600">{{ item.rating }} 分</span>
          <span>({{ item.reviewCount }} 条评价)</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无医生/医院数据" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" color="#1989fa" />

    <!-- 分页信息 -->
    <div class="text-center text-xs text-gray-500 mt-4" v-if="total > 0">
      共 {{ total }} 条记录
    </div>

    <!-- 疾病选择弹窗 -->
    <van-popup v-model:show="showDisease" position="bottom">
      <van-picker
        :columns="diseaseOptions"
        @confirm="onDiseaseConfirm"
        @cancel="showDisease = false"
      />
    </van-popup>

    <!-- 地区选择弹窗 -->
    <van-popup v-model:show="showRegion" position="bottom">
      <van-picker
        :columns="regionOptions"
        @confirm="onRegionConfirm"
        @cancel="showRegion = false"
      />
    </van-popup>

    <!-- 医院等级选择弹窗 -->
    <van-popup v-model:show="showLevel" position="bottom">
      <van-picker
        :columns="levelOptions"
        @confirm="onLevelConfirm"
        @cancel="showLevel = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface DirectoryItem {
  id: number
  type: 'doctor' | 'hospital'
  name: string
  hospital?: string
  department?: string
  title?: string
  specialty: string
  region?: string
  level?: string
  address?: string
  phone?: string
  rating?: number
  reviewCount?: number
  isNetworkMember?: boolean
}

// 响应式数据
const keyword = ref('')
const listType = ref<'all' | 'doctor' | 'hospital'>('all')
const diseaseId = ref<number | null>(null)
const regionId = ref<number | null>(null)
const levelId = ref<number | null>(null)
const list = ref<DirectoryItem[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const router = useRouter()

// 弹窗控制
const showDisease = ref(false)
const showRegion = ref(false)
const showLevel = ref(false)

// 筛选选项
const diseaseOptions = ref<{ text: string; value: number | null }[]>([])
const regionOptions = ref<{ text: string; value: number | null }[]>([
  { text: '全部地区', value: null },
  { text: '北京', value: 1 },
  { text: '上海', value: 2 },
  { text: '广州', value: 3 },
  { text: '成都', value: 4 },
  { text: '武汉', value: 5 },
  { text: '杭州', value: 6 },
  { text: '南京', value: 7 }
])
const levelOptions = ref<{ text: string; value: number | null }[]>([
  { text: '全部等级', value: null },
  { text: '三甲', value: 1 },
  { text: '三乙', value: 2 },
  { text: '二甲', value: 3 },
  { text: '二乙', value: 4 }
])

// 计算显示标签
const diseaseLabel = computed(() => {
  const found = diseaseOptions.value.find(d => d.value === diseaseId.value)
  return found ? found.text : '疾病分类'
})

const regionLabel = computed(() => {
  const found = regionOptions.value.find(r => r.value === regionId.value)
  return found ? found.text : '地区'
})

const levelLabel = computed(() => {
  const found = levelOptions.value.find(l => l.value === levelId.value)
  return found ? found.text : '医院等级'
})

// 加载疾病选项
const loadDiseaseOptions = async () => {
  try {
    const res = await request.get('/api/knowledge/disease-tree')
    const categories = res.data.data || []
    diseaseOptions.value = [
      { text: '全部疾病', value: null },
      ...categories.flatMap((category: any) => 
        category.children.map((disease: any) => ({
          text: disease.name,
          value: disease.id
        }))
      )
    ]
  } catch (error) {
    console.error('加载疾病选项失败:', error)
  }
}

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/medical/directory', {
      params: {
        keyword: keyword.value,
        type: listType.value === 'all' ? null : listType.value,
        disease: diseaseId.value,
        region: regionId.value,
        level: levelId.value,
        page: page.value,
        pageSize: pageSize.value
      }
    })
    list.value = res.data.data.list || []
    total.value = res.data.data.total || 0
  } catch (error) {
    console.error('加载名录数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 筛选确认
const onDiseaseConfirm = ({ selectedOptions }: any) => {
  diseaseId.value = selectedOptions[0].value === null ? null : selectedOptions[0].value
  showDisease.value = false
  page.value = 1
  loadList()
}

const onRegionConfirm = ({ selectedOptions }: any) => {
  regionId.value = selectedOptions[0].value === null ? null : selectedOptions[0].value
  showRegion.value = false
  page.value = 1
  loadList()
}

const onLevelConfirm = ({ selectedOptions }: any) => {
  levelId.value = selectedOptions[0].value === null ? null : selectedOptions[0].value
  showLevel.value = false
  page.value = 1
  loadList()
}

// 重置筛选
const resetFilters = () => {
  keyword.value = ''
  listType.value = 'all'
  diseaseId.value = null
  regionId.value = null
  levelId.value = null
  page.value = 1
  loadList()
}

// 打开详情页
const open = (item: DirectoryItem) => {
  const type = item.type === 'doctor' ? 'doctor' : 'hospital'
  router.push(`/resource/medical/directory/${type}/${item.id}`)
}

// 下载名录
const handleDownload = (type: 'excel' | 'pdf') => {
  const url = type === 'excel' 
    ? '/api/resource/medical/directory/export/doctors'
    : '/api/resource/medical/directory/export/hospitals'
  
  // 携带当前筛选条件
  const params = new URLSearchParams({
    disease: diseaseId.value?.toString() || '',
    region: regionId.value?.toString() || '',
    level: levelId.value?.toString() || ''
  })
  
  const link = document.createElement('a')
  link.href = `${url}?${params.toString()}`
  link.download = type === 'excel' ? '医生名录.xlsx' : '医院名录.pdf'
  link.click()
}

// 监听搜索词变化
watch(keyword, () => {
  page.value = 1
  loadList()
})

// 监听类型变化
watch(listType, () => {
  page.value = 1
  loadList()
})

onMounted(() => {
  loadDiseaseOptions()
  loadList()
})
</script>

<style scoped>
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.rounded-xl {
  border-radius: 12px;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow-sm:active {
  opacity: 0.8;
  transition: opacity 0.2s;
}
</style>