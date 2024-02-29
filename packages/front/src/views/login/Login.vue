<template>
  <div>
    <!-- 登录注册框 -->
    <div class="loginbox">
      <!-- 标题 -->
      <div class="title">
        <img :src="hustpng" alt="hust-icon" class="hust-logo" />
        <el-row>
          <el-text class="mx-1" type="primary" size="large">
            Simple OJ, a simple online judge system
          </el-text>
        </el-row>
      </div>

      <template v-if="formType == 'login'">
        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.usernameOrEmail"
              placeholder="请输入用户名或者邮箱"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit(loginFormRef)"
              class="submit-btn"
              >登录</el-button
            >
          </el-form-item>
          <el-link type="primary" href>忘记密码</el-link>
        </el-form>
      </template>
      <template v-else>
        <!-- 注册表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="left"
          label-width="70px"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名或者邮箱"
              autofocus
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input
              type="password"
              v-model="registerForm.password2"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="verification" class="verification">
            <el-input
              v-model="registerForm.verification"
              placeholder="请输入邮箱验证码"
            />
            <el-button
              type="primary"
              @click="sendVerification(registerForm.email)"
              :disabled="isVerifyBtnDisabled"
              >{{ verifyBtnText }}</el-button
            >
          </el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(registerFormRef)"
            class="submit-btn"
            >注册</el-button
          >
        </el-form>
      </template>

      <div class="bottom">
        <el-space :size="2"
          ><el-text class="mx-1">{{
            formType == 'login' ? '没有账号？' : '已有账号？'
          }}</el-text
          ><el-link type="primary" @click="changeFormType">{{
            formType == 'login' ? '注册' : '登录'
          }}</el-link></el-space
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import hustpng from '@/assets/images/hust.png'
import { type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { message } from '@/utils/common/common'
import { useState } from '@/utils/hooks/useState'
import { useVerification } from '@/utils/hooks/useVerification'
import { UserApi } from '@simple-oj-frontend/api'
import { Validator } from '@simple-oj-frontend/shared'
import { useUserStore } from '@/utils/store'
import { useRouter } from 'vue-router'

const [formType, setFormType] = useState<'login' | 'register'>('login')
const changeFormType = () => {
  setFormType(formType.value === 'login' ? 'register' : 'login')
}

const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const { isVerifyBtnDisabled, verifyBtnText, sendVerification } =
  useVerification()

const loginForm = reactive({
  usernameOrEmail: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  password2: '',
  email: '',
  verification: '',
})

type ValidatorCallBack = (error?: string | Error) => void

const validateUsernameOrEmail = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('用户名不能为空')
  }

  if (!Validator.isUsername(value) && !Validator.isEmail(value)) {
    return callback('用户名或邮箱错误')
  }

  callback()
}

const validateUsername = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('用户名不能为空')
  }

  if (!Validator.isUsername(value)) {
    return callback('仅支持中文、字母和数字，且长度为4到16')
  }

  callback()
}

const validatePassword = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('密码不能为空')
  }

  if (!Validator.isPassword(value)) {
    return callback('仅支持字母、数字，且长度为6到16')
  }

  callback()
}

const validatePassword2 = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('密码不能为空')
  }

  if (registerForm.password && value !== registerForm.password) {
    return callback('两次输入密码不一致')
  }

  callback()
}

const validateEmail = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('邮箱不能为空')
  }

  if (!Validator.isEmail(value)) {
    return callback('不支持该邮箱格式')
  }

  callback()
}

const validateVerification = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('验证码不能为空')
  }

  callback()
}

const loginRules = reactive<FormRules<typeof loginForm>>({
  usernameOrEmail: [{ validator: validateUsernameOrEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
})

const registerRules = reactive<FormRules<typeof registerForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  password2: [{ validator: validatePassword2, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  verification: [{ validator: validateVerification, trigger: 'blur' }],
})

const userStore = useUserStore()
const router = useRouter()

const onSubmit = (formEle?: FormInstance) => {
  if (!formEle) return

  formEle.validate(async (valid) => {
    if (valid) {
      if (formType.value === 'login') {
        const params = Validator.isUsername(loginForm.usernameOrEmail)
          ? {
              username: loginForm.usernameOrEmail,
              password: loginForm.password,
            }
          : { email: loginForm.usernameOrEmail, password: loginForm.password }
        const res = await UserApi.login(params)

        if (res.code === 0) {
          message({
            message: res.msg,
          })
          const { token, user } = res.data
          localStorage.setItem('token', token)
          userStore.setUserInfo(user)
          router.push('/')
        } else {
          message({
            message: res.msg,
            type: 'error',
          })
          return false
        }
      } else {
        const res = await UserApi.register(
          registerForm,
          registerForm.verification,
        )
        if (res.code === 0) {
          message({
            message: res.msg,
          })
          setFormType('login')
        } else {
          message({
            message: res.msg,
            type: 'error',
          })
          return false
        }
      }
    } else {
      message({
        message: '格式错误',
        type: 'error',
      })
      return false
    }
  })
}
</script>

<style scoped lang="less">
.loginbox {
  margin: 30px auto;
  padding: 20px 0;
  width: 380px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px 30px 30px;

    .hust-logo {
      display: block;
      width: 80%;
    }
  }

  .el-form {
    padding: 0 30px;

    button.submit-btn {
      margin-top: 10px;
      width: 100%;
    }

    .verification {
      :deep(.el-form-item__content) {
        flex-wrap: nowrap;
        justify-content: space-between;
        gap: 6px;
      }
    }
  }

  .bottom {
    padding: 10px;
    margin: 0;
    text-align: center;
  }
}
</style>
