/**
 * 验证器
 */
export class Validator {
  /**
   * 验证邮箱
   */
  public static isEmail(email: string) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
  }

  /**
   * 验证用户名
   */
  public static isUsername(username: string) {
    return /^[\u4e00-\u9fa5_a-zA-Z0-9-]{4,16}$/.test(username)
  }

  /**
   * 验证密码
   */
  public static isPassword(password: string) {
    return /^[a-zA-Z0-9_-]{6,18}$/.test(password)
  }
}
