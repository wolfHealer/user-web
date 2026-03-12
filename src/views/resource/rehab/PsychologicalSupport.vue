<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-3">心理支持资源</h2>

    <!-- 心理疏导指南 -->
    <van-cell-group>
      <van-cell
        v-for="item in guides"
        :key="item.id"
        :title="item.title"
        is-link
        @click="downloadGuide(item)"
      />
    </van-cell-group>

    <!-- 咨询机构名录 -->
    <div class="mt-4">
      <h3 class="font-semibold">心理咨询机构</h3>
      <van-cell-group>
        <van-cell
          v-for="org in organizations"
          :key="org.id"
          :title="org.name"
          :label="`${org.type} · ${org.contact}`"
          is-link
          @click="contactOrg(org)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
const guides = [
  { id: 1, title: '患者心理调节手册' },
  { id: 2, title: '家属心理疏导手册' }
]

const organizations = [
  {
    id: 1,
    name: '某公益心理热线',
    type: '免费',
    contact: '400-xxx-xxxx'
  }
]

const downloadGuide = (item: any) => console.log('下载指南', item)
const contactOrg = (org: any) => console.log('联系机构', org)
</script>