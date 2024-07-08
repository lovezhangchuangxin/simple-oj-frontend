<template>
  <div class="class-list">
    <div class="search">
      <el-space>
        <span>名称</span>
        <el-input
          v-model="queryData.name"
          placeholder="请输入班级名称"
          style="width: 200px"
        />
        <span>创建者</span>
        <el-input
          v-model="queryData.creator"
          placeholder="请输入创建者"
          style="width: 200px"
        />
        <span>班级码</span>
        <el-input
          v-model="queryData.code"
          placeholder="请输入班级码"
          style="width: 200px"
        />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-space>
    </div>
    <el-table :data="classList" style="width: 100%" class="table">
      <el-table-column prop="name" label="名称" width="250">
        <template #default="{ row }">
          <div class="name">
            {{ row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建者" width="180" />
      <el-table-column prop="code" label="班级码" width="180" />
      <el-table-column prop="description" label="简介">
        <template #default="{ row }">
          <div class="description">
            {{ row.description || '无' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column prop="updateTime" label="更新时间" width="150" />
      <el-table-column prop="operation" label="操作" width="150" v-admin>
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editClass(row.id)">
            编辑
          </el-button>
          <el-popconfirm title="确认删除吗？" @confirm="deleteClass(row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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
import { formatTime, message } from '@/utils/common/common'
import {
  Class,
  ClassApi,
  classCodeToId,
  classIdToCode,
} from '@simple-oj-frontend/api'
import { onMounted, reactive, ref } from 'vue'
import vAdmin from '@/utils/directives/admin'

export type ClassItem = Class & { code: string; creator: string }

const { editFunc } = defineProps<{
  editFunc?: (classData: Class) => void
}>()

const total = ref(1)
const page = ref(0)
const size = ref(10)
const classList = ref<ClassItem[]>([])

// 查询参数
const queryData = reactive<{
  name: string
  creator?: string
  code?: string
}>({
  name: '',
  creator: '',
  code: '',
})

onMounted(() => {
  changePage(1, 10)
})

const search = () => {
  changePage(1, size.value, true)
}

const changePage = async (
  currentPage: number,
  pageSize: number,
  isPrompt = false,
) => {
  page.value = currentPage - 1
  size.value = pageSize
  const res = await ClassApi.getClasses(page.value, size.value, {
    name: queryData.name,
    creator: queryData.creator,
    id: queryData.code ? classCodeToId(queryData.code) : undefined,
  })
  if (res.code === 0) {
    total.value = res.data.total
    classList.value = res.data.data.map((item) => {
      item.createTime = formatTime(item.createTime)
      item.updateTime = formatTime(item.updateTime)
      ;(item as ClassItem).creator = res.data.user[item.creatorId]
      ;(item as ClassItem).code = classIdToCode(item.id)
      return item as ClassItem
    })

    if (isPrompt) {
      message.success('查询成功')
    }
  }
}

const editClass = (id: number) => {
  editFunc && editFunc(classList.value.find((item) => item.id === id)!)
}

const deleteClass = async (id: number) => {
  const res = await ClassApi.deleteClass(id)
  if (res.code === 0) {
    // changePage(page.value + 1, size.value)
    message.success('删除成功')
    return
  }

  message.error(res.msg)
}

const reset = () => {
  queryData.name = ''
  queryData.creator = ''
  queryData.code = ''
  search()
}
</script>

<style scoped lang="less">
.class-list {
  .table {
    margin-bottom: 20px;

    .name {
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
