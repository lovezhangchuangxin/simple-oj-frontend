<template>
  <div class="class-setting-page">
    <div class="title">
      <h2>班级管理</h2>
      <el-button
        type="primary"
        @click="
          () => {
            dialogVisible = true
            isEdit = false
          }
        "
        >创建班级</el-button
      >
    </div>

    <ClassTable :editFunc="editClass" />

    <el-dialog v-model="dialogVisible" title="编辑班级信息" width="500">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="85px"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="班级简介" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="父班级代码" prop="parentId">
          <el-input v-model="form.parentId" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit" :loading="loading"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { ValidatorCallBack } from '@simple-oj-frontend/shared'
import {
  Class,
  ClassApi,
  classCodeToId,
  classIdToCode,
} from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'
import ClassTable from './ClassTable.vue'

const dialogVisible = ref(false)
const loading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<{
  name: string
  description?: string
  parentId?: string
}>({
  name: '',
  description: '',
  parentId: '',
})

const validateName = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('班级名称不能为空')
  }

  if (value.length > 30) {
    return callback('班级名称不能超过 30 个字符')
  }

  callback()
}

const validateDescription = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (value?.length > 100) {
    return callback('班级描述不能超过 100 个字符')
  }

  callback()
}

const formRules = reactive<FormRules<typeof form>>({
  name: [{ validator: validateName, trigger: 'blur' }],
  description: [{ validator: validateDescription, trigger: 'blur' }],
})

const editClass = (oldClass: Class) => {
  if (!oldClass) {
    message.error('未找到班级信息')
    return
  }
  dialogVisible.value = true
  form.name = oldClass.name
  form.description = oldClass.description
  form.parentId = oldClass.parentId
    ? classIdToCode(oldClass.parentId)
    : undefined
  isEdit.value = true
}

const cancel = () => {
  dialogVisible.value = false
}

const submit = async () => {
  if (
    validateName(0, form.name, (msg) => {
      if (msg) {
        message.error(msg as string)
        return true
      }
      return false
    })! ||
    validateDescription(0, form.name, (msg) => {
      if (msg) {
        message.error(msg as string)
        return true
      }
      return false
    })!
  ) {
    return
  }

  const api = isEdit.value ? ClassApi.updateClass : ClassApi.createClass
  const classData: Partial<Class> = {
    name: form.name,
    description: form.description || undefined,
    parentId: form.parentId ? classCodeToId(form.parentId) : undefined,
  }
  loading.value = true
  const res = await api(classData)
  loading.value = false
  if (res.code === 0) {
    message.success(isEdit.value ? '编辑成功' : '创建成功')
    cancel()
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped lang="less">
.class-setting-page {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;

    h2 {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .search {
    margin-bottom: 10px;
  }
}
</style>
