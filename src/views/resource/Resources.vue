<!-- <template>
  <div class="min-h-screen bg-gray-50">
    分区导航
    <section class="p-4">
      <h2 class="text-lg font-bold mb-4">资源对接</h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="flex flex-col items-center justify-center rounded-lg p-4 shadow-sm cursor-pointer"
          :class="category.bgColor"
          @click="goToCategory(category.id)"
        >
          <van-icon :name="category.icon" size="32" :color="category.iconColor" />
          <span class="mt-2 text-sm text-gray-700">{{ category.name }}</span>
        </div>
      </div>
    </section>

    资源列表
    <section class="p-4">
      <div
        v-for="(resource, index) in resources"
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 分区数据
const categories = ref([
  { id: 1, name: '医疗资源', icon: 'hospital-o', bgColor: 'bg-blue-100', iconColor: '#409EFF' },
  { id: 2, name: '公益救助', icon: 'gift-o', bgColor: 'bg-red-100', iconColor: '#F56C6C' },
  { id: 3, name: '用药渠道', icon: 'medicine-box-o', bgColor: 'bg-green-100', iconColor: '#67C23A' },
  { id: 4, name: '康复支持', icon: 'service-o', bgColor: 'bg-yellow-100', iconColor: '#E6A23C' }
])

// 资源数据
const resources = ref([
  {
    id: 1,
    name: '北京罕见病专科医院',
    description: '擅长治疗多种罕见病，提供全方位医疗服务。',
    contact: '010-12345678',
    status: '已审核',
    isFavorite: false
  },
  {
    id: 2,
    name: '中国罕见病公益基金会',
    description: '为罕见病患者提供资金援助和支持。',
    contact: '微信：raredisease_fund',
    status: '待审核',
    isFavorite: false
  }
])

// 跳转到分区详情页
const goToCategory = (categoryId: number) => {
  router.push(`/resources/category/${categoryId}`)
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
</style> -->


<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部 -->
    <div class="bg-white p-4 shadow-sm">
      <h1 class="text-lg font-bold">资源中心</h1>
      <p class="text-xs text-gray-500 mt-1">
        官方指南 · 救助政策 · 用药渠道 · 康复支持
      </p>
    </div>

    <!-- 四大入口 -->
    <div class="grid grid-cols-2 gap-3 p-4">
      <ResourceCard title="医疗资源" icon="medal" @click="go('/resource/medical')" />
      <ResourceCard title="公益救助" icon="gift" @click="go('/resource/charity')" />
      <ResourceCard title="用药渠道" icon="coupon" @click="go('/resource/drug')" />
      <ResourceCard title="康复支持" icon="friends" @click="go('/resource/rehab')" />
    </div>

    <!-- 推荐资源 -->
    <div class="px-4 pb-6">
      <div class="font-semibold mb-2">推荐资源</div>
      <van-cell-group>
        <van-cell
          v-for="item in recommends"
          :key="item.id"
          :title="item.title"
          is-link
          @click="open(item)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ResourceCard from './components/ResourceCard.vue'

const router = useRouter()

const recommends = [
  { id: 1, title: '罕见病诊疗指南合集' },
  { id: 2, title: '医保报销流程图解' }
]

const go = (path: string) => router.push(path)
const open = (item: any) => console.log(item)
</script>