<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="1. Simple-Oj 说明" name="1">
        <div>
          Simple-Oj
          是一个简单的在线编程练习平台，旨在帮助用户提升编程能力。用户可以在
          Simple-Oj 上刷题，查看题解，学习算法知识。
        </div>
      </el-collapse-item>
      <el-collapse-item title="2. 如何提交题目" name="2">
        <div>
          现阶段仅对管理员开放题目提交功能，暂不支持 Special
          Judge，如果您有好的题目想要分享，可以联系管理员~
        </div>
      </el-collapse-item>
      <el-collapse-item title="3. 如何部署" name="3">
        <div>
          本项目前端使用 Vue3 + TypeScript + Element Plus，后端使用
          SpringBoot，数据库使用 MySQL。 详细部署方法请参考项目 README.md。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['1', '2', '3'])
</script>

<style scoped></style>
