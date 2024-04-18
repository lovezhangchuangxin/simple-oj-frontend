<template>
  <div>
    <el-table :data="tableData" stripe class="table">
      <el-table-column
        v-for="(value, key) in TableHeadNameMap"
        :prop="key"
        :label="value"
        :width="TableHeadWidthMap[key]"
        :key="key"
      >
        <template #default="{ row }">
          <div v-if="key === 'status'" class="status">
            <div v-if="row.status === 'AC'" class="green">
              <el-icon color="green" class="icon">
                <Select />
              </el-icon>
              通过
            </div>
            <div v-else class="red">
              <el-icon color="red" class="icon">
                <CloseBold />
              </el-icon>
              未通过
            </div>
          </div>
          <div v-else-if="key === 'time'">{{ row.time }}</div>
          <div v-else-if="key === 'memory'">{{ row.memory }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @change="changePage"
      class="pagination"
      :page-size="size"
    />
  </div>
</template>

<script setup lang="ts">
import { formatTime, message } from '@/utils/common/common'
import { useUserStore } from '@/utils/store'
import { CloseBold, Select } from '@element-plus/icons-vue'
import {
  CodeExecuteStatus,
  ProblemApi,
  // ProblemSolveRecord,
} from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue' // 题目 id
import { useRoute } from 'vue-router'

const route = useRoute()
const qid = parseInt(route.params.qid as string) || 0
const userStore = useUserStore()
// const data = ref<ProblemSolveRecord[]>([])
const total = ref(0)
// const userMap = ref<
//   Record<
//     number,
//     {
//       username: string
//       avatar: string
//     }
//   >
// >({})
// const problemMap = ref<Record<number, { title: string; difficulty: number }>>()
const page = ref(0)
const size = ref(12)
const tableData = ref<
  {
    status: string
    time: string
    memory: string
    submitTime: string
  }[]
>([])

const TableHeadNameMap = {
  status: '状态',
  time: '时间',
  memory: '内存',
  submitTime: '提交时间',
}

const TableHeadWidthMap = {
  status: undefined,
  time: undefined,
  memory: undefined,
  submitTime: 180,
}

onMounted(async () => {
  changePage(1, size.value)
})

const changePage = async (
  currentPage: number,
  pageSize: number,
  isPrompt = false,
) => {
  page.value = currentPage - 1
  size.value = pageSize
  const res = await ProblemApi.querySubmitRecordByPage(
    page.value,
    size.value,
    qid,
    userStore.id,
    0,
  )
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  tableData.value = res.data.data.map((item) => {
    return {
      status: item.status === CodeExecuteStatus.AC ? 'AC' : 'WA',
      time: item.timeCost + 'ms',
      memory: (item.memoryCost / 1024).toFixed(1) + 'MB',
      submitTime: formatTime(item.createTime),
    }
  })
  total.value = res.data.total
  if (isPrompt) {
    message.success('查询成功')
  }
}
</script>

<style scoped lang="less">
.table {
  margin-bottom: 20px;
}

.status {
  div {
    display: flex;
    align-items: center;
    gap: 6px;

    &.green {
      color: green;
    }

    &.red {
      color: red;
    }
  }
}
</style>
