<template>
  <div class="class-page">
    <div class="my-class">
      <div class="header">
        <span class="title">我的班级</span>
        <el-button type="primary" @click="joinClass">加入班级</el-button>
      </div>
      <ul class="list">
        <li v-for="aClass in myClasses" :key="aClass.id">
          <p class="name">
            {{ aClass.name }}
          </p>
          <p class="desc">
            {{ aClass.description }}
          </p>
          <p class="time">创建时间：{{ formatTime(aClass.createTime) }}</p>
        </li>
      </ul>

      <el-dialog v-model="dialogVisible" title="编辑班级信息" width="400">
        <el-space>
          班级码：<el-input v-model="classCode" style="width: 300px" />
        </el-space>

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
  </div>
</template>

<script setup lang="ts">
import { formatTime, message } from '@/utils/common/common'
import { useUserStore } from '@/utils/store'
import { Class, ClassApi, classCodeToId } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const userId = userStore.id
const myClasses = ref<Class[]>([])
const dialogVisible = ref(false)
const loading = ref(false)
const classCode = ref('')

onMounted(async () => {
  const res = await ClassApi.getClassesByUserId(userId)
  console.log(res)
  if (res.code === 0) {
    myClasses.value = res.data
  }
})

const joinClass = () => {
  dialogVisible.value = true
}

const cancel = () => {
  dialogVisible.value = false
}

const submit = async () => {
  if (!classCode.value) {
    message.error('请输入班级码')
    return
  }

  loading.value = true
  const res = await ClassApi.addClassUser(
    classCodeToId(classCode.value),
    userId,
  )
  loading.value = false

  if (res.code === 0) {
    dialogVisible.value = false
    message.success(res.msg)
    return
  }

  message.error(res.msg)
}
</script>

<style scoped lang="less">
.class-page {
  padding: 10px 40px;

  .my-class {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        color: #231c2c;
      }
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      li {
        padding: 10px;
        border: 1px solid #ebeef5;
        border-radius: 10px;
        width: 300px;
        list-style: none;
        background-color: #f5f7fa;

        .name {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
          text-align: center;
        }

        .desc {
          margin-top: 10px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #606266;
          text-align: center;
        }

        .time {
          margin-top: 10px;
          font-size: 12px;
          color: #606266;
          text-align: center;
        }
      }
    }
  }
}
</style>
