<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<template>
  <view class="tab">
    <view
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ on: item.id === current }"
      @tap="onTap(item)"
    >
      <image class="icon" mode="aspectFit" :src="item.id === current ? item.iconOn : item.icon" />
      <view class="text">{{ item.label }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import './index.scss'

const props = defineProps<{
  current: 'checkin' | 'records' | 'fines'
}>()

const items = [
  {
    id: 'checkin',
    label: '打卡',
    url: '/pages/checkin/index',
    icon: '/assets/checkin.png',
    iconOn: '/assets/checkin-on.png'
  },
  {
    id: 'records',
    label: '记录',
    url: '/pages/records/index',
    icon: '/assets/records.png',
    iconOn: '/assets/records-on.png'
  },
  {
    id: 'fines',
    label: '统计',
    url: '/pages/fines/index',
    icon: '/assets/stats.png',
    iconOn: '/assets/stats-on.png'
  }
] as const

function onTap(item: (typeof items)[number]) {
  if (item.id === props.current) return
  Taro.redirectTo({ url: item.url })
}
</script>
