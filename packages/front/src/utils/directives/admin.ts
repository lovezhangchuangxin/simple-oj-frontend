import { Directive } from 'vue'
import { useUserStore } from '../store'

// 管理员权限指令
const vAdmin: Directive = {
  mounted(el: HTMLElement) {
    const userStore = useUserStore()
    if (!isAdmin(userStore.role)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export const isAdmin = (role: number) => role === 1

export default vAdmin
