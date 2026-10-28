<template>
  <view class="page">
    <view class="table">
      <view class="row head">
        <view class="col date">日期</view>
        <view class="col name">打卡人</view>
        <view class="col time">最后打卡时间</view>
        <view class="col status">是否超时</view>
      </view>
      <view v-if="rows.length === 0" class="empty">还没有打卡记录</view>
      <view v-for="row in rows" :key="row.date" class="row">
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
  </view>
</template>

<script setup lang="ts">
import { useDidShow } from '@tarojs/taro'
import { ref } from 'vue'
import { getCheckins } from '../../services/store'
import { TIMEOUT_TIME, buildRows, type RecordRow } from '../../utils/records'
import './index.scss'

const rows = ref<RecordRow[]>(buildRows(getCheckins(), TIMEOUT_TIME))

useDidShow(() => {
  rows.value = buildRows(getCheckins(), TIMEOUT_TIME)
})
</script>
