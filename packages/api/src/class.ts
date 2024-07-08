import { req } from './core'

export interface Class {
  // 班级 id
  id: number
  // 班级名称
  name: string
  // 班级简介
  description?: string
  // 创建者 id
  creatorId: number
  // 父班级 id
  parentId?: number
  // 创建时间
  createTime: string
  // 更新时间
  updateTime: string
}

export interface ClassInfo extends Class {
  users: number[]
  classes: ClassInfo[]
}

/**
 * 将 id 转换为英文字符串
 */
export function classIdToCode(id: number) {
  return (1e9 - id).toString(36).toUpperCase()
}

/**
 * 将英文字符串转换为 id
 */
export function classCodeToId(code: string) {
  return 1e9 - parseInt(code, 36)
}

export class ClassApi {
  /**
   * 分页获取班级
   */
  public static getClasses(
    page: number,
    limit: number,
    data: { name?: string; creator?: string; id?: number },
  ) {
    return req<{
      data: Class[]
      total: number
      user: {
        [key: number]: string
      }
    }>('GET', '/class/recordByCondition', { page, limit, ...data })
  }

  /**
   * 创建班级
   */
  public static createClass(
    data: Partial<Omit<Class, 'id' | 'createTime' | 'updateTime'>>,
  ) {
    return req<number>('POST', '/class/create', data)
  }

  /**
   * 删除班级
   */
  public static deleteClass(id: number) {
    return req<undefined>('GET', `/class/delete/${id}`)
  }

  /**
   * 更新班级
   */
  public static updateClass(data: Partial<Class>) {
    return req<undefined>('POST', '/class/update', data)
  }

  /**
   * 添加班级用户
   */
  public static addClassUser(classId: number, userId: number) {
    return req<undefined>('POST', '/class/addClassUser', { classId, userId })
  }

  /**
   * 删除班级用户
   */
  public static removeClassUser(classId: number, userId: number) {
    return req<undefined>('GET', `/class/deleteClassUser/${classId}/${userId}`)
  }

  /**
   * 查询一个班级中所有的班级和用户
   */
  public static listClassUserByClassId(classId: number) {
    return req<{
      class: ClassInfo
      user: Record<
        number,
        {
          name: string
          avatar: string
        }
      >
    }>(`GET`, `/class/listClassUserByClassId/${classId}`)
  }

  /**
   * 查询用户所属的班级
   */
  public static getClassesByUserId(userId: number) {
    return req<Class[]>(`GET`, `/class/getClassesByUserId/${userId}`)
  }
}
