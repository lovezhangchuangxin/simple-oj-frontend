<template>
  <div class="problem-note-create">
    <div class="title">
      <span>题解标题：</span>
      <el-input
        v-model="title"
        style="width: 240px"
        placeholder="请输入题解标题"
      />
    </div>
    <Editor
      :value="content"
      :plugins="plugins"
      @change="setContent"
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
import { useState } from '@/utils/hooks/useState'
import { message } from '@/utils/common/common'
import { useRoute } from 'vue-router'
import { ProblemNote, ProblemNoteApi } from '@simple-oj-frontend/api'
import { useUserStore } from '@/utils/store'

const plugins = [gfm(), highlight(), math()]
const title = ref('')
const [content, setContent] = useState('')

const route = useRoute()
// 题解 id
const id = Number(route.query.id)
// 题目 id
const qid = parseInt(route.params.qid as string) || 0
// 是否是编辑状态
const isEdit = id > 0
const userStore = useUserStore()

onMounted(async () => {
  if (isEdit) {
    const res = await ProblemNoteApi.getProblemNoteById(id)
    if (res.code === 0) {
      title.value = res.data.title
      content.value = res.data.content
    }
  }
})

const submit = async () => {
  if (!title.value || !content.value) {
    message.error('标题和内容不能为空')
    return
  }

  const api = isEdit
    ? ProblemNoteApi.updateProblemNote
    : ProblemNoteApi.addProblemNote
  const opts: Pick<
    ProblemNote,
    'problemId' | 'title' | 'authorId' | 'content'
  > &
    Partial<ProblemNote> = {
    title: title.value,
    content: content.value,
    problemId: qid,
    authorId: userStore.id,
  }
  if (isEdit) {
    opts.id = id
  }
  const res = await api(opts)

  if (res.code === 0) {
    message.success('题解提交成功')
    return
  }

  message.error(res.msg)
}
</script>

<style scoped lang="less">
.problem-note-create {
  .title {
    margin-bottom: 20px;
  }

  :deep(.bytemd) {
    height: calc(100vh - 300px);
  }
}
</style>
