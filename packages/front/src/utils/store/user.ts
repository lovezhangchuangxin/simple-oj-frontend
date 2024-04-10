import { UserInfo } from '@simple-oj-frontend/api'
import { defineStore } from 'pinia'

/**
 * 用户信息
 */
type PartialUserInfo = Pick<
  UserInfo,
  'id' | 'username' | 'avatar' | 'email' | 'role' | 'createTime' | 'updateTime'
>

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      id: 0,
      username: '',
      avatar: '',
      email: '',
      role: 0,
      createTime: '',
      updateTime: '',
    }) as PartialUserInfo,
  actions: {
    setUserInfo(info: Partial<PartialUserInfo>) {
      Object.assign(this, info)
    },
  },
})
