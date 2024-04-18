<template>
  <el-scrollbar>
    <div class="viewer-wrapper" style="min-width: 400px; overflow: auto">
      <MdViewer :value="content"></MdViewer>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import MdViewer from '@/components/md-viewer/MdViewer.vue'

defineProps<{
  content: string
}>()
</script>

<style scoped lang="less">
:deep(.splitpanes__pane) {
  overflow: auto;
  background-color: #ffffff;
}

:deep(.splitpanes__splitter) {
  background-color: #f0f0f0;

  &:hover {
    background-color: #d5d5d5;
  }
}

:deep(.splitpanes__pane) {
  overflow: auto;
  background-color: #ffffff;
}

:deep(.splitpanes__splitter) {
  background-color: #f0f0f0;

  &:hover {
    background-color: #d5d5d5;
  }
}

:deep(.markdown-body) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 12px;
    border: none;
  }

  h1 {
    margin-bottom: 8px;
  }

  .sample {
    display: flex;
    gap: 20px;

    & > div {
      flex: 1;
    }
  }
}
</style>
