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
│   ├── AidProjectList.vue # 救助项目库
│   ├── PolicyList.vue #   医保政策解读
│   ├── CaseShare.vue # 救助案例分享
│   ├── HelpChannel.vue # 求助通道指引
│
├── drug/
│   ├── DrugList.vue # 药物信息
│   ├── ChannelList.vue  # 获取渠道
│   ├── DonationProject.vue # 药品赠药/援助项目
│   ├── MedicationTool.vue # 用药管理工具
│
├── rehab/
│   ├── RehabGuide.vue # 康复训练指南
│   ├── HomeCareManual.vue # 居家护理手册
│   ├── PsychologicalSupport.vue # 心理支持资源
    ├── RehabResourceList.vue # 康复资源对接 
    ├── LifeTemplates.vue # 生活实用模板