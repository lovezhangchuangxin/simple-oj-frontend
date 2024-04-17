<template>
  <div class="problem-table">
    <div class="search">
      <el-space>
        <span>标签</span>
        <div class="search-tag">
          <el-input
            v-model="tag"
            placeholder="请输入题目标签"
            style="width: 150px"
            @input="inputTag"
            @blur="inputBlur"
          />
          <ul v-show="matchedTags.length" @click.stop="chooseTag">
            <li v-for="tag in matchedTags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <span>题目</span>
        <el-input v-model="title" placeholder="请输入题目" />
        <span>难度</span>
        <el-select v-model="difficulty" style="width: 100px">
          <el-option
            v-for="item in difficultyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-space>
    </div>
    <ProblemList :data="tableData" class="table" />
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
import ProblemList, {
  ProblemShowItem,
} from '@/components/problem-list/ProblemList.vue'
import { message } from '@/utils/common/common'
import { ProblemApi, ProblemTagApi } from '@simple-oj-frontend/api'
import { onMounted, ref, watch } from 'vue'
import { getProblemTableData } from '../util'

const props = defineProps<{
  tag?: string
  tags?: string[]
}>()

// 题单数据
const tableData = ref<ProblemShowItem[]>([])
const total = ref(1)
const page = ref(0)
const size = ref(10)
// 所有标签
const tags = ref<string[]>(props.tags || [])
// 查询参数
const matchedTags = ref<string[]>([])
const tag = ref(props.tag || '')
const title = ref('')
const difficulty = ref(0)

const difficultyOptions = [
  { value: 0, label: '全部' },
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' },
]

onMounted(async () => {
  queryAllTags()
  changePage(1, 10)
})

watch(
  () => props.tag,
  (newTag) => {
    tag.value = newTag || ''
  },
)

const changePage = async (
  currentPage: number,
  pageSize: number,
  isPrompt = false,
) => {
  if (tag.value && !tags.value.includes(tag.value)) {
    message.error('标签不存在')
    return
  }

  page.value = currentPage - 1
  size.value = pageSize
  const res = await ProblemApi.getProblemListByCondition(
    page.value,
    size.value,
    title.value,
    tag.value,
    difficulty.value,
  )
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  tableData.value = getProblemTableData(res.data)
  total.value = res.data.total
  if (isPrompt) {
    message.success('查询成功')
  }
}

const queryAllTags = async () => {
  if (tags.value.length) return
  const res = await ProblemTagApi.listAllTag()
  if (res.code !== 0) {
    message.error(res.msg)
    return
  }
  tags.value = res.data
}

const inputTag = () => {
  if (!tag.value) {
    matchedTags.value = []
    return
  }
  matchedTags.value = tags.value.filter((t) => t.includes(tag.value))
}

const inputBlur = () => {
  setTimeout(() => {
    matchedTags.value = []
  }, 100)
}

const chooseTag = (e: Event) => {
  const target = e.target as HTMLElement
  tag.value = target.innerText
  matchedTags.value = []
}

const search = async () => {
  changePage(1, 10, true)
}

const reset = () => {
  tag.value = ''
  title.value = ''
  difficulty.value = 0
}
</script>

<style scoped lang="less">
.problem-table {
  .search {
    margin-bottom: 10px;

    .search-tag {
      position: relative;

      ul {
        position: absolute;
        top: 110%;
        left: 0;
        width: 100%;
        background-color: #fff;
        border: 1px solid #ebeef5;
        border-radius: 5px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        z-index: 10;

        li {
          color: #606266;
          font-size: 14px;
          cursor: pointer;
          padding: 8px 20px;

          &:hover {
            color: #409eff;
            background-color: #f5f7fa;
          }
        }
      }
    }
  }

  .table {
    margin-bottom: 20px;
  }
}
</style>
