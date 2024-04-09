<template>
  <div>
    <el-container>
      <el-main>
        <h2 class="title">经典热题</h2>
        <ProblemList :data="tableData" />
      </el-main>
      <el-aside width="250px">
        <el-affix :offset="110" style="width: 250px">
          <div class="contribution">
            <ContributionBox :from="from" :to="to" :data="contributionData" />
          </div>
          <div>
            <BulletinBoard />
          </div>
        </el-affix>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProblemList, {
  ProblemShowItem,
} from '@/components/problem-list/ProblemList.vue'
import ContributionBox from '@/components/contribution-box/ContributionBox.vue'
import { ProblemApi } from '@simple-oj-frontend/api'
import { message } from '@/utils/common/common'
import BulletinBoard from '@/views/bulletin/BulletinBoard.vue'
import { getProblemTableData } from '../problem/util'

// 题单数据
const tableData = ref<ProblemShowItem[]>([])

onMounted(async () => {
  const res = await ProblemApi.getProblemList(0, 10)
  if (res.code !== 0) {
    message.error(res.msg)
  }
  tableData.value = getProblemTableData(res.data)
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
