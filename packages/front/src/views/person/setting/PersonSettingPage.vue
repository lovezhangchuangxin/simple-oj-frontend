<template>
  <div class="person-setting">
    <!-- <el-avatar shape="square" :size="75" :src="avatar || avatar2" /> -->
    <div class="avatar">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="uploadAvatar"
      >
        <img v-if="avatar" :src="avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <div>
        <h2>
          <el-space>
            <span>{{ username }}</span>
            <el-tag type="primary" v-admin>管理员</el-tag>
          </el-space>
        </h2>
        <p>创建于 {{ formatTime(createTime) }}</p>
      </div>
    </div>

    <div class="submit">
      <p>
        过去一年共提交
        <span style="font-weight: 500">{{ submitCount }}</span> 次
      </p>
      <ContributionBox :from="from" :to="to" :data="contributionData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { UploadRequestHandler } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/utils/store'
import { formatTime, message } from '@/utils/common/common'
import { ProblemApi, UserApi } from '@simple-oj-frontend/api'
import vAdmin from '@/utils/directives/admin'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const { username, avatar, createTime } = storeToRefs(userStore)

const contributionData = ref<{ [day: string]: number }>({})
const end = Date.now()
const start = end - 12 * 30 * 1000 * 60 * 60 * 24
const to = new Date(end).toISOString().split('T')[0]
const from = new Date(start).toISOString().split('T')[0]
const submitCount = ref(0)

onMounted(async () => {
  // 获取最近一年的提交记录
  const res = await ProblemApi.getSubmitCountPerDayByTime(start, end)
  if (res.code !== 0) return
  contributionData.value = res.data
  submitCount.value = Object.values(res.data).reduce((acc, cur) => acc + cur, 0)
})

const uploadAvatar: UploadRequestHandler = async (option) => {
  const file = option.file

  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    message.error('图片格式错误!')
    return Promise.resolve(false)
  } else if (file.size / 1024 / 1024 > 2) {
    message.error('头像不能超过 2MB!')
    return Promise.resolve(false)
  }

  return UserApi.uploadFile(file).then((res) => {
    if (res.code !== 0) {
      message.error('上传失败')
      return false
    }
    message({
      type: 'success',
      message: '上传成功',
    })
    userStore.setUserInfo({ avatar: res.data })
  })
}
</script>

<style scoped lang="less">
@size: 75px;

.avatar-uploader .avatar {
  width: @size;
  height: @size;
  display: block;
}

.person-setting {
  padding: 10px;

  & > .avatar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    h2 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .submit {
    display: inline-block;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    p {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
</style>

<style lang="less">
@size: 75px;

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: @size;
  height: @size;
  text-align: center;
}
</style>
