<template>
  <div class="submit-info">
    <div class="submit-chart">
      <!-- 代码图 -->
      <div class="submit-map">
        <p>
          过去一年共提交
          <span style="font-size: 16px; font-weight: 500">{{
            submitCount
          }}</span>
          次
        </p>

        <ContributionBox :from="from" :to="to" :data="contributionData" />
      </div>
      <v-chart ref="pie" :option="chartData" autoresize class="pie" />
    </div>
    <div class="recent-submit">
      <p>最近通过</p>
      <ul>
        <li
          v-for="{ id, problemId, title, createTime } in recentSubmitRecord"
          :key="id"
        >
          <span class="problem-title">
            <b>{{ problemId }}</b
            >. {{ title }}
          </span>
          <span class="submit-time"> {{ formatTime(createTime) }} </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProblemApi, SubmitBriefInfo } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { formatTime } from '@/utils/common/common'

const contributionData = ref<{ [day: string]: number }>({})
const end = Date.now()
const start = end - 12 * 30 * 1000 * 60 * 60 * 24
const to = new Date(end).toISOString().split('T')[0]
const from = new Date(start).toISOString().split('T')[0]
const submitCount = ref(0)
const recentSubmitRecord = ref<SubmitBriefInfo[]>([])

const chartData = ref({
  // color: ['#9FE080', '#F7E1E6'],
  textStyle: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 300,
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c}次({d}%)',
  },

  series: [
    {
      type: 'pie',
      radius: '80%',
      data: [
        { value: 0, name: '通过' },
        { value: 0, name: '未通过' },
      ],
      label: {
        show: true,
        position: 'inside',
        formatter: '{b} : {c}次',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

use([CanvasRenderer, PieChart, TooltipComponent])

onMounted(async () => {
  // 获取最近一年的提交记录
  const res = await ProblemApi.getSubmitCountPerDayByTime(start, end)
  if (res.code !== 0) return
  contributionData.value = res.data.collect
  submitCount.value = Object.values(res.data.collect).reduce(
    (acc, cur) => acc + cur,
    0,
  )

  chartData.value.series[0].data = [
    { value: res.data.accept, name: '通过' },
    { value: res.data.other, name: '未通过' },
  ]

  const res2 = await ProblemApi.getRecentAcceptRecord(10)
  if (res2.code === 0) {
    recentSubmitRecord.value = res2.data
  }
})
</script>

<style scoped lang="less">
.submit-info {
  .submit-chart {
    display: flex;
    margin-bottom: 20px;

    .submit-map {
      text-align: center;
      display: inline-block;
      border-radius: 10px;
      padding: 20px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

      p {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }

    .pie {
      width: 200px;
      height: 200px;
    }
  }

  .recent-submit {
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

    p {
      display: inline-block;
      padding: 6px 12px;
      font-size: 16px;
      margin-bottom: 12px;
      border-radius: 5px;
      background-color: #f2f3f4;
    }

    ul {
      li {
        display: flex;
        justify-content: space-between;
        padding: 12px 10px;
        font-size: 16px;
        color: #303133;
        border-radius: 5px;
        cursor: pointer;
        list-style: none;

        &:nth-child(odd) {
          background-color: #f2f3f4;
        }

        &:hover {
          color: #8f2db5;
        }
      }
    }
  }
}
</style>
