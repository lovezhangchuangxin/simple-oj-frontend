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
    return req<string>('POST', '/user/login', user)
  }
}
