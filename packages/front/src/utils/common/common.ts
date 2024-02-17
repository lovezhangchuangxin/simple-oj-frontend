import { ElMessage, MessageParams } from 'element-plus'

/**
 * 封装 element-plus 的 ElMessage
 */
type Message = ((config: MessageParams) => void) & {
  error: (msg: string) => void
}

export const message: Message = (config: MessageParams) => {
  config = Object.assign(
    {
      duration: 1500,
      type: 'success',
      grouping: true,
    },
    config,
  )

  ElMessage(config)
}

message.error = function (msg: string) {
  message({
    message: msg,
    type: 'error',
  })
}
