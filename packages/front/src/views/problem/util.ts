import { ProblemShowItem } from '@/components/problem-list/ProblemList.vue'
import { CodeExecuteStatus, ProblemBriefInfo } from '@simple-oj-frontend/api'

// 不同执行状态对应的颜色
export const statusColorMap: { [status in CodeExecuteStatus]: string } = {
  [CodeExecuteStatus.AC]: '#67c23a',
  [CodeExecuteStatus.WA]: '#f56c6c',
  [CodeExecuteStatus.TLE]: '#2e468c',
  [CodeExecuteStatus.MLE]: '#2e468c',
  [CodeExecuteStatus.RE]: '#8e44ad',
  [CodeExecuteStatus.CE]: '#f1c40f',
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
    const { id, title, tag, difficulty } = problem
    let { submitCount, acceptCount } = problem
    // 初始无数据时防止除零
    if (!submitCount) submitCount = 2
    if (!acceptCount) acceptCount = 1

    const passRate = Number((acceptCount / submitCount).toFixed(2))
    let difficultyStr = '无'
    if (difficulty === 1) {
      difficultyStr = '简单'
    } else if (difficulty === 2) {
      difficultyStr = '中等'
    } else if (difficulty === 3) {
      difficultyStr = '困难'
    }

    return {
      status: idsSet.has(problem.id) ? 2 : 0,
      id,
      title,
      tag,
      difficulty: difficultyStr,
      passRate,
    } as ProblemShowItem
  })
}
