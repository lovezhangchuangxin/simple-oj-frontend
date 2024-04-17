<template>
  <div class="chat-api-setting">
    <h2 class="title" @click="dialogVisible = true">
      {{ apiKey ? '修改' : '添加' }}
      GPT API
    </h2>
    <el-dialog
      v-model="dialogVisible"
      :title="`${apiKey ? '修改' : '添加'} GPT API`"
      width="500"
    >
      <p>
        参见
        <a
          href="https://github.com/chatanywhere/GPT_API_free?tab=readme-ov-file#%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8"
          target="_blank"
          >GPT_API_free</a
        >
        项目，申请免费的 <span style="color: brown">API key</span> 并添加到下方
      </p>
      <p>
        该 key 存于用户浏览器中，可用于
        <span>代码编译错误的智能分析</span> 等功能
      </p>

      <el-input v-model="newApiKey" placeholder="请输入 API key" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="saveApiKey"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { readGPTApiKey, saveGPTApiKey } from '@simple-oj-frontend/api'
import { ref } from 'vue'

const dialogVisible = ref(false)
const apiKey = ref(readGPTApiKey() || '')
const newApiKey = ref(apiKey.value)

const cancel = () => {
  newApiKey.value = apiKey.value
  dialogVisible.value = false
}

const saveApiKey = () => {
  if (!newApiKey.value) {
    message.error('请输入 API key')
    return
  }
  saveGPTApiKey(newApiKey.value)
  apiKey.value = newApiKey.value
  dialogVisible.value = false
  message.success('保存成功')
}
</script>

<style scoped lang="less">
.chat-api-setting {
  .title {
    padding: 5px 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #8f2db5;
    background-color: #f9ebf0;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #f7e1e6;
    }
  }

  p {
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #666266;
  }

  span {
    font-weight: 700;
  }
}
</style>
