<template>
  <div class="bulletin-create">
    <div class="title">
      <span>请输入公告标题：</span>
      <el-input
        v-model="title"
        style="width: 240px"
        placeholder="Please input"
      />
    </div>
    <Editor
      :value="content"
      :plugins="plugins"
      @change="(value: string) => (content = value)"
      style="width: 100%"
    />
    <div style="text-align: center; margin-top: 20px">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Editor } from '@bytemd/vue-next'
// gfm 插件，支持任务列表、表格、删除线等
import gfm from '@bytemd/plugin-gfm'
// bytemd 样式
import 'bytemd/dist/index.css'
// github-markdown 样式
import 'github-markdown-css/github-markdown-light.css'
// 代码高亮
import highlight from '@bytemd/plugin-highlight'
import 'highlight.js/styles/default.css'
// 支持数学公式
import math from '@bytemd/plugin-math'
import 'katex/dist/katex.css'
import { onMounted, ref } from 'vue'
import {
  Bulletin,
  BulletinApi,
  BulletinBaseInfo,
} from '@simple-oj-frontend/api'
import { useUserStore } from '@/utils/store'
import { message } from '@/utils/common/common'
import { useRoute } from 'vue-router'

const plugins = [gfm(), highlight(), math()]
const title = ref('')
const content = ref('')
const userStore = useUserStore()
const route = useRoute()
const id = Number(route.query.id)
// 是否是编辑状态
const isEdit = id > 0

onMounted(async () => {
  if (isEdit) {
    const res = await BulletinApi.getBulletinById(id)
    if (res.code === 0) {
      title.value = res.data.data.title
      content.value = res.data.data.content
    }
  }
})

const submit = async () => {
  const api = isEdit ? BulletinApi.updateBulletin : BulletinApi.addBulletin
  const opts: BulletinBaseInfo & Partial<Bulletin> = {
    title: title.value,
    authorId: userStore.id,
    content: content.value,
  }
  if (isEdit) {
    opts.id = id
  }
  const res = await api(opts)

  if (res.code === 0) {
    message({
      message: '公告发布成功',
    })
    return
  }

  message({
    type: 'error',
    message: '公告发布失败',
  })
}
</script>

<style scoped lang="less">
.bulletin-create {
  .title {
    margin-bottom: 20px;
  }

  :deep(.bytemd) {
    height: calc(100vh - 300px);
  }
}
</style>
