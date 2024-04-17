/**
 * 用户相关接口
 */

import { req } from './core'

/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  username: string
  password: string
  email: string
  avatar: string
  // 学号
  studentId: string
  // 角色，0 普通用户，1 管理员
  role: number
  createTime: string
  updateTime: string
}

export class UserApi {
  /**
   * 发送验证码
   *
   * @param email 邮箱
   */
  public static sendVerification(email: UserInfo['email']) {
    return req<null>('POST', '/user/verification', { email })
  }

  /**
   * 注册
   *
   * @param user 学生部分信息，只需要 username, password, email
   * @param verification 验证码
   */
  public static register(
    user: Pick<UserInfo, 'username' | 'password' | 'email'>,
    verification: string,
  ) {
    return req<null>('POST', `/user/register/${verification}`, user)
  }

  /**
   * 登录
   *
   * @param user 学生部分信息，password 必需，username 或 email 二选一
   * @returns token
   */
  public static login(
    user:
      | Pick<UserInfo, 'username' | 'password'>
      | Pick<UserInfo, 'email' | 'password'>,
  ) {
    return req<{
      token: string
      user: Omit<UserInfo, 'password'>
    }>('POST', '/user/login', user)
  }

  /**
   * 获取用户信息
   */
  public static getUserInfo() {
    return req<Omit<UserInfo, 'password'>>('GET', '/user/info')
  }

  /**
   * 上传文件
   */
  public static uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return req<string>('POST', '/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  /**
   * 修改用户信息
   */
  public static updateUserInfo(
    user: Partial<Omit<UserInfo, 'password'>> & { id: number },
  ) {
    return req<undefined>('POST', '/user/update', user)
  }

  /**
   * 修改密码
   */
  public static updatePassword(oldPassword: string, newPassword: string) {
    return req<undefined>('POST', '/user/updatePassword', {
      oldPassword,
      newPassword,
    })
  }
}
