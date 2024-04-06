<template>
  <div class="problem-solve-page">
    <splitpanes class="default-theme">
      <pane size="45">
        <el-scrollbar>
          <div class="viewer-wrapper" style="min-width: 400px; overflow: auto">
            <MdViewer :value="content"></MdViewer>
          </div>
        </el-scrollbar>
      </pane>
      <pane size="55">
        <splitpanes horizontal>
          <pane size="100">
            <CodeEditor
              v-model="code"
              v-model:lang="lang"
              :codeStoragePreKey="`code_${qid}`"
            />
          </pane>
          <pane size="30">
            <el-button type="primary" @click="submitCode" :loading="loading"
              >提交</el-button
            >
            <div class="result">
              <div
                class="result-item"
                v-for="(result, index) in results"
                :key="index"
                :style="{ backgroundColor: statusColorMap[result.status] }"
              >
                <div>
                  <h4>
                    {{ CodeExecuteStatus[result.status] }}
                  </h4>
                  <p>{{ result.time }}ms {{ result.memory }}MB</p>
                </div>
              </div>
            </div>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import MdViewer from '@/components/md-viewer/MdViewer.vue'
import CodeEditor from '@/components/monaco-editor/CodeEditor.vue'
import {
  LANGUAGE_TYPE_MAP,
  LanguageName,
} from '@/components/monaco-editor/constant'
import { generateMd } from '../create/generateMd'
import {
  CodeExecuteResult,
  CodeExecuteStatus,
  ProblemApi,
} from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'
import { statusColorMap } from './util'
// import MonacoEditor from '@/components/monaco-editor/MonacoEditor.vue'

const route = useRoute()

// 题目 id
const qid = parseInt(route.params.qid as string) || 0

const content = ref('')
const lang = ref<LanguageName>('C')
const code = ref('')
const results = ref<CodeExecuteResult[]>([])
const loading = ref(false)

onMounted(async () => {
  if (!qid) {
    message.error('题目 id 不存在')
    return
  }

  const res = await ProblemApi.getProblem(qid)
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  content.value = generateMd(res.data)
})

const submitCode = async () => {
  loading.value = true
  const res = await ProblemApi.submitCode(
    qid,
    code.value,
    LANGUAGE_TYPE_MAP[lang.value],
  )

  if (res.code !== 0) {
    message.error(res.msg)
    return
  }

  results.value = res.data
  loading.value = false
}
</script>

<style scoped lang="less">
.problem-solve-page {
  height: calc(100vh - 108px);

  :deep(.splitpanes__pane) {
    background-color: #ffffff;
  }

  :deep(.splitpanes__splitter) {
    background-color: #f0f0f0;

    &:hover {
      background-color: #d5d5d5;
    }
  }

  .result {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;

    .result-item {
      flex: 0 0 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      text-align: center;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
    }
  }
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
