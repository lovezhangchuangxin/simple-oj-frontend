<template>
  <div class="problem-manage">
    <div class="title">
      <h2>题目管理</h2>
      <el-button type="primary" @click="goToAddProblem">添加题目</el-button>
    </div>
    <ProblemTable />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProblemTable from '../archive/ProblemTable.vue'

const router = useRouter()

const goToAddProblem = () => {
  router.push('/problem/create')
}
</script>

<style scoped lang="less">
.problem-manage {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;

    h2 {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .table {
    margin-bottom: 20px;
  }
}
</style>
