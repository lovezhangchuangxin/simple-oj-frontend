<template>
  <el-popover
    placement="bottom"
    :width="130"
    trigger="hover"
    :show-arrow="false"
  >
    <template #reference>
      <div class="avatar"><el-avatar :src="userStore.avatar || avatar" /></div>
    </template>
    <template #default>
      <div class="menu">
        <div @click="router.push('/person/setting')">
          <el-icon><Setting /></el-icon>个人设置
        </div>
        <div>
          <el-icon><House /></el-icon>我的班级
        </div>
        <div @click="goProblemManage">
          <el-icon><Apple /></el-icon>题目管理
        </div>
        <div @click="goBulletinSetting">
          <el-icon><ChatSquare /></el-icon>公告设置
        </div>
        <div @click="logout">
          <el-icon><CircleClose /></el-icon>退出账号
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import avatar from '@/assets/images/avatar2.png'
import { useUserStore } from '@/utils/store'
import {
  Apple,
  ChatSquare,
  CircleClose,
  House,
  Setting,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const goProblemManage = () => {
  router.push('/problem/manage')
}

// 设置公告
const goBulletinSetting = () => {
  router.push('/bulletin/setting')
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
</script>

<style scoped lang="less">
@avatar: 30px;
.avatar {
  width: @avatar;
  height: @avatar;

  &:deep(span) {
    width: @avatar;
    height: @avatar;

    &:hover {
      cursor: pointer;
    }
  }
}

.menu {
  width: 125px;
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px;

    &:hover {
      cursor: pointer;
      background-color: #f7f7f8;
    }
  }
}
</style>
