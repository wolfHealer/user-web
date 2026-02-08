<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部筛选栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full">
      <van-dropdown-menu>
        <van-dropdown-item v-model="selectedRegion" :options="regions" @change="filterByRegion" />
      </van-dropdown-menu>
    </header>

    <!-- 资源列表 -->
    <section class="p-4">
      <div
        v-for="(resource, index) in filteredResources"
        :key="index"
        class="bg-white rounded-lg shadow-sm mb-4 p-4"
      >
        <div class="font-semibold text-sm">{{ resource.name }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ resource.description }}</div>
        <div class="mt-2 text-sm">
          <span class="font-bold">联系方式：</span>
          <span class="text-blue-500 cursor-pointer" @click="copyContact(resource.contact)">
            {{ resource.contact }}
          </span>
        </div>
        <div class="mt-2 text-sm">
          <span class="font-bold">审核状态：</span>
          <span :class="resource.status === '已审核' ? 'text-green-500' : 'text-yellow-500'">
            {{ resource.status }}
          </span>
        </div>
        <div class="flex justify-between mt-3">
          <van-button size="small" @click="favoriteResource(resource)">
            {{ resource.isFavorite ? '已收藏' : '收藏' }}
          </van-button>
          <van-button size="small" @click="feedbackResource(resource)">反馈有效性</van-button>
        </div>
      </div>
    </section>
  </div>
</template>

// src/views/resource/CategoryDetail.vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'

const route = useRoute()

// 从路由参数中获取分类 ID
const categoryId = Number(route.params.id)

// 地区筛选选项
const regions = ref([
  { text: '全部地区', value: 'all' },
  { text: '北京', value: 'beijing' },
  { text: '上海', value: 'shanghai' },
  { text: '广州', value: 'guangzhou' }
])

// 当前选中地区
const selectedRegion = ref('all')

// 资源数据（模拟不同分类下的数据）
const allResources = ref([
  {
    id: 1,
    name: '北京罕见病专科医院',
    description: '擅长治疗多种罕见病，提供全方位医疗服务。',
    contact: '010-12345678',
    region: 'beijing',
    status: '已审核',
    isFavorite: false,
    categoryId: 1
  },
  {
    id: 2,
    name: '上海罕见病公益组织',
    description: '为罕见病患者提供资金援助和支持。',
    contact: '微信：sh_raredisease',
    region: 'shanghai',
    status: '待审核',
    isFavorite: false,
    categoryId: 2
  }
])

// 筛选后的资源
const filteredResources = computed(() => {
  const resourcesInCategory = allResources.value.filter(
    (res) => res.categoryId === categoryId
  )
  if (selectedRegion.value === 'all') return resourcesInCategory
  return resourcesInCategory.filter((res) => res.region === selectedRegion.value)
})

// 按地区筛选
const filterByRegion = () => {
  console.log('筛选地区:', selectedRegion.value)
}

// 复制联系方式
const copyContact = (contact: string) => {
  navigator.clipboard.writeText(contact).then(() => {
    showToast('复制成功')
  })
}

// 收藏/取消收藏资源
const favoriteResource = (resource: any) => {
  resource.isFavorite = !resource.isFavorite
  showToast(resource.isFavorite ? '已收藏' : '已取消收藏')
}

// 反馈资源有效性
const feedbackResource = (resource: any) => {
  alert(`反馈资源 ID: ${resource.id} 的有效性`)
}

// 页面加载时执行
onMounted(() => {
  console.log('当前分类 ID:', categoryId)
})
</script>

<style scoped>
.text-sm {
  font-size: 16px;
}
.rounded-lg {
  border-radius: 10px;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>