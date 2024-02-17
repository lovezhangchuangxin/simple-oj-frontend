<template>
  <div class="problem-edit-page">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="题目内容" name="problemContent">
        <ProblemContent />
      </el-tab-pane>
      <el-tab-pane label="题目设置" name="problemSetting">
        <ProblemSetting />
      </el-tab-pane>
      <el-tab-pane label="帮助信息" name="problemHelp">
        <ProblemHelp />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProblemContent from './Content.vue'
import ProblemSetting from './Setting.vue'
import ProblemHelp from './Help.vue'

const activeName = ref('problemContent')
</script>

<style scoped></style>
