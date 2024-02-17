<template>
  <div class="problem-solve-page">
    <splitpanes class="default-theme">
      <pane size="45">
        <el-scrollbar>
          <div class="viewer-wrapper" style="min-width: 400px; overflow: auto">
            <MdViewer :value="value"></MdViewer>
          </div>
        </el-scrollbar>
      </pane>
      <pane size="55">
        <splitpanes horizontal>
          <pane>
            <MonacoEditor v-model="code" />
          </pane>
          <pane>3</pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import MdViewer from '@/components/md-viewer/MdViewer.vue'
import MonacoEditor from '@/components/monaco-editor/MonacoEditor.vue'

const route = useRoute()
const pname = ref()

watchEffect(() => {
  pname.value = route.params.pname
})

const value = `
# 1.两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

示例 1：

> - 输入：nums = [2,7,11,15], target = 9
> - 输出：[0,1]
> - 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

示例 2：

> - 输入：nums = [3,2,4], target = 6
> - 输出：[1,2]

示例 3：

> - 输入：nums = [3,3], target = 6
> - 输出：[0,1]

提示：

- 2 <= nums.length <= 104
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- 只会存在一个有效答案
`

const code = ref(`#include<stdio.h>

int main()
{
    return 0;
}
`)
</script>

<style scoped lang="less">
.problem-solve-page {
  height: calc(100vh - 108px);

  :deep(.splitpanes__pane) {
    background-color: #ffffff;
  }

  :deep(.splitpanes__splitter) {
    background-color: #f0f0f0;

    &:hover {
      background-color: #d5d5d5;
    }
  }
}
</style>
