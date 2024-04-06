import { CodeExecuteStatus } from '@simple-oj-frontend/api'

// 不同执行状态对应的颜色
export const statusColorMap: { [status in CodeExecuteStatus]: string } = {
  [CodeExecuteStatus.AC]: '#67c23a',
  [CodeExecuteStatus.WA]: '#f56c6c',
  [CodeExecuteStatus.TLE]: '#f56c6c',
  [CodeExecuteStatus.MLE]: '#f56c6c',
  [CodeExecuteStatus.RE]: '#f56c6c',
  [CodeExecuteStatus.CE]: '#f56c6c',
}
