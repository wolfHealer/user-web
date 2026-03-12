<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm p-4 w-full flex items-center justify-between">
      <!-- 返回按钮 -->
      <van-icon
        name="arrow-left"
        size="24"
        color="#000000"
        class="cursor-pointer"
        @click="goBack"
      />

      <!-- 筛选按钮区域 -->
      <div class="flex gap-2">
        <!-- 疾病筛选按钮 -->
        <van-button size="small" plain @click="showCategory = true">
          {{ diseaseLabel }} <van-icon name="arrow-down" />
        </van-button>

        <!-- 类型筛选按钮 -->
        <van-button size="small" plain @click="showType = true">
          {{ typeLabel }} <van-icon name="arrow-down" />
        </van-button>

        <!-- 排序筛选按钮 -->
        <van-button size="small" plain @click="showSort = true">
          {{ sortLabel }} <van-icon name="arrow-down" />
        </van-button>

        <!-- 重置按钮 -->
        <van-button size="small" plain @click="resetFilters">
          重置
        </van-button>
      </div>
    </header>

    <!-- 动态列表 -->
    <section class="flex-1 overflow-y-auto p-4">
      <PostList
        :category-id="categoryId"
        :disease-id="diseaseId"
        :type="type"
        :sort="sort"
        @comment="handleComment"
      />
    </section>

    <!-- 分类选择弹窗（第一级） -->
    <van-popup v-model:show="showCategory" position="bottom">
      <van-picker
        :columns="categoryOptions"
        @confirm="onCategoryConfirm"
        @cancel="showCategory = false"
      />
    </van-popup>

    <!-- 疾病选择弹窗（第二级） -->
    <van-popup v-model:show="showDisease" position="bottom">
      <van-picker
        :columns="diseaseOptions"
        @confirm="onDiseaseConfirm"
        @cancel="showDisease = false"
      />
    </van-popup>

    <!-- 类型选择弹窗 -->
    <van-popup v-model:show="showType" position="bottom">
      <van-picker
        :columns="typeOptions"
        @confirm="onTypeConfirm"
        @cancel="showType = false"
      />
    </van-popup>

    <!-- 排序选择弹窗 -->
    <van-popup v-model:show="showSort" position="bottom">
      <van-picker
        :columns="sortOptions"
        @confirm="onSortConfirm"
        @cancel="showSort = false"
      />
    </van-popup>

    <!-- 底部导航栏 -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PostList from './components/PostList.vue'
import request from '@/utils/request.ts'
import BottomNav from '@/components/BottomNav.vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 弹窗控制
const showCategory = ref(false)
const showDisease = ref(false)
const showType = ref(false)
const showSort = ref(false)

// 筛选条件
const categoryId = ref<number | null>(null)
const diseaseId = ref<number | null>(null)
const type = ref<string>('all')
const sort = ref<string>('latest')

// 分类选项（从后端获取）
const categoryOptions = ref<{ text: string; value: number; children: { text: string; value: number }[] }[]>([])

// 疾病选项（动态加载）
const diseaseOptions = ref<{ text: string; value: number }[]>([])

// 类型和排序选项
const typeOptions = [
  { text: '全部类型', value: 'all' },
  { text: '求助', value: 'help' },
  { text: '经验', value: 'experience' },
  { text: '情绪', value: 'emotion' }
]

const sortOptions = [
  { text: '最新', value: 'latest' },
  { text: '热门', value: 'hot' }
]

// 计算显示标签
const diseaseLabel = computed(() => {
  const category = categoryOptions.value.find(c => c.value === categoryId.value)
  const disease = diseaseOptions.value.find(d => d.value === diseaseId.value)
  if (category && disease) {
    return `${category.text} - ${disease.text}`
  }
  return '请选择疾病'
})

const typeLabel = computed(() => {
  const found = typeOptions.find(t => t.value === type.value)
  return found ? found.text : '全部类型'
})

const sortLabel = computed(() => {
  const found = sortOptions.find(s => s.value === sort.value)
  return found ? found.text : '最新'
})

// 获取分类及疾病数据
const fetchCategoryOptions = async () => {
  try {
    const res = await request.get('/api/knowledge/disease-tree')
    const categories = res.data.data || []

    return categories.map((category: any) => ({
      text: category.name,
      value: category.id,
      children: category.children.map((disease: any) => ({
        text: disease.name,
        value: disease.id
      }))
    }))
  } catch (error) {
    console.error('获取分类数据失败:', error)
    return []
  }
}

// 确认分类（第一级）
const onCategoryConfirm = ({ selectedOptions }: any) => {
  categoryId.value = selectedOptions[0].value
  diseaseId.value = null

  // 动态生成疾病选项，插入“全部疾病”
  const children = selectedOptions[0].children || []
  diseaseOptions.value = [
    { text: '全部疾病', value: null },
    ...children.map((disease: any) => ({
      text: disease.text,
      value: disease.value
    }))
  ]

  showCategory.value = false
  showDisease.value = true
}

// 确认疾病（第二级）
const onDiseaseConfirm = ({ selectedOptions }: any) => {
  diseaseId.value = selectedOptions[0].value === null ? null : selectedOptions[0].value
  showDisease.value = false
}

// 确认类型
const onTypeConfirm = ({ selectedOptions }: any) => {
  type.value = selectedOptions[0].value
  showType.value = false
}

// 确认排序
const onSortConfirm = ({ selectedOptions }: any) => {
  sort.value = selectedOptions[0].value
  showSort.value = false
}

// 重置筛选条件
const resetFilters = () => {
  categoryId.value = null
  diseaseId.value = null
  type.value = 'all'
  sort.value = 'latest'
  diseaseOptions.value = []
}

// 监听分类变化，清空疾病选择
watch(categoryId, () => {
  diseaseId.value = null
})

// 组件挂载时获取分类数据
onMounted(async () => {
  categoryOptions.value = await fetchCategoryOptions()
})

// 返回上一级页面
const goBack = () => {
  router.back()
}

const handleComment = async (data: { post: any; newComment?: any; comments?: any[] }) => {
  console.log('handleComment 被调用:', data)

  if (data.newComment) {
    const userId = userStore.userInfo?.user_id
    if (!userId) {
      alert('用户未登录，请先登录！')
      return
    }

    try {
      const res = await request.post(`/api/community/posts/${data.post.id}/comments`, {
        content: data.newComment.content,
        user_id: userId,
        target_type: 'post'
      })

      console.log('评论创建成功:', res.data)
      alert(`新评论：${data.newComment.content}`)
    } catch (error) {
      console.error('评论创建失败:', error)
      alert('评论提交失败，请稍后再试！')
    }
  }
}
</script>

<style scoped>
.min-h-screen {
  background-color: #f9fafb; /* 浅灰色背景 */
}

.sticky.top-0 {
  background-color: #ffffff; /* 白色顶部栏 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.text-sm {
  font-size: 16px;
}

.rounded-lg {
  border-radius: 10px;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.hover\:bg-blue-50:hover {
  background-color: #e0f2fe;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>