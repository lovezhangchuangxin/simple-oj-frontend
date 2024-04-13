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
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { ProblemTagApi } from '@simple-oj-frontend/api'
import { ElInput } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = Number(route.query.id)
const isEdit = id > 0
const problemTags = ref<string[]>([])
const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()

onMounted(async () => {
  if (isEdit) {
    const res = await ProblemTagApi.queryTagByProblem(id)
    if (res.code === 0 && res.data.trim()) {
      problemTags.value = res.data.trim().split(' ')
    }
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
</script>

<style scoped lang="less">
.problem-setting-page {
  h2 {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .tag-input {
    width: 100px;
  }
}
</style>
