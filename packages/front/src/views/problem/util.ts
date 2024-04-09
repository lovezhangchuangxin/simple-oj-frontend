import { ProblemShowItem } from '@/components/problem-list/ProblemList.vue'
import { CodeExecuteStatus, ProblemBriefInfo } from '@simple-oj-frontend/api'

// 不同执行状态对应的颜色
export const statusColorMap: { [status in CodeExecuteStatus]: string } = {
  [CodeExecuteStatus.AC]: '#67c23a',
  [CodeExecuteStatus.WA]: '#f56c6c',
  [CodeExecuteStatus.TLE]: '#f56c6c',
  [CodeExecuteStatus.MLE]: '#f56c6c',
  [CodeExecuteStatus.RE]: '#f56c6c',
  [CodeExecuteStatus.CE]: '#f56c6c',
}

export const getProblemTableData = ({
  problems,
  ids,
}: {
  problems: ProblemBriefInfo[]
  ids: number[]
}) => {
  const idsSet = new Set(ids)
  return problems.map((problem) => {
    const { id, title, tag } = problem
    let { submitCount, acceptCount } = problem
    if (!submitCount) submitCount = 2
    if (!acceptCount) acceptCount = 1

    const passRate = acceptCount / submitCount
    const difficulty =
      passRate > 0.5 ? '简单' : passRate > 0.3 ? '中等' : '困难'

    return {
      status: idsSet.has(problem.id) ? 2 : 0,
      id,
      title,
      tag,
      difficulty,
      passRate,
    } as ProblemShowItem
  })
}
