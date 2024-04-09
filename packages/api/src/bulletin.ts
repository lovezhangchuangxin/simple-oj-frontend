import { req } from './core'

export interface Bulletin {
  // 公告 id
  id: number
  // 公告标题
  title: string
  // 公告作者id
  authorId: number
  // 公告内容
  content: string
  // 创建时间
  createTime: string
  // 更新时间
  updateTime: string
}

export type BulletinBaseInfo = Omit<
  Bulletin,
  'id' | 'createTime' | 'updateTime'
>

export class BulletinApi {
  /**
   * 分页获取公告
   */
  public static getBulletins(page: number, limit: number) {
    return req<{
      data: Omit<Bulletin, 'content'>[]
      total: number
      user: {
        [key: number]: string
      }
    }>('GET', '/bulletin/list', { page, limit })
  }

  /**
   * 获取公告
   */
  public static getBulletinById(id: number) {
    return req<{
      data: Bulletin
      author: string
    }>('GET', `/bulletin/${id}`)
  }

  /**
   * 添加公告
   */
  public static addBulletin(data: BulletinBaseInfo) {
    return req<number>('POST', '/bulletin/add', data)
  }

  /**
   * 删除公告
   */
  public static deleteBulletin(id: number) {
    return req<undefined>('GET', `/bulletin/delete/${id}`)
  }

  /**
   * 更新公告
   */
  public static updateBulletin(content: Partial<Bulletin>) {
    return req<undefined>('POST', '/bulletin/update', content)
  }
}
