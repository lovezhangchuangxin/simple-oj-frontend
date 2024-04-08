<template>
  <div>
    <el-container>
      <el-main>
        <h2 class="title">经典热题</h2>
        <ProblemList :data="tableData" />
      </el-main>
      <el-aside width="250px">
        <el-affix :offset="120" style="width: 250px">
          <div class="contribution">
            <ContributionBox :from="from" :to="to" :data="contributionData" />
          </div>
          <div>我是公告</div>
        </el-affix>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import ProblemList, {
  ProblemShowItem,
} from '@/components/problem-list/ProblemList.vue'
import ContributionBox from '@/components/contribution-box/ContributionBox.vue'
import { onMounted, ref } from 'vue'
import { ProblemApi } from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'

// 题单数据
const tableData = ref<ProblemShowItem[]>([])

onMounted(async () => {
  const res = await ProblemApi.getProblemList(0, 10)
  if (res.code !== 0) {
    message.error(res.msg)
  }
  const { problems, ids } = res.data
  const idsSet = new Set(ids)
  tableData.value = problems.map((problem) => {
    let { id, title, tag, submitCount, acceptCount } = problem
    if (!submitCount) submitCount = 2
    if (!acceptCount) acceptCount = 1

    const passRate = acceptCount / submitCount
    const difficulty =
      passRate > 0.5 ? '简单' : passRate > 0.3 ? '中等' : '困难'

    return {
      status: idsSet.has(problem.id) ? 2 : 0,
      id,
      title,
      tag,
      difficulty,
      passRate,
    } as ProblemShowItem
  })
})

const contributionData = ref<{ [day: string]: number }>({})
const end = Date.now()
const start = end - 3 * 30 * 1000 * 60 * 60 * 24
const to = new Date(end).toISOString().split('T')[0]
const from = new Date(start).toISOString().split('T')[0]

onMounted(async () => {
  // 获取最近三个月的提交记录
  const res = await ProblemApi.getSubmitCountPerDayByTime(start, end)
  if (res.code !== 0) return
  contributionData.value = res.data
})
</script>

<style scoped lang="less">
main {
  padding-right: 60px;
}

.title {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
}

.contribution {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
