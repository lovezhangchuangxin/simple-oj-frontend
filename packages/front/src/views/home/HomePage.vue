<template>
  <div>
    <el-container>
      <el-main>
        <div>每日一题：。。。。。。</div>
        <ProblemList :data="tableData" />
      </el-main>
      <el-aside width="250px">
        <el-affix :offset="120" style="width: 250px">
          <ContributionBox :from="from" :to="to" :data="contributionData" />
          <div>我是公告</div>
        </el-affix>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import ProblemList from '@/components/problem-list/ProblemList.vue'
import ContributionBox from '@/components/contribution-box/ContributionBox.vue'

// mock数据
const from = '2023-10-12'
const to = '2024-01-20'
const counts = [0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const fromDate = new Date(from)
const toDate = new Date(to)
const milisecondsPerDay = 1000 * 60 * 60 * 24
const days = (toDate.getTime() - fromDate.getTime()) / milisecondsPerDay + 1

const contributionData: { [day: string]: number } = {}

for (let i = 0; i < days; i++) {
  const date = new Date(fromDate.getTime() + i * milisecondsPerDay)
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  contributionData[key] = counts[Math.floor(Math.random() * counts.length)]
}

// 题单数据

const tableData = [
  {
    status: 0,
    pid: '1',
    title: 'Two Sum',
    tag: ['Array', 'Hash Table'],
    difficulty: 'Easy',
    passRate: 0.445,
  },
  {
    status: 1,
    pid: '2',
    title: 'Add Two Numbers',
    tag: ['Linked List', 'Math'],
    difficulty: 'Medium',
    passRate: 0.445,
  },
  {
    status: 2,
    pid: '3',
    title: 'Longest Substring Without Repeating Characters',
    tag: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'],
    difficulty: 'Medium',
    passRate: 0.445,
  },
  {
    status: 0,
    pid: '4',
    title: 'Median of Two Sorted Arrays',
    tag: ['Array', 'Binary Search', 'Divide and Conquer'],
    difficulty: 'Hard',
  },
  {
    status: 1,
    pid: '5',
    title: 'Longest Palindromic Substring',
    tag: ['String', 'Dynamic Programming'],
    difficulty: 'Medium',
  },
  {
    status: 2,
    pid: '6',
    title: 'ZigZag Conversion',
    tag: ['String'],
    difficulty: 'Medium',
  },
  {
    status: 0,
    pid: '7',
    title: 'Reverse Integer',
    tag: ['Math'],
    difficulty: 'Easy',
  },
  {
    status: 1,
    pid: '8',
    title: 'String to Integer (atoi)',
    tag: ['Math', 'String'],
    difficulty: 'Medium',
  },
  {
    status: 2,
    pid: '9',
    title: 'Palindrome Number',
    tag: ['Math'],
    difficulty: 'Easy',
  },
  {
    status: 0,
    pid: '10',
    title: 'Regular Expression Matching',
    tag: ['String', 'Dynamic Programming', 'Backtracking'],
    difficulty: 'Hard',
  },
]
</script>

<style scoped></style>
