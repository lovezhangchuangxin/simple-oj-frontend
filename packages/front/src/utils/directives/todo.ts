import { Directive } from 'vue'
import { message } from '../common/common'

// 目前未完成但将要做的时
const vTodo: Directive = {
  mounted(el: HTMLElement) {
    el.onclick = () => {
      message({
        type: 'info',
        message: '功能开发中，敬请期待！',
      })
    }
  },
}

export default vTodo
