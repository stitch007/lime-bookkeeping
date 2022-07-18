<script setup lang="ts">
const router = useRouter()

let active = $ref('/home')

const go = (path: string) => {
  router.push(path)
}

onMounted(() => {
  active = router.currentRoute.value.path
})

router.afterEach(() => {
  active = router.currentRoute.value.path
})
</script>

<template>
  <VanTabbar v-model="active">
    <VanTabbarItem name="/home" icon="notes-o" @click="go('/home')">
      明细
    </VanTabbarItem>
    <VanTabbarItem name="/data" icon="bar-chart-o" @click="go('/data')">
      统计
    </VanTabbarItem>
    <VanTabbarItem name="/user" icon="user-o" @click="go('/user')">
      我的
    </VanTabbarItem>
  </VanTabbar>
</template>

<style>
.van-tabbar-item--active {
  color: var(--primary) !important;
} 
</style>
