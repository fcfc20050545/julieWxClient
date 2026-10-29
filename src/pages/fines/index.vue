<template>
  <view class="page">
    <picker mode="date" fields="month" :value="month" @change="onMonthChange">
      <view class="month">
        <view class="month-value">{{ month }}</view>
        <view class="month-hint">选择月份</view>
      </view>
    </picker>
    <view v-if="loaded && users.length === 0" class="empty">这个月还没有打卡</view>
    <view v-for="user in users" :key="user.key" class="card">
      <view class="card-head">
        <view class="nickname">{{ user.nickname }}</view>
        <image v-if="user.avatarUrl" class="avatar" mode="aspectFill" :src="user.avatarUrl" />
        <view v-else class="avatar avatar-empty"></view>
      </view>
      <view class="stats">
        <view class="stat">
          <view class="label">迟睡次数</view>
          <view class="value">{{ user.overtimeDays }}</view>
        </view>
        <view class="stat">
          <view class="label">总罚款</view>
          <view class="value">{{ user.totalFine }}</view>
        </view>
      </view>
      <view class="card-foot">
        <button class="detail-btn" @tap="onDetail(user)">详情</button>
      </view>
    </view>
    <view class="dock">
      <sleep-tab current="fines" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { ref } from 'vue'
import SleepTab from '../../components/sleep-tab/index.vue'
import { listFines } from '../../services/sleep'
import { currentMonth, mapSleepFines, type FineUserRow } from '../../utils/fines'
import './index.scss'

const month = ref(currentMonth())
const users = ref<FineUserRow[]>([])
const loaded = ref(false)

useDidShow(() => {
  loadFines()
})

function onMonthChange(event: { detail?: { value?: string } }) {
  const value = event.detail?.value || ''
  if (!value || value === month.value) return
  month.value = value
  users.value = []
  loaded.value = false
  loadFines()
}

function onDetail(user: FineUserRow) {
  const query = `month=${encodeURIComponent(month.value)}&user=${encodeURIComponent(user.key)}`
  Taro.navigateTo({ url: `/pages/fine-detail/index?${query}` })
}

async function loadFines() {
  const requested = month.value
  try {
    const data = await listFines(requested)
    if (requested !== month.value) return
    users.value = mapSleepFines(data.users || [])
    loaded.value = true
  } catch (error) {
    const message = error instanceof Error ? error.message : '统计加载失败'
    Taro.showToast({ title: message, icon: 'none' })
  }
}
</script>
