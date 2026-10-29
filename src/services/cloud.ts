import Taro from '@tarojs/taro'
import { CLOUD_BASE_URL, CLOUD_ENV, CLOUD_SERVICE } from '../config/cloud'

type CloudMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type CloudCall = {
  path: string
  method?: CloudMethod
  data?: Record<string, unknown>
}

let started = false

export function initCloud() {
  if (started || Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return
  Taro.cloud.init({ env: CLOUD_ENV })
  started = true
}

export async function uploadAvatar(filePath: string) {
  if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) {
    throw new Error('请在微信中选择头像')
  }
  initCloud()
  const suffix = Math.random().toString(36).slice(2, 8)
  const result = await Taro.cloud.uploadFile({
    cloudPath: `sleep-avatars/${Date.now()}-${suffix}.jpg`,
    filePath
  })
  if (!result.fileID) {
    throw new Error('头像上传失败')
  }
  return result.fileID
}

export async function callCloud<T>(options: CloudCall): Promise<T> {
  const method = options.method || 'GET'
  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    initCloud()
    const res = await Taro.cloud.callContainer({
      config: { env: CLOUD_ENV },
      path: options.path,
      method,
      header: {
        'X-WX-SERVICE': CLOUD_SERVICE
      },
      data: options.data
    })
    if (res.statusCode >= 400) {
      throw new Error(`云托管请求失败 ${res.statusCode}`)
    }
    return res.data as T
  }

  const res = await Taro.request<T>({
    url: `${CLOUD_BASE_URL}${options.path}`,
    method,
    header: {
      'content-type': 'application/json'
    },
    data: options.data
  })
  if (res.statusCode >= 400) {
    throw new Error(`请求失败 ${res.statusCode}`)
  }
  return res.data
}
