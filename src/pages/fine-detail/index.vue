<template>
  <view class="page">
    <view v-if="loaded && days.length === 0" class="empty">没有明细</view>
    <view v-for="day in days" :key="day.key" class="day">
      <view>
        <view class="date">{{ day.date }}</view>
        <view class="time">{{ day.lastCheckin }}</view>
      </view>
      <view class="day-side">
        <view class="badge" :class="day.overtime ? 'late' : 'ok'">
          {{ day.overtime ? '超时' : '正常' }}
        </view>
        <view class="fine">{{ day.fine }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { ref } from 'vue'
import { listFines } from '../../services/sleep'
import { mapSleepFines, type FineDayRow } from '../../utils/fines'
import './index.scss'

const days = ref<FineDayRow[]>([])
const loaded = ref(false)
const router = useRouter()

useDidShow(() => {
  loadDays()
})

async function loadDays() {
  const month = router.params.month || ''
  const userKey = router.params.user || ''
  if (!month || !userKey) {
    days.value = []
    loaded.value = true
    return
  }
  try {
    const data = await listFines(month)
    const match = mapSleepFines(data.users || []).find((item) => item.key === userKey)
    days.value = match?.days || []
    loaded.value = true
  } catch (error) {
    const message = error instanceof Error ? error.message : '详情加载失败'
    Taro.showToast({ title: message, icon: 'none' })
  }
}
</script>
