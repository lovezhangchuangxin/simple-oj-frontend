<template>
  <el-container>
    <el-header>
      <div class="logo">
        <router-link to="/">
          <img style="width: 120px" :src="hustpng" alt="HUST logo"
        /></router-link>
      </div>
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        style="width: 100%"
      >
        <el-menu-item index="/problems">题库</el-menu-item>
        <!-- 待办 -->
        <!-- <el-menu-item index="/contest">竞赛</el-menu-item> -->
        <!-- <el-menu-item index="/forum">论坛</el-menu-item> -->
        <el-menu-item index="/class">班级</el-menu-item>
        <el-menu-item index="/about">关于</el-menu-item>
      </el-menu>
      <AvatarBox />
    </el-header>
    <el-main style="overflow: hidden"><router-view></router-view></el-main>
    <el-footer v-show="isFooterShow">Simple-OJ ©2023 by chuangxin</el-footer>
  </el-container>
  <el-backtop :right="64" :bottom="100" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import hustpng from '@/assets/images/hust.png'
import AvatarBox from '@/components/avatar-box/AvatarBox.vue'
import { UserApi } from '@simple-oj-frontend/api'
import { useUserStore } from './utils/store'

const route = useRoute()
const router = useRouter()
const activeIndex = computed(() => route.path)

// footer 是否显示
const isFooterShow = computed(() => {
  return route.name !== 'ProblemSolve'
})

const handleSelect = (key: string) => {
  router.push(key)
}

const userStore = useUserStore()

const refreshToken = async () => {
  const res = await UserApi.refreshToken()
  if (res.code === 0) {
    localStorage.setItem('token', res.data)
  }
}

onMounted(() => {
  // 初次加载时，请求用户信息
  const token = localStorage.getItem('token')
  if (!token) return

  UserApi.getUserInfo().then((res) => {
    if (res.code !== 0) {
      router.replace('/login')
      return
    }

    userStore.setUserInfo(res.data)

    if (route.path === '/login') {
      router.replace('/')
    }
  })

  // 每隔一定时间刷新 token
  setInterval(refreshToken, 5 * 60 * 1000)
  // 上线时立即刷新一次 token
  setTimeout(refreshToken, 10 * 1000)
})
</script>

<style scoped lang="less">
@padding: 120px;

section {
  min-height: 100vh;
}

header {
  display: flex;
  align-items: center;
  padding: 0 @padding;
  border-bottom: solid 1px var(--el-menu-border-color);

  .logo {
    margin-right: 40px;
    padding-top: 6px;
  }

  .el-menu-item {
    margin-right: 16px;
    padding: 16px;
  }
}

main {
  // padding: 24px @padding;
  width: calc(1600px / 1.25);
  margin: 0 auto;
  padding: 24px 0;
}

footer {
  padding: 16px;
  text-align: center;
  vertical-align: middle;
  color: #fff;
  background-color: #212121;
  border-top: solid 1px var(--el-menu-border-color);
}
</style>
