<template>
  <div class="basic-info">
    <h2 class="title" @click="dialogVisible = true">编辑个人信息</h2>
    <p class="ellipsis"><b>昵称：</b>{{ username }}</p>
    <p class="ellipsis"><b>邮箱：</b>{{ email }}</p>
    <p class="ellipsis"><b>学号：</b>{{ studentId || '未填写' }}</p>
    <span @click="dialogVisible2 = true">修改密码</span>

    <el-dialog v-model="dialogVisible" title="编辑个人信息" width="500">
      <el-form
        ref="basicFormRef"
        :model="basicForm"
        :rules="basicFormRules"
        label-width="50px"
      >
        <el-form-item label="昵称" prop="username">
          <el-input v-model="basicForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="basicForm.email" />
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="basicForm.studentId" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitUserInfo" :loading="loading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible2" title="修改密码" width="500">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordFormRules"
        label-width="70px"
      >
        <el-form-item label="原密码" prop="password">
          <el-input v-model="passwordForm.password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input
            v-model="passwordForm.newPassword2"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel2">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="loading2"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { useUserStore } from '@/utils/store'
import { UserApi, UserInfo } from '@simple-oj-frontend/api'
import {
  validateUsername,
  validateEmail,
  ValidatorCallBack,
  validatePassword,
} from '@simple-oj-frontend/shared'
import { FormInstance, FormRules } from 'element-plus'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'

const userStore = useUserStore()
const { id, username, email, studentId } = storeToRefs(userStore)
const basicForm = reactive({
  username: username.value,
  email: email.value,
  studentId: studentId.value,
})
const passwordForm = reactive({
  password: '',
  newPassword: '',
  newPassword2: '',
})

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const loading = ref(false)
const loading2 = ref(false)
const basicFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const basicFormRules = reactive<FormRules<typeof basicForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
})

const validatePassword2 = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('密码不能为空')
  }

  if (passwordForm.password && value !== passwordForm.newPassword) {
    return callback('两次输入密码不一致')
  }

  callback()
}

const passwordFormRules = reactive<FormRules<typeof passwordForm>>({
  password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ validator: validatePassword, trigger: 'blur' }],
  newPassword2: [{ validator: validatePassword2, trigger: 'blur' }],
})

const cancel = () => {
  basicForm.username = username.value
  basicForm.email = email.value
  basicForm.studentId = studentId.value
  dialogVisible.value = false
}

const submitUserInfo = async () => {
  const partialInfo: Partial<UserInfo> & { id: number } = { id: id.value }
  if (basicForm.username !== username.value) {
    partialInfo.username = basicForm.username
  }
  if (basicForm.email !== email.value) {
    partialInfo.email = basicForm.email
  }
  if (basicForm.studentId !== studentId.value) {
    partialInfo.studentId = basicForm.studentId
  }

  if (Object.keys(partialInfo).length <= 1) {
    message({
      type: 'warning',
      message: '未修改任何信息',
    })
    dialogVisible.value = false
    return
  }

  loading.value = true
  const res = await UserApi.updateUserInfo(partialInfo)
  loading.value = false

  if (res.code === 0) {
    message.success('修改成功')
    userStore.setUserInfo(partialInfo)
    dialogVisible.value = false
  } else {
    message.error(res.msg)
  }
}

const cancel2 = () => {
  passwordForm.password = ''
  passwordForm.newPassword = ''
  passwordForm.newPassword2 = ''
  dialogVisible2.value = false
}

const changePassword = async () => {
  if (
    !passwordForm.password ||
    !passwordForm.newPassword ||
    !passwordForm.newPassword2
  ) {
    message.error('请填写完整信息')
    return
  }

  if (passwordForm.newPassword !== passwordForm.newPassword2) {
    message.error('两次输入密码不一致')
    return
  }

  console.log(passwordForm.password)

  loading2.value = true
  const res = await UserApi.updatePassword(
    passwordForm.password,
    passwordForm.newPassword,
  )
  loading2.value = false
  if (res.code === 0) {
    message.success('修改成功')
    cancel2()
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped lang="less">
.basic-info {
  .title {
    padding: 5px 10px;
    margin-bottom: 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #2db55d;
    background-color: #f0f9eb;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #e6f7e1;
    }
  }

  p {
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #616660;
  }

  span {
    margin-left: 5px;
    padding: 4px 8px;
    font-size: 12px;
    color: #f56c6c;
    background-color: #fcdad9;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #f7d5d4;
    }
  }
}
</style>
