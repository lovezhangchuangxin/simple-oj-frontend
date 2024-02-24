<template>
  <div class="problem-list">
    <el-table :data="data" style="width: 100%">
      <el-table-column
        v-for="(value, key) in TableHeadNameMap"
        :prop="key"
        :label="value"
        :width="TableHeadWidthMap[key]"
        :key="key"
      >
        <template #default="{ row }">
          <div v-if="key === 'status'" class="status">
            <el-icon v-if="row.status === 0"><SemiSelect /></el-icon>
            <el-icon v-else-if="row.status === 1"
              ><CloseBold color="red"
            /></el-icon>
            <el-icon v-else-if="row.status === 2"
              ><Select color="green"
            /></el-icon>
          </div>
          <div v-else-if="key === 'title'" class="title">
            <router-link :to="`/problem/${row.pid}`">{{
              row.title
            }}</router-link>
          </div>
          <div v-else-if="key === 'tag'" class="tag">
            <el-tag v-for="tag in row.tag" :key="tag" size="small">{{
              tag
            }}</el-tag>
          </div>
          <div v-else-if="key === 'passRate'" class="tag">
            <template v-if="row.passRate">
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="row.passRate * 100"
              />
            </template>
            <template v-else>暂无</template>
          </div>
          <div v-else>{{ row[key] }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CloseBold, Select, SemiSelect } from '@element-plus/icons-vue'

interface ProblemItem {
  /**
   * 0: 未做，1：没通过，2：通过
   */
  status: number
  /**
   * 题目 id
   */
  pid: string
  /**
   * 题目标题
   */
  title: string
  /**
   * 题目标签
   */
  tag: string[]
  /**
   * 题目难度
   */
  difficulty: string
  /**
   * 题目通过率，通过数 / 提交数
   */
  passRate?: number
}

interface PronblemListProps {
  /**
   * 表格数据
   */
  data: ProblemItem[]
}

defineProps<PronblemListProps>()

const TableHeadNameMap = {
  status: '状态',
  pid: '题号',
  title: '标题',
  tag: '标签',
  difficulty: '难度',
  passRate: '通过率',
}

const TableHeadWidthMap = {
  status: 80,
  pid: 100,
  title: 250,
  tag: 250,
  difficulty: 100,
  passRate: 150,
}
</script>

<style scoped></style>
