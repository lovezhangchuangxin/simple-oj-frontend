<template>
  <div>
    <el-container>
      <el-main>
        <MdViewer :value="bulletin?.content" :style="viewerStyle" />
      </el-main>
      <el-aside width="250px">
        <div class="base-info">
          <h2>发布人：{{ author }}</h2>
          <p>
            创建于：{{
              bulletin?.createTime && formatTime(bulletin.createTime)
            }}
          </p>
          <p>
            更新于：{{
              bulletin?.updateTime && formatTime(bulletin.updateTime)
            }}
          </p>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { Bulletin, BulletinApi } from '@simple-oj-frontend/api'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MdViewer from '@/components/md-viewer/MdViewer.vue'
import { formatTime } from '@/utils/common/common'

const route = useRoute()
const id = Number(route.params.id)
const bulletin = ref<Bulletin>()
const author = ref('')

const viewerStyle: Partial<CSSStyleDeclaration> = {
  border: '1px solid #ebeef5',
  borderTop: 'none',
  borderBottom: 'none',
  padding: '0 20px',
}

onMounted(async () => {
  const res = await BulletinApi.getBulletinById(id)
  if (res.code === 0) {
    bulletin.value = res.data.data
    author.value = res.data.author
  }
})
</script>

<style scoped lang="less">
main {
  padding-right: 60px;
}

.base-info {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  h2 {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 500;
    color: #b378fa;
    gap: 6px;
  }

  p {
    margin-bottom: 6px;
    font-size: 14px;
    color: #606266;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
