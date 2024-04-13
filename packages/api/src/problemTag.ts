import { req } from './core'

export class ProblemTagApi {
  /**
   * 查询问题对应的标签
   */
  public static queryTagByProblem(problemId: number) {
    return req<string>('GET', `/problemTag/problem/${problemId}`)
  }

  /**
   * 查询标签对应的问题
   */
  public static queryProblemByTag(tag: string) {
    return req<number[]>('GET', `/problemTag/tag/${tag}`)
  }

  /**
   * 添加标签
   */
  public static addTag(problemId: number, tag: string) {
    return req<undefined>('POST', `/problemTag/save`, {
      problemId,
      tag,
    })
  }

  /**
   * 删除标签
   */
  public static deleteTag(problemId: number, tag: string) {
    return req<undefined>('POST', `/problemTag/delete`, {
      problemId,
      tag,
    })
  }
}
