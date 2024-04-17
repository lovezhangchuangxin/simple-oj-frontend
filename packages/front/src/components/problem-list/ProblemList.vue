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
            <!-- <el-icon v-else-if="row.status === 1"
              ><CloseBold color="red"
            /></el-icon> -->
            <el-icon v-else-if="row.status === 2"
              ><Select color="green"
            /></el-icon>
          </div>
          <div v-else-if="key === 'id'" class="id">{{ row.id }}</div>
          <div v-else-if="key === 'title'" class="title">
            <router-link :to="`/problem/solve/${row.id}`">{{
              row.title
            }}</router-link>
          </div>
          <div v-else-if="key === 'tag'" class="tag">
            <el-space v-if="row.tag">
              <el-tag v-for="tag in row.tag.trim().split(' ')" :key="tag">{{
                tag
              }}</el-tag>
            </el-space>
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
          <div v-else-if="key === 'difficulty'">{{ row[key] }}</div>
          <div v-else-if="key === 'operation' && isAdmin">
            <el-button
              size="small"
              type="primary"
              @click="goToEditProblem(row.id)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除该题目吗？"
              @confirm="deleteProblem(row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { useUserStore } from '@/utils/store'
import { Select, SemiSelect } from '@element-plus/icons-vue'
import { ProblemApi } from '@simple-oj-frontend/api'
import { useRoute, useRouter } from 'vue-router'

export interface ProblemShowItem {
  /**
   * 0: 未做，1：没通过，2：通过
   */
  status: 0 | 2
  /**
   * 题目 id
   */
  id: number
  /**
   * 题目标题
   */
  title: string
  /**
   * 题目标签
   */
  tag: string
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
  data: ProblemShowItem[]
}

defineProps<PronblemListProps>()

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const TableHeadNameMap = {
  status: '状态',
  id: '题号',
  title: '标题',
  tag: '标签',
  difficulty: '难度',
  passRate: '通过率',
  operation: '操作',
}

const TableHeadWidthMap = {
  status: 80,
  id: 100,
  title: undefined,
  tag: undefined,
  difficulty: 100,
  passRate: 150,
  operation: 160,
}

// 是否是管理员，先写死
const isAdmin = route.path === '/problem/manage' && userStore.role === 1

if (!isAdmin) {
  // @ts-ignore
  delete TableHeadNameMap.operation
}

// 编辑题目
const goToEditProblem = (id: number) => {
  router.push(`/problem/create?id=${id}`)
}

// 删除题目
const deleteProblem = (id: number) => {
  ProblemApi.deleteProblem(id).then((res) => {
    if (res.code === 0) {
      message.success(res.msg)

      return
    }

    message.error(res.msg)
  })
}
</script>

<style scoped lang="less">
.title {
  a {
    color: #303133;
    text-decoration: none;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}

.el-tag {
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }
}
</style>
