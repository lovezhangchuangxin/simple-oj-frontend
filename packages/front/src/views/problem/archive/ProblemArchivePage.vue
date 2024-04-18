<template>
  <div>
    <el-container>
      <el-main>
        <ProblemTable :tag="tag" />
      </el-main>
      <el-aside width="250px">
        <el-affix :offset="110" style="width: 250px">
          <div class="tag-list">
            <h2>标签</h2>
            <el-tag
              v-for="tag in tags"
              :key="tag"
              @click="goToTagProblems(tag)"
              >{{ tag }}</el-tag
            >
          </div>
        </el-affix>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/common/common'
import { ProblemTagApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import ProblemTable from './ProblemTable.vue'

// 所有标签
const tags = ref<string[]>([])
const tag = ref('')

onMounted(async () => {
  queryAllTags()
})

const queryAllTags = async () => {
  const res = await ProblemTagApi.listAllTag()
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  tags.value = res.data
}

const goToTagProblems = (tagName: string) => {
  tag.value = tagName
}
</script>

<style scoped lang="less">
.tag-list {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 10px;
    font-size: 16px;
    // font-weight: 500;
    color: #5d628a;
    // text-shadow: rgb(66, 99, 182) 1px 0 10px;
  }

  .el-tag {
    margin-right: 6px;
    margin-bottom: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>
