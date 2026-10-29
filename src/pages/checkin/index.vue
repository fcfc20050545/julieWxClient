<template>
  <view class="page" :style="pageStyle">
    <view class="stage">
      <view class="clock-block" :style="{ top: clockTop }">
        <view class="clock">{{ clockText }}</view>
        <view class="date">{{ dateText }}</view>
      </view>
      <view class="action" :style="{ top: buttonTop }">
        <button class="punch" hover-class="punch-hover" @tap="onPunch">
          <view class="punch-line">入睡</view>
          <view class="punch-line">打卡</view>
        </button>
        <view v-if="recorded" class="confirm">已记录 {{ recorded }}</view>
      </view>
    </view>
    <view class="dock">
      <sleep-tab current="checkin" />
    </view>
    <view v-if="confirming" class="mask" @tap="onCancel" @touchmove.stop.prevent>
      <view class="dialog" @tap.stop>
        <view class="dialog-text">是否确认打卡？</view>
        <view class="dialog-actions">
          <button class="dialog-btn dialog-cancel" :disabled="submitting" @tap="onCancel">取消</button>
          <button class="dialog-btn dialog-ok" :disabled="submitting" @tap="onConfirm">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { computed, onUnmounted, ref } from 'vue'
import SleepTab from '../../components/sleep-tab/index.vue'
import { checkIn } from '../../services/sleep'
import { getAvatarUrl, getNickname } from '../../services/store'
import { DESIGN_WIDTH, stageLayout } from '../../utils/layout'
import { formatCheckInClock, formatClock, formatDateLine } from '../../utils/records'
import './index.scss'

const TAB_BAR_HEIGHT = 50

function readStage() {
  const info = Taro.getWindowInfo()
  const screenHeight = info.screenHeight || info.windowHeight
  const safeBottom = info.safeArea ? Math.max(0, screenHeight - info.safeArea.bottom) : 0
  const tabPhysical = (TAB_BAR_HEIGHT * info.windowWidth) / DESIGN_WIDTH + safeBottom
  return stageLayout(Math.max(0, info.windowHeight - tabPhysical), info.windowWidth)
}

const now = ref(Date.now())
const recorded = ref('')
const confirming = ref(false)
const submitting = ref(false)
const box = ref(readStage())
let timer: ReturnType<typeof setInterval> | null = null

const pageStyle = computed(() => ({ height: `${box.value.height}px` }))
const clockTop = computed(() => `${box.value.clockTop}px`)
const buttonTop = computed(() => `${box.value.buttonTop}px`)
const clockText = computed(() => formatClock(now.value))
const dateText = computed(() => formatDateLine(now.value))

function clearTimer() {
  if (!timer) return
  clearInterval(timer)
  timer = null
}

useDidShow(() => {
  now.value = Date.now()
  box.value = readStage()
  clearTimer()
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

useDidHide(() => {
  clearTimer()
})

onUnmounted(() => {
  clearTimer()
})

function onPunch() {
  if (submitting.value || confirming.value) return
  confirming.value = true
}

function onCancel() {
  if (submitting.value) return
  confirming.value = false
}

async function onConfirm() {
  if (submitting.value) return
  submitting.value = true
  try {
    const result = await checkIn(getNickname(), getAvatarUrl())
    recorded.value = formatCheckInClock(result.checkInTime)
    confirming.value = false
  } catch (error) {
    confirming.value = false
    const message = error instanceof Error ? error.message : '打卡失败'
    Taro.showToast({ title: message, icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>
