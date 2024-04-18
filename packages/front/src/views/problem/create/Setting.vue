<template>
  <div class="problem-setting-page">
    <h2>题目标签</h2>
    <div v-if="!isEdit">
      <p>请先创建题目，再添加标签</p>
    </div>
    <div v-else class="tag">
      <el-space>
        <el-tag
          v-for="tag in problemTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="closeTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="tag-input"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" @click="showInput">
          + New Tag
        </el-button>
      </el-space>
    </div>

    <h2>题目难度</h2>
    <div v-if="!isEdit">
      <p>请先创建题目，再添加题目难度</p>
    </div>
    <el-select
      v-else
      v-model="difficulty"
      placeholder="请选择题目难度"
      style="width: 200px"
      @change="setDifficulty"
    >
      <el-option
        v-for="item in difficultyOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        {{ item.label }}
      </el-option>
    </el-select>

    <h2>是否接受题解</h2>
    <div v-if="!isEdit">
      <p>请先创建题目，再设置是否接受题解</p>
    </div>
    <el-switch
      v-else
      v-model="acceptNote"
      active-text="是"
      inactive-text="否"
      @change="setIsAcceptNote"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { Problem, ProblemApi, ProblemTagApi } from '@simple-oj-frontend/api'
import { ElInput } from 'element-plus'
import { nextTick, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  problem?: Problem
  isEdit?: boolean
}>()

const { problem, isEdit } = toRefs(props)

const route = useRoute()
const id = Number(route.query.id)
const problemTags = ref<string[]>([])
const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()
const difficulty = ref(0)
const difficultyOptions = [
  { value: 0, label: '无' },
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' },
]
const acceptNote = ref(false)

watch(problem, (newProblem) => {
  if (newProblem) {
    problemTags.value = newProblem.tag ? newProblem.tag.trim().split(' ') : []
    difficulty.value = newProblem.difficulty
    acceptNote.value = newProblem.acceptNote
  }
})

const closeTag = async (tag: string) => {
  const res = await ProblemTagApi.deleteTag(id, tag)
  if (res.code === 0) {
    problemTags.value = problemTags.value.filter((item) => item !== tag)
    message.success('删除标签成功')
  } else {
    message.error(res.msg)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = async () => {
  if (!inputValue.value) {
    inputVisible.value = false
    return
  }
  const res = await ProblemTagApi.addTag(id, inputValue.value)
  if (res.code === 0) {
    problemTags.value.push(inputValue.value)
    inputVisible.value = false
    inputValue.value = ''
    message.success('添加标签成功')
  } else {
    message.error(res.msg)
  }
}

const setDifficulty = async () => {
  const res = await ProblemApi.updateProblem({
    difficulty: difficulty.value,
    id,
  })
  if (res.code === 0) {
    message.success('设置题目难度成功')
  } else {
    message.error(res.msg)
  }
}

const setIsAcceptNote = async () => {
  const res = await ProblemApi.updateProblem({
    acceptNote: acceptNote.value,
    id,
  })
  if (res.code === 0) {
    message.success('设置是否接受题解成功')
  } else {
    message.error(res.msg)
  }
}
</script>

<style scoped lang="less">
.problem-setting-page {
  h2 {
    margin: 15px 0;
    font-size: 16px;
    color: #353039;

    &:first-child {
      margin-top: 5px;
    }
  }

  .tag-input {
    width: 100px;
  }
}
</style>
