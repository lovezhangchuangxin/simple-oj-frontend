<template>
  <div class="bulletin-board">
    <div class="header">
      <div class="title">公告栏</div>
      <div class="all-btn" @click="goToBulletinPage">
        <span>所有</span>
        <el-icon><Position /></el-icon>
      </div>
    </div>
    <ul>
      <li
        v-for="{ title, id } in bulletins"
        :key="id"
        @click="goToBulletinItemPage(id)"
        class="ellipsis"
      >
        {{ title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Position } from '@element-plus/icons-vue'
import { Bulletin, BulletinApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const bulletins = ref<Omit<Bulletin, 'content'>[]>([])

onMounted(async () => {
  const res = await BulletinApi.getBulletins(0, 10)
  if (res.code === 0) {
    bulletins.value = res.data.data
  }
})

const goToBulletinPage = () => {
  router.push('/bulletin')
}

const goToBulletinItemPage = (id: number) => {
  router.push(`/bulletin/item/${id}`)
}
</script>

<style scoped lang="less">
.bulletin-board {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;

    .title {
      font-size: 20px;
      font-weight: 500;
    }

    .all-btn {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      color: #409eff;
      cursor: pointer;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    font-size: 16px;
    color: #2e2e2e;

    li {
      margin-bottom: 10px;

      &:hover {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
}
</style>
