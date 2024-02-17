<template>
  <div class="not-found">
    <h1>404</h1>
    <p>
      对不起！该页面未找到，<strong>{{ timeout }}</strong> 秒后自动跳转
      <router-link to="/">首页</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const timeout = ref(5)

let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    timeout.value--
    if (timeout.value <= 0) {
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.not-found {
  margin-top: 160px;
  text-align: center;
  font-weight: 400;

  h1 {
    font-size: 60px;
    margin-bottom: 30px;
  }

  p {
    font-size: 20px;
  }
}
</style>
