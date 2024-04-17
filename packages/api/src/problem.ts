/**
 * 题目相关接口
 */

import { Language } from '../../front/src/components/monaco-editor/constant'
import { req } from './core'

export interface Problem extends ProblemContent {
  // 题目 id
  id: number
  // 题目标签
  tag: string
  // 提交数
  submitCount: number
  // 通过数
  acceptCount: number
  // 创建时间
  createTime: string
  // 更新时间
  updateTime: string
}

export interface ProblemContent {
  // 题目作者
  authorId: number
  // 题目标题
  title: string
  // 题目描述
  description: string
  // 输入格式
  inputFormat: string
  // 输出格式
  outputFormat: string
  // 样例数据
  sampleGroup: { in: string; out: string }[]
  // 提示说明
  hint: string
  // 内存限制
  memoryLimit: number
  // 时间限制
  timeLimit: number
}

/**
 * 题目解决记录
 */
export interface ProblemSolveRecord {
  // 记录 id
  id: number
  // 题目 id
  problemId: number
  // 用户 id
  userId: number
  // 1: AC, 2: WA, 3: TLE, 4: MLE, 5: RE, 6: CE
  status: CodeExecuteStatus
  // 时间消耗
  timeCost: number
  // 内存消耗
  memoryCost: number
  // 提交语言
  language: string
  // 提交时间
  createTime: string
}

/**
 * 代码执行状态
 */
export enum CodeExecuteStatus {
  AC = 'AC',
  WA = 'WA',
  TLE = 'TLE',
  MLE = 'MLE',
  RE = 'RE',
  CE = 'CE',
}

/**
 * 题目简要信息
 */
export type ProblemBriefInfo = Pick<
  Problem,
  'id' | 'title' | 'tag' | 'submitCount' | 'acceptCount'
>

/**
 * 代码执行结果
 *
 * @deprecated 请使用 CodeResult
 */
export interface CodeExecuteResult {
  // 1: AC, 2: WA, 3: TLE, 4: MLE, 5: RE, 6: CE
  status: CodeExecuteStatus
  // 输出
  output: string
  // 错误
  error: string
  // 时间消耗
  time: number
  // 是否超时
  timeout: boolean
  // 内存消耗
  memory: number
}

/**
 * 代码执行结果（新）
 */
export interface CodeResult {
  cpu_time: number
  real_time: number
  memory: number
  signal: number
  exit_code: number
  error: string
  result: number
}

/**
 * 提交信息
 */
export interface SubmitBriefInfo {
  id: number
  problemId: number
  title: string
  time: number
  memory: number
  createTime: string
}

/**
 * 判断代码执行结果
 */
export function judgeCodeExecuteStatus(result: CodeResult): CodeExecuteStatus {
  switch (result.result) {
    case 1:
    case 2:
      return CodeExecuteStatus.TLE
    case 3:
      return CodeExecuteStatus.MLE
    case 4:
      return CodeExecuteStatus.RE
    case 6:
      return CodeExecuteStatus.WA
    default:
      return CodeExecuteStatus.AC
  }
}

export class ProblemApi {
  /**
   * 上传题目
   */
  public static createProblem(content: ProblemContent) {
    return req<number>('POST', '/problem/create', content)
  }

  /**
   * 分页获取题目列表
   */
  public static getProblemList(page: number, limit: number) {
    return req<{
      problems: ProblemBriefInfo[]
      ids: number[]
      total: number
    }>('GET', '/problem/list', { page, limit })
  }

  /**
   * 获取题目
   */
  public static getProblemById(id: number) {
    return req<Problem>('GET', `/problem/${id}`)
  }

  /**
   * 删除题目
   */
  public static deleteProblem(id: number) {
    return req<undefined>('GET', `/problem/delete/${id}`)
  }

  /**
   * 更新题目
   */
  public static updateProblem(
    content: Partial<ProblemContent & { tag: string; description: string }> & {
      id: number
    },
  ) {
    return req<undefined>('POST', `/problem/update`, content)
  }

  /**
   * 提交代码
   */
  public static submitCode(
    problemId: number,
    code: string,
    language: Language,
  ) {
    return req<{ stat: CodeResult; output?: string }[]>(
      'POST',
      `/problem/submitCode`,
      {
        problemId,
        code,
        language,
      },
    )
  }

  /**
   * 查询一段时间范围内每天的提交记录数
   */
  public static getSubmitCountPerDayByTime(startTime: number, endTime: number) {
    return req<{
      accept: number
      other: number
      collect: { [day: string]: number }
    }>('GET', `/problem/recordByTimeRange`, {
      startTime,
      endTime,
    })
  }

  /**
   * 查询最近通过的提交记录
   */
  public static getRecentAcceptRecord(limit = 10) {
    return req<SubmitBriefInfo[]>('GET', `/problem/recentAcceptRecord`, {
      limit,
    })
  }
}
