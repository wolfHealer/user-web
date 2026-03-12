<template>
  <div class="reward-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="助力平台"
      left-arrow
      right-text="帮助"
      @click-left="goBack"
      @click-right="showHelp"
    />

    <!-- 头部情感区 -->
    <div class="header-card">
      <h1 class="title">您的支持，让罕见病被看见</h1>
      <p class="subtitle">
        打赏将用于：服务器、资源审核、患者资料维护、公益运营
      </p>
      <div class="icons-section">
        <div class="icon-item">
          <span>🖥</span> 服务器与存储
        </div>
        <div class="icon-item">
          <span>📄</span> 医疗资源整理与审核
        </div>
        <div class="icon-item">
          <span>🤝</span> 患者帮扶与信息更新
        </div>
      </div>
    </div>

    <!-- 打赏金额选择区 -->
    <div class="section">
      <h2 class="section-title">选择支持金额</h2>
      <div class="amount-buttons">
        <van-button
          v-for="amount in fixedAmounts"
          :key="amount"
          :type="selectedAmount === amount ? 'primary' : 'default'"
          size="normal"
          @click="selectAmount(amount)"
        >
          ¥{{ amount }}
        </van-button>
        <van-button
          :type="isCustomSelected ? 'primary' : 'default'"
          size="normal"
          @click="selectCustom"
        >
          其他 ▾
        </van-button>
      </div>

      <!-- 自定义金额输入框 -->
      <van-field
        v-if="isCustomSelected"
        v-model="customAmount"
        type="digit"
        placeholder="自定义金额（最低1元）"
        class="custom-input"
      />
    </div>

    <!-- 寄语输入框 -->
    <div class="section">
      <van-field
        v-model="message"
        placeholder="说点鼓励的话（选填）"
        class="message-input"
      />
    </div>

    <!-- 匿名开关 -->
    <div class="section">
      <van-switch-cell
        v-model="isAnonymous"
        title="匿名支持"
        active-color="#4A89FF"
      />
    </div>

    <!-- 支付方式选择 -->
    <div class="section">
      <h2 class="section-title">选择支付方式</h2>
      <van-radio-group v-model="paymentMethod" direction="horizontal">
        <van-radio name="wechat">微信支付</van-radio>
        <van-radio name="alipay">支付宝</van-radio>
      </van-radio-group>
    </div>

    <!-- 信任公示区 -->
    <div class="trust-card">
      <p>资金透明公示</p>
      <p>每月5号公示收支，所有打赏用于平台公益运营</p>
      <van-button size="small" plain @click="viewReport">查看公示</van-button>
    </div>

    <!-- 底部确认按钮 -->
    <div class="cta-container">
      <van-button
        type="primary"
        block
        @click="confirmSupport"
      >
        确认支持 ¥{{ finalAmount }}
      </van-button>
    </div>

    <!-- 帮助弹窗 -->
    <van-dialog
      v-model:show="showHelpDialog"
      title="帮助说明"
      message="这里是帮助内容"
      confirmButtonText="知道了"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 数据模型
const fixedAmounts = [10, 20, 50, 100]
const selectedAmount = ref(20)
const customAmount = ref('')
const message = ref('')
const isAnonymous = ref(true)
const paymentMethod = ref('wechat')
const showHelpDialog = ref(false)

// 计算属性
const isCustomSelected = computed(() => customAmount.value !== '')
const finalAmount = computed(() =>
  isCustomSelected.value ? Number(customAmount.value) : selectedAmount.value
)

// 方法
const goBack = () => router.back()
const showHelp = () => {
  showHelpDialog.value = true
}
const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = ''
}
const selectCustom = () => {
  selectedAmount.value = 0
}
const viewReport = () => {
  showToast('跳转到公示页面')
}
const confirmSupport = () => {
  if (finalAmount.value < 1) {
    showToast('金额不能低于1元')
    return
  }
  // 模拟支付跳转
  showToast(`正在跳转到${paymentMethod.value}支付...`)
}
</script>

<style scoped>
.reward-page {
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.van-nav-bar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 头部情感区 */
.header-card {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 20px 15px;
  padding: 20px;
  text-align: center;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.icons-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.icon-item {
  font-size: 14px;
  color: #333;
}

/* 金额选择区 */
.section {
  margin: 20px 15px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.amount-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.amount-buttons .van-button {
  width: 70px;
  height: 80px;
  border-radius: 12px;
}
.custom-input,
.message-input {
  border-radius: 12px;
  margin-top: 12px;
}

/* 信任公示区 */
.trust-card {
  background-color: #fff8e1;
  border-radius: 8px;
  margin: 20px 15px;
  padding: 12px;
  font-size: 14px;
  color: #333;
}
.trust-card p:first-child {
  font-weight: bold;
  margin-bottom: 4px;
}

/* 底部按钮 */
.cta-container {
  position: fixed;
  bottom: 20px;
  left: 15px;
  right: 15px;
}
.cta-container .van-button {
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
}
</style>