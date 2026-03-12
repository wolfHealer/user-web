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
      <h2 class="text-lg font-bold">申请援助</h2>
      <div class="w-6"></div>
    </header>

    <!-- 项目信息 -->
    <div class="p-4 bg-white mt-3">
      <h3 class="font-semibold">{{ projectInfo?.name }}</h3>
      <div class="text-sm text-gray-500 mt-1">
        条件：{{ projectInfo?.condition }}
      </div>
    </div>

    <!-- 申请表单 -->
    <van-form @submit="onSubmit" class="p-4 mt-3 bg-white">
      <van-field
        v-model="form.patientName"
        name="patientName"
        label="患者姓名"
        placeholder="请输入患者姓名"
        :rules="[{ required: true, message: '请填写患者姓名' }]"
      />
      
      <van-field
        v-model="form.patientIdCard"
        name="patientIdCard"
        label="身份证号"
        placeholder="请输入身份证号"
        :rules="[
          { required: true, message: '请填写身份证号' },
          { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确' }
        ]"
      />
      
      <van-field
        v-model="form.contactPhone"
        name="contactPhone"
        label="联系电话"
        type="tel"
        placeholder="请输入联系电话"
        :rules="[
          { required: true, message: '请填写联系电话' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ]"
      />
      
      <van-field
        v-model="form.diagnosisHospital"
        name="diagnosisHospital"
        label="诊断医院"
        placeholder="请输入诊断医院名称"
        :rules="[{ required: true, message: '请填写诊断医院' }]"
      />
      
      <van-field
        v-model="form.diagnosisTime"
        name="diagnosisTime"
        label="确诊时间"
        type="date"
        placeholder="请选择确诊时间"
        :rules="[{ required: true, message: '请选择确诊时间' }]"
      />
      
      <van-field
        v-model="form.incomeProof"
        name="incomeProof"
        label="收入证明"
        type="textarea"
        rows="3"
        placeholder="请描述家庭收入情况"
        :rules="[{ required: true, message: '请填写收入情况' }]"
      />
      
      <van-field
        v-model="form.remark"
        name="remark"
        label="备注说明"
        type="textarea"
        rows="3"
        placeholder="其他需要说明的情况（可选）"
      />
      
      <!-- 文件上传 -->
      <div class="py-3">
        <div class="text-sm text-gray-600 mb-2">上传证明材料</div>
        <van-uploader
          v-model="form.files"
          :max-count="5"
          :max-size="10 * 1024 * 1024"
          @oversize="onOversize"
        />
        <div class="text-xs text-gray-400 mt-1">
          支持 jpg/png/pdf 格式，单个文件不超过 10MB
        </div>
      </div>
      
      <div class="mt-6">
        <van-button round block type="primary" native-type="submit" :loading="submitting">
          提交申请
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.ts'
import { showToast, showSuccessToast } from 'vant'

// 类型定义
interface ProjectInfo {
  id: number
  name: string
  condition: string
  period: string
  desc: string
}

interface FormState {
  patientName: string
  patientIdCard: string
  contactPhone: string
  diagnosisHospital: string
  diagnosisTime: string
  incomeProof: string
  remark: string
  files: Array<{ url?: string; file?: File }>
}

// 响应式数据
const projectInfo = ref<ProjectInfo | null>(null)
const submitting = ref(false)
const route = useRoute()
const router = useRouter()

// 表单数据
const form = ref<FormState>({
  patientName: '',
  patientIdCard: '',
  contactPhone: '',
  diagnosisHospital: '',
  diagnosisTime: '',
  incomeProof: '',
  remark: '',
  files: []
})

// 加载项目信息
const loadProjectInfo = async () => {
  try {
    const projectId = Number(route.query.projectId)
    const res = await request.get(`/api/resource/drug/donation/detail/${projectId}`)
    projectInfo.value = res.data.data
  } catch (error) {
    console.error('加载项目信息失败:', error)
    showToast('项目信息加载失败')
  }
}

// 文件过大提示
const onOversize = () => {
  showToast('文件大小不能超过 10MB')
}

// 提交表单
const onSubmit = async () => {
  submitting.value = true
  try {
    // 上传文件
    const fileUrls: string[] = []
    for (const item of form.value.files) {
      if (item.file) {
        const formData = new FormData()
        formData.append('file', item.file)
        const res = await request.post('/api/resource/drug/donation/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        fileUrls.push(res.data.data.url)
      }
    }
    
    // 提交申请
    await request.post('/api/resource/drug/donation/apply', {
      projectId: route.query.projectId,
      patientName: form.value.patientName,
      patientIdCard: form.value.patientIdCard,
      contactPhone: form.value.contactPhone,
      diagnosisHospital: form.value.diagnosisHospital,
      diagnosisTime: form.value.diagnosisTime,
      incomeProof: form.value.incomeProof,
      remark: form.value.remark,
      attachmentUrls: fileUrls
    })
    
    showSuccessToast('申请提交成功，请等待审核')
    setTimeout(() => {
      router.back()
    }, 1500)
  } catch (error) {
    console.error('提交申请失败:', error)
    showToast('申请提交失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  loadProjectInfo()
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