<template>
  <div class="problem-solve-page">
    <splitpanes class="default-theme">
      <pane size="45">
        <el-scrollbar>
          <el-tabs v-model="activeName" class="problem-tabs">
            <el-tab-pane label="题目内容" name="content">
              <ProblemContent :content="content" />
            </el-tab-pane>
            <el-tab-pane label="题解" name="note" lazy>
              <ProblemNote
                :problemId="qid"
                :acceptNote="!!problem?.acceptNote"
              />
            </el-tab-pane>
            <el-tab-pane label="提交记录" name="submit" lazy>
              <ProblemSubmitRecord />
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </pane>
      <pane size="55">
        <splitpanes horizontal>
          <pane size="100" style="overflow: hidden">
            <CodeEditor
              v-model="code"
              v-model:lang="lang"
              :codeStoragePreKey="`code_${qid}`"
            />
          </pane>
          <pane size="70">
            <div class="result-show">
              <div class="submit">
                <el-button type="primary" @click="submitCode" :loading="loading"
                  >提交</el-button
                >
              </div>
              <el-dialog v-model="dialogVisible" title="评测结果" width="800">
                <div class="result-list">
                  <div
                    class="result-item"
                    v-for="(result, index) in results"
                    :key="index"
                    :style="{
                      backgroundColor:
                        statusColorMap[judgeCodeExecuteStatus(result.stat)],
                    }"
                  >
                    <div>
                      <h4>
                        {{ judgeCodeExecuteStatus(result.stat) }}
                      </h4>
                      <p>
                        {{ result.stat.real_time }}ms
                        {{ (result.stat.memory / 1024 / 1024).toFixed(2) }}MB
                      </p>
                    </div>
                  </div>
                </div>
              </el-dialog>

              <el-tabs class="result-tabs">
                <!-- 注意：result 解构出来后会失去响应式！ -->
                <el-tab-pane
                  v-for="(result, index) in results"
                  :label="`样例 ${index + 1}`"
                  :key="index"
                >
                  <template #label>
                    <span
                      :style="{
                        color: getTagColor(results[index]),
                        fontWeight: 700,
                      }"
                    >
                      样例 {{ index + 1 }}
                    </span>
                  </template>
                  <div class="result-tab">
                    <template v-if="problem?.sampleGroup[index].in">
                      <p>输入</p>
                      <div>
                        <pre v-text="problem?.sampleGroup[index].in"></pre>
                      </div>
                    </template>
                    <p>实际输出</p>
                    <div>
                      <pre
                        v-text="
                          result.stat.result
                            ? result.output! || '无'
                            : problem?.sampleGroup[index].out
                        "
                      ></pre>
                    </div>
                    <p>预期输出</p>
                    <div>
                      <pre v-text="problem?.sampleGroup[index].out"></pre>
                    </div>
                    <template v-if="result.stat.result">
                      <p>结果差异</p>
                      <div>
                        <pre
                          class="diff"
                          :data-index="index"
                          ref="diffRef"
                        ></pre>
                      </div>
                    </template>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="complie-error" v-show="complieError">
                <p style="color: red">编译错误：</p>
                <pre v-text="complieError"></pre>
                <p v-if="apiKey" style="color: green">提示：</p>
                <MdViewer :value="gptAnalysis"></MdViewer>
              </div>
            </div>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import CodeEditor from '@/components/monaco-editor/CodeEditor.vue'
import {
  LANGUAGE_TYPE_MAP,
  LanguageName,
} from '@/components/monaco-editor/constant'
import { generateMd } from '../create/generateMd'
import {
  CodeResult,
  GPTApi,
  Problem,
  ProblemApi,
  judgeCodeExecuteStatus,
  readGPTApiKey,
} from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'
import { statusColorMap } from '../util'
import { diffChars } from 'diff'
import ProblemContent from './ProblemContent.vue'
import ProblemNote from './ProblemNote.vue'
import ProblemSubmitRecord from './ProblemSubmitRecord.vue'

const route = useRoute()
const router = useRouter()
// 题目 id
const qid = parseInt(route.params.qid as string) || 0
const tab = route.query.tab as string
const activeName = ref(tab || 'content')
const problem = ref<Problem | null>(null)
const content = ref('')
const lang = ref<LanguageName>('C')
const code = ref('')
const results = ref<{ stat: CodeResult; output?: string }[]>([])
const complieError = ref('')
const loading = ref(false)
const diffRef = ref<HTMLPreElement[]>([])
const dialogVisible = ref(false)
const apiKey = readGPTApiKey()
const gptAnalysis = ref('')

onMounted(async () => {
  if (!qid) {
    message.error('题目 id 不存在')
    return
  }

  const res = await ProblemApi.getProblemById(qid)
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  problem.value = res.data
  content.value = generateMd(res.data, res.data.id)
})

watch(activeName, (name) => {
  router.push({
    query: {
      tab: name,
    },
  })
})

const submitCode = async () => {
  loading.value = true
  const res = await ProblemApi.submitCode(
    qid,
    code.value,
    LANGUAGE_TYPE_MAP[lang.value],
  )

  loading.value = false

  if (res.code !== 0) {
    message.error(res.msg)
    results.value = []
    let error = res.data as unknown as string
    // 将错误信息中的多余的路径信息去掉
    error = error.replace(/\/root\/simple-oj\/code\/\d+\//g, '')
    complieError.value = error
    gptAnalysis.value = ''

    if (apiKey) {
      try {
        const data = await GPTApi.callFreeGpt3(
          `我的代码是：\n${code.value}\n报错信息是：\n${error}\n请帮我分析一下`,
          apiKey,
        )
        gptAnalysis.value = data.choices[0].message.content
      } catch (error) {
        gptAnalysis.value = 'GPT 分析失败'
      }
    }

    return
  }

  results.value = res.data
  complieError.value = ''
  dialogVisible.value = true

  nextTick(() => {
    diffRef.value.forEach((diffPre) => {
      const index = parseInt(diffPre.dataset.index!)
      diffPre.innerHTML = getDiffHtml(
        results.value[index].output!,
        problem.value!.sampleGroup[index].out!,
      )
    })
  })
}

// 获取标签颜色
const getTagColor = (result: { stat: CodeResult; output?: string }) => {
  // WA 红色
  if (result.stat.result || result.output) {
    return '#D51111'
  }
  // AC
  return '#67C23A'
}

// 获取实际结果和预期结果的差异的 html
// 注意性能问题
const getDiffHtml = (output: string, expected: string) => {
  const diff = diffChars(output, expected)
  const items = diff.map((item) => {
    if (item.added) {
      return `<ins>${item.value}</ins>`
    }
    if (item.removed) {
      return `<del>${item.value}</del>`
    }
    return item.value
  })
  return items.join('')
}
</script>

<style scoped lang="less">
.problem-solve-page {
  height: calc(100vh - 108px);

  :deep(.splitpanes__pane) {
    overflow: auto;
    background-color: #ffffff;
  }

  :deep(.splitpanes__splitter) {
    background-color: #f0f0f0;

    &:hover {
      background-color: #d5d5d5;
    }
  }

  .problem-tabs {
    margin-top: -10px;
  }

  .result-show {
    padding: 10px;

    .submit {
      position: relative;
      text-align: center;

      button {
        position: absolute;
        right: 10px;
        z-index: 10;
      }
    }

    .result-list {
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

    .result-tabs {
      .result-tab {
        margin-top: -10px;

        p {
          margin: 10px 0;
          font-size: 12px;
          color: #474747;
        }

        div {
          padding: 10px;
          border-radius: 10px;
          background-color: #f2f3f4;
          overflow-x: auto;
        }
      }
    }

    .complie-error {
      p {
        margin-bottom: 10px;
        font-size: 14px;
      }

      pre {
        padding: 20px;
        margin-bottom: 10px;
        border-radius: 10px;
        background-color: rgb(252, 252, 252);
        white-space: pre-wrap;
      }
    }

    pre {
      font-size: 16px;
      font-family:
        ui-monospace,
        SFMono-Regular,
        SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
    }
  }
}
</style>
<style>
span[color='r'] {
  color: red;
  background-color: #fadad7;
}

span[color='g'] {
  color: green;
  background-color: #eaf2c2;
}

pre.diff {
  ins {
    background: #eaf2c2;
    color: #406619;
    text-decoration: none;
  }

  del {
    text-decoration: none;
    color: #b30000;
    background: #fadad7;
  }
}
</style>
