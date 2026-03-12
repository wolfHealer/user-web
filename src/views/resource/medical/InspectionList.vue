<!-- <template>
  <div class="p-4">
    <van-search v-model="keyword" placeholder="搜索检查项目" />

    <van-cell-group>
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.name"
        :label="item.desc"
        is-link
      />
    </van-cell-group>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const list = ref([
  { id: 1, name: '基因检测指南', desc: '检测流程说明' }
])
</script> -->

<!-- <script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import request from '@/utils/request.ts'

// 类型定义
interface InspectionItem {
  id: number
  name: string
  desc: string
  category?: string
  price?: number
  duration?: string
  preparation?: string
}

const keyword = ref('')
const list = ref<InspectionItem[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

// 加载检查项目列表
const loadInspectionList = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/medical/inspections', {
      params: {
        keyword: keyword.value,
        page: page.value,
        pageSize: pageSize.value
      }
    })
    list.value = res.data.data.list || []
    total.value = res.data.data.total || 0
  } catch (error) {
    console.error('加载检查项目列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听搜索词变化
watch(keyword, () => {
  page.value = 1  // 重置页码
  loadInspectionList()
})

onMounted(() => {
  loadInspectionList()
})
</script> -->
<template>
  <div class="p-4">
    <!-- 搜索框 -->
    <van-search 
      v-model="keyword" 
      placeholder="搜索检查项目" 
      shape="round"
      clearable
    />

    <!-- 列表 -->
    <van-cell-group class="mt-3">
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.name"
        :label="item.desc"
        is-link
        @click="open(item)"
      >
        <template #right-icon>
          <van-tag type="primary" v-if="item.category">{{ item.category }}</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 空状态 -->
    <van-empty v-if="!loading && list.length === 0" description="暂无检查项目数据" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="mt-4" />

    <!-- 分页信息 -->
    <div class="text-center text-xs text-gray-500 mt-4" v-if="total > 0">
      共 {{ total }} 条记录
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.ts'

// 类型定义
interface InspectionItem {
  id: number
  name: string
  desc: string
  category?: string
  price?: number
  duration?: string
  preparation?: string
}

// 响应式数据
const keyword = ref('')
const list = ref<InspectionItem[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const router = useRouter()

// 加载检查项目列表
const loadInspectionList = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/resource/medical/inspections', {
      params: {
        keyword: keyword.value,
        page: page.value,
        pageSize: pageSize.value
      }
    })
    list.value = res.data.data.list || []
    total.value = res.data.data.total || 0
  } catch (error) {
    console.error('加载检查项目列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开详情页
const open = (item: InspectionItem) => {
  router.push(`/resource/medical/inspection/${item.id}`)
}

// 监听搜索词变化
watch(keyword, () => {
  page.value = 1  // 重置页码
  loadInspectionList()
})

onMounted(() => {
  loadInspectionList()
})
</script>

<style scoped>
/* 可添加自定义样式 */
</style>
