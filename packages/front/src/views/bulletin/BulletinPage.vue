<template>
  <div class="bulletin-page">
    <h2>所有公告</h2>
    <BulletinList />
  </div>
</template>

<script setup lang="ts">
import BulletinList from './BulletinList.vue'
</script>

<style scoped lang="less">
.bulletin-page {
  h2 {
    font-size: 18px;
    font-weight: 500;
    color: #3d3d47;
    margin-bottom: 10px;
  }
}
</style>
