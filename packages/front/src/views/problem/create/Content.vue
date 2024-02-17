<template>
  <div class="problem-content">
    <p>以下表单最好都填</p>

    <form>
      <div>
        <h4>题目名称</h4>
        <el-input
          placeholder="请输入题目名称"
          v-model="content.title"
        ></el-input>
      </div>

      <div>
        <h4>题目描述</h4>
        <Editor
          :value="content.description"
          :plugins="plugins"
          @change="setDescription"
          style="width: 100%"
        />
      </div>

      <div>
        <h4>输入格式</h4>
        <Editor
          :value="content.inputFormat"
          :plugins="plugins"
          @change="setInputFormat"
          style="width: 100%"
        />
      </div>

      <div>
        <h4>输出格式</h4>
        <Editor
          :value="content.outputFormat"
          :plugins="plugins"
          @change="setOutputFormat"
          style="width: 100%"
        />
      </div>

      <div>
        <h4>样例组</h4>
        <div style="width: 100%">
          <el-button type="primary" :icon="Plus" @click.prevent="addSampleGroup"
            >添加</el-button
          >
        </div>
      </div>

      <div
        v-for="(sample, index) in content.sampleGroup"
        class="sample"
        :key="index"
      >
        <h4>
          样例 {{ index + 1 }}
          <el-button type="danger" @click.prevent="removeSampleGroup(index)"
            >删除</el-button
          >
        </h4>
        <div class="sample-box">
          <el-input
            v-model="sample.in"
            :rows="5"
            type="textarea"
            placeholder="Please input"
          />
          <el-input
            v-model="sample.out"
            :rows="5"
            type="textarea"
            placeholder="Please input"
          />
        </div>
      </div>

      <div>
        <h4>提示说明</h4>
        <Editor
          :value="content.hint"
          :plugins="plugins"
          @change="setHint"
          style="width: 100%"
        />
      </div>

      <div class="submit">
        <el-button type="primary" @click.prevent="submit">提交</el-button>
      </div>
    </form>

    <el-drawer v-model="drawer" direction="rtl" size="50%">
      <template #header>
        <h4>题目内容预览</h4>
      </template>
      <template #default>
        <MdViewer :value="md" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">提交</el-button>
        </div>
      </template>
    </el-drawer>
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

import { nextTick, reactive, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { message } from '@/utils/common/common'
import MdViewer from '@/components/md-viewer/MdViewer.vue'

const plugins = [gfm(), highlight(), math()]

interface ProblemContent {
  // 题目标题
  title: string
  // 题目描述
  description: string
  // 输入格式
  inputFormat: string
  // 输出格式
  outputFormat: string
  // 样例数据
  sampleGroup: { in: string; out: string }[]
  // 提示说明
  hint: string
}

// 题目内容
const content = reactive<ProblemContent>({
  title: '',
  description: '',
  inputFormat: '',
  outputFormat: '',
  sampleGroup: [{ in: '', out: '' }],
  hint: '',
})

const setContent = (
  key: Extract<
    keyof ProblemContent,
    'title' | 'description' | 'hint' | 'inputFormat' | 'outputFormat'
  >,
) => {
  return (value: string) => {
    content[key] = value
  }
}

const [_, setDescription, setHint, setInputFormat, setOutputFormat] = (
  ['title', 'description', 'hint', 'inputFormat', 'outputFormat'] as const
).map((key) => setContent(key))

// 新增样例
const addSampleGroup = () => {
  content.sampleGroup.push({ in: '', out: '' })
  // 新增样例并滚动到可视区，同时聚焦
  nextTick(() => {
    const sampleBox = document.querySelectorAll('.sample-box')
    const last = sampleBox[sampleBox.length - 1]
    last.scrollIntoView({ behavior: 'smooth' })
    last.querySelector('textarea')?.focus()
  })
}
// 删除样例
const removeSampleGroup = (index: number) => {
  content.sampleGroup.splice(index, 1)
}

watch(
  () => content,
  (value) => {
    console.log(value)
  },
)

const drawer = ref(false)
const md = ref('')

const getSampleHtml = (
  sample: ProblemContent['sampleGroup'][0],
  index: number,
) => {
  return `
<div class="sample">
    <div>
        <h4>输入#${index}</h4>
        <pre>${sample.in}</pre>
    </div>
    <div>
        <h4>输出#${index}</h4>
        <pre>${sample.out}</pre>
    </div>
</div>
    `
}

const getSampleGroupHtml = (sampleGroup: ProblemContent['sampleGroup']) => {
  const result = sampleGroup.reduce((pre, cur, index) => {
    return pre + getSampleHtml(cur, index)
  }, '')

  return result
}

const submit = () => {
  const { title, description, inputFormat, outputFormat, sampleGroup, hint } =
    content

  if (!title) {
    message.error('请输入题目名称')
    return
  }

  if (!description) {
    message.error('请输入题目描述')
    return
  }

  if (!inputFormat) {
    message.error('请输入输入格式')
    return
  }

  if (!outputFormat) {
    message.error('请输入输出格式')
    return
  }

  drawer.value = true
  md.value = `# ${title}

## 题目描述
${description}

## 输入格式
${inputFormat}

## 输出格式
${outputFormat}

## 样例

${getSampleGroupHtml(sampleGroup)}

## 提示说明
${hint}
`
}

const confirmClick = () => {
  drawer.value = false
}
</script>

<style scoped lang="less">
.problem-content {
  & > p {
    font-size: 18px;
    margin: 10px 0 20px;
    color: #0e121e;
  }

  form > div {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h4 {
      width: 100px;
      gap: 20px;
    }

    &.sample {
      h4 {
        width: 150px;
      }
    }

    .sample-box {
      display: flex;
      gap: 20px;
      width: 100%;
    }

    &.submit {
      justify-content: center;
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 10px;
}

:deep(.markdown-body) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    border: none;
  }

  .sample {
    display: flex;
    gap: 20px;

    & > div {
      flex: 1;
    }
  }
}
</style>
