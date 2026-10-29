<template>
  <view class="page">
    <view class="table">
      <view class="row head">
        <view class="col date">日期</view>
        <view class="col name">打卡人</view>
        <view class="col time">最后打卡时间</view>
        <view class="col status">是否超时</view>
      </view>
      <view v-if="loaded && rows.length === 0" class="empty">还没有打卡记录</view>
      <view v-for="row in rows" :key="row.key" class="row">
        <view class="col date">{{ row.date }}</view>
        <view class="col name">{{ row.nickname }}</view>
        <view class="col time">{{ row.lastCheckin }}</view>
        <view class="col status">
          <view class="badge" :class="row.overtime ? 'late' : 'ok'">
            {{ row.overtime ? '超时' : '正常' }}
          </view>
        </view>
      </view>
    </view>
    <view class="dock">
      <sleep-tab current="records" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { ref } from 'vue'
import SleepTab from '../../components/sleep-tab/index.vue'
import { listRecords } from '../../services/sleep'
import { mapSleepRecords, type SleepRecordRow } from '../../utils/records'
import './index.scss'

const rows = ref<SleepRecordRow[]>([])
const loaded = ref(false)

useDidShow(() => {
  loadRecords()
})

async function loadRecords() {
  try {
    const data = await listRecords()
    rows.value = mapSleepRecords(data.records || [])
    loaded.value = true
  } catch (error) {
    const message = error instanceof Error ? error.message : '记录加载失败'
    Taro.showToast({ title: message, icon: 'none' })
  }
}
</script>
