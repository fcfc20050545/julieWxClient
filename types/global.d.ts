/// <reference types="@tarojs/taro" />

declare module '*.png'
declare module '*.scss'
declare module '*.css'

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'qq' | 'jd'
  }
}
