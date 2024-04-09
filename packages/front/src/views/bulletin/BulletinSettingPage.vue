<template>
  <div>
    <el-button type="primary" @click="addBulletin">创建公告</el-button>
    <BulletinList />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BulletinList from './BulletinList.vue'

const router = useRouter()

const addBulletin = () => {
  router.push('/bulletin/create')
}
</script>

<style scoped></style>
