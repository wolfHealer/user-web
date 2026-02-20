'/knowledge' // 知识库
'/community' // 病友交流
'/qa'  // 专家答疑
'/resources' // 资源下载
' /about' // 关于我们



# 启动项目
npm run dev

资源模块（Resource Module）

├── ResourceHome.vue         # 资源首页
├── medical/
│   ├── GuideList.vue        # 诊疗指南
│   ├── GuideDetail.vue
│   ├── InspectionList.vue   # 检查手册
│   ├── DoctorDirectory.vue  # 医生名录
│   ├── MedicalTemplate.vue  # 病历模板
│
├── charity/
│   ├── AidProjectList.vue # 公益项目
│   ├── PolicyList.vue #   政策支持
│
├── drug/
│   ├── DrugList.vue # 药物信息
│   ├── ChannelList.vue  # 获取渠道
│
├── rehab/
│   ├── RehabGuide.vue # 康复指南
│   ├── NursingGuide.vue # 护理指南