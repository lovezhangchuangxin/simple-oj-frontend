<template>
  <div>
    <!-- <el-avatar shape="square" :size="75" :src="avatar || avatar2" /> -->
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :http-request="uploadAvatar"
    >
      <img v-if="avatar" :src="avatar" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { UploadRequestHandler } from 'element-plus'

import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/utils/store'
import { message } from '@/utils/common/common'
import { UserApi } from '@simple-oj-frontend/api'

const userStore = useUserStore()
const { avatar } = storeToRefs(userStore)

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
