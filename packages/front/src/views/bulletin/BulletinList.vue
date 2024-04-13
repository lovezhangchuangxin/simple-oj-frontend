<template>
  <div class="bulletin-list">
    <el-table :data="bulletinData" style="width: 100%" class="table">
      <el-table-column prop="title" label="标题" width="250">
        <template #default="{ row }">
          <div @click="goToDetail(row.id)" class="title">
            {{ row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column prop="updateTime" label="更新时间" width="150" />
      <el-table-column prop="author" label="作者" width="180" />
      <el-table-column prop="operation" label="操作" width="150" v-admin>
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editBulletin(row.id)">
            编辑
          </el-button>
          <el-popconfirm
            title="Are you sure to delete this?"
            @confirm="deleteBulletin(row.id)"
          >
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
import vAdmin from '@/utils/directives/admin'
import { Bulletin, BulletinApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type BulletinItem = Omit<Bulletin, 'content'> & { author: string }

const router = useRouter()

const total = ref(1)
const page = ref(0)
const size = ref(10)
const bulletinData = ref<BulletinItem[]>([])

onMounted(() => {
  changePage(1, 10)
})

// 前往详情页
const goToDetail = (id: number) => {
  router.push(`/bulletin/item/${id}`)
}

// 编辑公告
const editBulletin = (id: number) => {
  router.push(`/bulletin/create?id=${id}`)
}

// 删除公告
const deleteBulletin = (id: number) => {
  BulletinApi.deleteBulletin(id).then((res) => {
    if (res.code === 0) {
      changePage(page.value, size.value)
      message.success('删除成功')
      return
    }

    message.error('删除失败')
  })
}

const changePage = async (currentPage: number, pageSize: number) => {
  page.value = currentPage - 1
  size.value = pageSize
  const res = await BulletinApi.getBulletins(page.value, size.value)
  if (res.code === 0) {
    total.value = res.data.total
    bulletinData.value = res.data.data.map((item) => {
      item.createTime = formatTime(item.createTime)
      item.updateTime = formatTime(item.updateTime)
      ;(item as BulletinItem).author = res.data.user[item.authorId]
      return item as BulletinItem
    })
  }
}
</script>

<style scoped lang="less">
.bulletin-list {
  .table {
    margin-bottom: 20px;

    .title {
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
