<template>
  <view class="page" :class="{ 'page-profile': showProfile }">
    <form v-if="showProfile" class="profile" @submit="onSave">
      <view class="profile-title">填写资料</view>
      <view class="profile-hint">头像和昵称会显示在打卡记录里。</view>
      <view class="avatar-block">
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image v-if="avatarPreview" class="avatar-img" mode="aspectFill" :src="avatarPreview" />
          <view v-else class="avatar-placeholder">选择头像</view>
        </button>
        <view v-if="avatarError" class="profile-error avatar-error">{{ avatarError }}</view>
      </view>
      <input
        class="profile-input"
        type="nickname"
        name="nickname"
        placeholder="微信昵称"
        :value="draft"
        @input="onNameInput"
      />
      <view v-if="nameError" class="profile-error">{{ nameError }}</view>
      <button class="profile-btn" form-type="submit">保存</button>
    </form>
    <view v-else-if="ready" class="grid">
      <view
        v-for="app in apps"
        :key="app.id"
        class="cell"
        hover-class="cell-hover"
        @tap="onOpen(app.url)"
      >
        <view class="icon">
          <view class="moon">
            <view class="moon-cut"></view>
          </view>
        </view>
        <view class="label">{{ app.name }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref } from 'vue'
import { uploadAvatar } from '../../services/cloud'
import { getAvatarUrl, getNickname, saveAvatarUrl, saveNickname } from '../../services/store'
import './index.scss'

const apps = [
  { id: 'checkin', name: '入睡打卡', url: '/pages/checkin/index' }
]

const ready = ref(false)
const savedNickname = ref('')
const savedAvatar = ref('')
const draft = ref('')
const avatarFileId = ref('')
const avatarPreview = ref('')
const nameError = ref('')
const avatarError = ref('')
const uploading = ref(false)
let chooseSeq = 0

const showProfile = computed(() => ready.value && (!savedNickname.value || !savedAvatar.value))

useDidShow(() => {
  savedNickname.value = getNickname()
  savedAvatar.value = getAvatarUrl()
  draft.value = savedNickname.value
  avatarFileId.value = savedAvatar.value
  avatarPreview.value = savedAvatar.value
  ready.value = true
})

function onOpen(url: string) {
  Taro.navigateTo({ url })
}

function onNameInput(event: { detail?: { value?: string } }) {
  draft.value = event.detail?.value || ''
  nameError.value = ''
}

async function onChooseAvatar(event: { detail?: { avatarUrl?: string } }) {
  const filePath = event.detail?.avatarUrl || ''
  if (!filePath) return
  const previousId = avatarFileId.value
  const previousPreview = avatarPreview.value
  const seq = ++chooseSeq
  avatarPreview.value = filePath
  avatarError.value = ''
  uploading.value = true
  try {
    const fileID = await uploadAvatar(filePath)
    if (seq !== chooseSeq) return
    avatarFileId.value = fileID
    avatarPreview.value = fileID
  } catch (error) {
    if (seq !== chooseSeq) return
    avatarFileId.value = previousId
    avatarPreview.value = previousPreview
    const message = error instanceof Error ? error.message : '头像上传失败'
    Taro.showToast({ title: message, icon: 'none' })
  } finally {
    if (seq === chooseSeq) uploading.value = false
  }
}

function onSave(event: { detail?: { value?: { nickname?: string } } }) {
  if (uploading.value) {
    Taro.showToast({ title: '头像上传中', icon: 'none' })
    return
  }
  const fromForm = event.detail?.value?.nickname || ''
  const name = (fromForm || draft.value).trim()
  const avatar = avatarFileId.value.trim()
  nameError.value = name ? '' : '请填写昵称'
  avatarError.value = avatar ? '' : '请选择头像'
  if (!name || !avatar) return
  saveNickname(name)
  saveAvatarUrl(avatar)
  savedNickname.value = name
  savedAvatar.value = avatar
  draft.value = name
}
</script>
