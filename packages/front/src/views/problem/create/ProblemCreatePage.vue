<template>
  <div class="problem-edit-page">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="题目内容" name="problemContent">
        <ProblemContent :problem="problem" :isEdit="isEdit" />
      </el-tab-pane>
      <el-tab-pane label="题目设置" name="problemSetting">
        <ProblemSetting :problem="problem" :isEdit="isEdit" />
      </el-tab-pane>
      <el-tab-pane label="帮助信息" name="problemHelp">
        <ProblemHelp />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProblemContent from './Content.vue'
import ProblemSetting from './Setting.vue'
import ProblemHelp from './Help.vue'
import { useRoute } from 'vue-router'
import { Problem, ProblemApi } from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'

const route = useRoute()
const id = Number(route.query.id)
const isEdit = id > 0
const problem = ref<Problem>()
const activeName = ref('problemContent')

onMounted(async () => {
  if (isEdit) {
    const res = await ProblemApi.getProblemById(id)
    if (res.code === 0) {
      problem.value = res.data
    } else {
      message.error(res.msg)
    }
  }
})
</script>

<style scoped></style>
