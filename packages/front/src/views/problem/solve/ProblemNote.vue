<template>
  <div class="problem-note">
    <h2 v-if="!acceptNote">该题已关闭发布题解</h2>
    <el-button v-else @click="goToPublishNote" type="primary">{{
      myProblemNote
        ? '编辑我的题解'
        : problemNotes.length
          ? '发布题解'
          : '暂无题解，抢先发布~'
    }}</el-button>
    <el-divider />
    <div v-for="note in problemNotes" :key="note.id" class="note-list">
      <div class="desc">
        <el-space>
          <div class="avatar">
            <el-avatar :src="userMap[note.authorId].avatar" />
          </div>
          <span
            :style="{
              color: getAuthorColor(userMap[note.authorId].role),
            }"
            >{{ userMap[note.authorId].username }}</span
          >
          <span>{{ note.title }}</span>
        </el-space>
        <span>创建时间：{{ formatTime(note.createTime) }}</span>
      </div>
      <MdViewer :value="note.content"></MdViewer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime, message } from '@/utils/common/common'
import { ProblemNote, ProblemNoteApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  problemId: number
  acceptNote: boolean
}>()
const { problemId } = props

const problemNotes = ref<ProblemNote[]>([])
const total = ref(0)
const userMap = ref<
  Record<number, { username: string; avatar: string; role: number }>
>({})
const myProblemNote = ref<ProblemNote>()

const router = useRouter()

// 前往发布题解页面
const goToPublishNote = () => {
  router.push(
    `/problem/${problemId}/note/create${myProblemNote.value ? '?id=' + myProblemNote.value.id : ''}`,
  )
}

onMounted(async () => {
  const res = await ProblemNoteApi.queryProblemNoteByPage(problemId, 0, 10, 1)
  if (res.code !== 0) {
    message.error(res.msg)
  } else {
    problemNotes.value = res.data.data
    total.value = res.data.total
    userMap.value = res.data.userMap
  }

  const res2 = await ProblemNoteApi.getMyProblemNoteByProblemId(problemId)
  if (res2.code === 0) {
    myProblemNote.value = res2.data
  }
})

const getAuthorColor = (role: number) => {
  return role === 1 ? '#6e3fac' : '#606266'
}
</script>

<style scoped lang="less">
.problem-note {
  h2 {
    margin-bottom: 20px;
    font-size: 16px;
    color: #764242;
  }

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

  .el-divider--horizontal {
    margin: 16px 0 10px;
  }

  .note-list {
    margin-bottom: 20px;
    padding-right: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    border-radius: 4px;

    .desc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      span {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
