import { req } from './core'

export interface ProblemNote {
  id: number
  title: string
  problemId: number
  authorId: number
  content: string
  // 收藏数
  collection: number
  // 状态，0 待审核 1 通过 2 未通过
  status: number
  createTime: string
  updateTime: string
}

export class ProblemNoteApi {
  /**
   * 根据 id 查询题解
   */
  public static getProblemNoteById(id: number) {
    return req<ProblemNote>('GET', `/problemNote/id`, { id })
  }

  /**
   * 查询自己的指定题目的题解
   */
  public static getMyProblemNoteByProblemId(problemId: number) {
    return req<ProblemNote>('GET', `/problemNote/my`, { problemId })
  }

  /**
   * 分页查询题目题解
   */
  public static queryProblemNoteByPage(
    problemId: number,
    page: number,
    limit: number,
    status?: number,
  ) {
    return req<{
      data: ProblemNote[]
      total: number
      userMap: Record<
        number,
        { username: string; avatar: string; role: number }
      >
    }>('GET', `/problemNote/list`, { problemId, page, limit, status })
  }

  /**
   * 添加题解
   */
  public static addProblemNote(
    problemNote: Pick<
      ProblemNote,
      'problemId' | 'authorId' | 'title' | 'content'
    >,
  ) {
    return req<undefined>('POST', `/problemNote/add`, {
      problemId: problemNote.problemId,
      authorId: problemNote.authorId,
      title: problemNote.title,
      content: problemNote.content,
    })
  }

  /**
   * 删除题解
   */
  public static deleteProblemNote(id: number) {
    return req<undefined>('GET', `/problemNote/delete`, { id })
  }

  /**
   * 更新题解
   */
  public static updateProblemNote(problemNote: Partial<ProblemNote>) {
    return req<undefined>('POST', `/problemNote/update`, problemNote)
  }
}
