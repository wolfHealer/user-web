<template>
  <div
    class="bg-white rounded-xl shadow-sm p-4 text-center active:scale-95"
    @click="$emit('click')"
  >
    <van-icon :name="icon" size="26" class="text-blue-500 mb-2" />
    <div class="text-base font-medium text-blue-500">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; icon: string }>()
</script>