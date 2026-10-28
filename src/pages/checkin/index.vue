<template>
  <view class="page" :style="pageStyle">
    <form v-if="ready && !nickname" class="gate" @submit="onSaveNickname">
      <view class="gate-title">填写昵称</view>
      <view class="gate-hint">这个昵称会显示在打卡记录里。</view>
      <input
        class="gate-input"
        type="nickname"
        name="nickname"
        placeholder="微信昵称"
        @input="onNameInput"
      />
      <view v-if="nameError" class="gate-error">{{ nameError }}</view>
      <button class="gate-btn" form-type="submit">保存</button>
    </form>
    <view v-else-if="ready" class="stage">
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
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { computed, onUnmounted, ref } from 'vue'
import { addCheckin, getNickname, saveNickname } from '../../services/store'
import { stageLayout } from '../../utils/layout'
import { formatClock, formatDateLine } from '../../utils/records'
import './index.scss'

function readStage() {
  const info = Taro.getWindowInfo()
  return stageLayout(info.windowHeight, info.windowWidth)
}

const now = ref(Date.now())
const nickname = ref('')
const ready = ref(false)
const recorded = ref('')
const draft = ref('')
const nameError = ref('')
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
  nickname.value = getNickname()
  ready.value = true
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

function onNameInput(event: { detail?: { value?: string } }) {
  draft.value = event.detail?.value || ''
  nameError.value = ''
}

function onSaveNickname(event: { detail?: { value?: { nickname?: string } } }) {
  const fromForm = event.detail?.value?.nickname || ''
  const name = (fromForm || draft.value).trim()
  if (!name) {
    nameError.value = '请填写昵称'
    return
  }
  saveNickname(name)
  nickname.value = name
  nameError.value = ''
}

function onPunch() {
  const checkedAt = now.value
  addCheckin(nickname.value, checkedAt)
  recorded.value = formatClock(checkedAt)
}
</script>
