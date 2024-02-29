<template>
  <div class="contribution-box">
    <table>
      <thead>
        <tr>
          <th colspan="3"></th>
          <th
            v-for="({ month, col }, index) in monthCols"
            :colspan="col"
            :key="index"
          >
            {{ col >= 2 ? monthPrefix[month] : '' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in 7" :key="day">
          <td colspan="3" class="day-prefix" :width="size * 2" :height="size">
            <div>{{ dayPrefix[day - 1] }}</div>
          </td>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="`${data[getDateString(week - 1, day - 1)] || 0}次提交 ${getDateString(
              week - 1,
              day - 1,
            )}`"
            placement="top"
            v-for="week in weeks"
            :key="week"
            :disabled="!isBetween(week - 1, day - 1)"
          >
            <td
              :width="size"
              :height="size"
              :style="{
                backgroundColor: getBackgroundColor(week - 1, day - 1),
              }"
            ></td>
          </el-tooltip>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'

interface ContributionProps {
  from: string
  to: string
  data: { [day: string]: number }
  size?: number
}

// 不能在解构的时候使用默认值！而是要在 withDefaults 中使用
const props = withDefaults(defineProps<ContributionProps>(), {
  size: 12,
})

const { from, to, data, size } = toRefs(props)

const now = new Date()
const fromDate = new Date(from.value)
const toDate = new Date(to.value)
const milisecondsPerDay = 1000 * 60 * 60 * 24

const weeks =
  (toDate.getTime() / milisecondsPerDay +
    (7 - toDate.getDay()) -
    (fromDate.getTime() / milisecondsPerDay - fromDate.getDay())) /
  7

// 获取日期，week 和 day 都是从 0 开始
const getDate = (week: number, day: number) => {
  return new Date(
    fromDate.getTime() +
      (week * 7 + day - fromDate.getDay()) * milisecondsPerDay,
  )
}

// 获取日期字符串
const getDateString = (week: number, day: number) => {
  const date = getDate(week, day)
  return date.toISOString().split('T')[0]
}

// 计算日期是否在 from 和 to 之间
const isBetween = (week: number, day: number) => {
  const date = getDate(week, day)
  return date >= fromDate && date <= toDate
}

// 计算背景颜色
const getBackgroundColor = (week: number, day: number) => {
  const date = new Date(
    fromDate.getTime() +
      (week * 7 + day - fromDate.getDay()) * milisecondsPerDay,
  )
  if (date > now) {
    return '#ffffff'
  }
  const key = date.toISOString().split('T')[0]
  const count = data.value[key]
  if (count === undefined) {
    return ''
  } else if (count === 0) {
    return '#ebedf0'
  } else if (count <= 3) {
    return '#c6e48b'
  } else if (count <= 6) {
    return '#7bc96f'
  } else if (count <= 9) {
    return '#239a3b'
  } else {
    return '#196127'
  }
}

const monthPrefix = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const dayPrefix = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const monthCols = ref<
  {
    month: number
    col: number
  }[]
>([])

onMounted(() => {
  let lastMonth = getDate(0, 0).getMonth()
  let lastCols = 0

  for (let week = 0; week < weeks; week++) {
    const month = getDate(week, 0).getMonth()
    if (month === lastMonth) {
      lastCols++
      continue
    }
    monthCols.value.push({
      month: lastMonth,
      col: lastCols,
    })
    lastMonth = month
    lastCols = 1
  }

  monthCols.value.push({
    month: lastMonth,
    col: lastCols,
  })
})
</script>

<style scoped lang="less">
.contribution-box {
  th {
    font-size: 12px;
    font-weight: 400;
    color: #4c4c4c;
    padding-left: 5px;
    text-align: left;
  }

  td {
    background-color: #f5f5f5;
    border-radius: 2px;
    cursor: pointer;
  }

  .day-prefix {
    line-height: 10px;
    font-size: 10px;
    background-color: #fff;
  }
}
</style>
