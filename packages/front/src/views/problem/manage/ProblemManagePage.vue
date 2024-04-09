<template>
  <div class="problem-manage">
    <div class="title">
      <h2>题目列表</h2>
      <el-button type="primary" @click="goToAddProblem">添加题目</el-button>
    </div>
    <ProblemList :data="tableData" class="table" />
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @change="changePage"
      class="pagination"
    />
  </div>
</template>

<script setup lang="ts">
import ProblemList, {
  ProblemShowItem,
} from '@/components/problem-list/ProblemList.vue'
import { message } from '@/utils/common/common'
import { ProblemApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import { getProblemTableData } from '../util'
import { useRouter } from 'vue-router'

// 题单数据
const tableData = ref<ProblemShowItem[]>([])
const total = ref(1)
const page = ref(0)
const size = ref(10)

const router = useRouter()

onMounted(async () => {
  changePage(1, 10)
})

const changePage = async (currentPage: number, pageSize: number) => {
  page.value = currentPage - 1
  size.value = pageSize
  const res = await ProblemApi.getProblemList(page.value, size.value)
  if (res.code !== 0) {
    message.error(res.msg)
  }
  tableData.value = getProblemTableData(res.data)
}

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
    }
  }

  .table {
    margin-bottom: 20px;
  }
}
</style>
