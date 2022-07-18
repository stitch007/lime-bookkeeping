<script setup lang="ts">
import TabBar from "./components/TabBar.vue";
const router = useRouter()

const menu = $ref(['/home', '/data', '/user'])
let showTabBar = $ref(false)

router.afterEach(() => {
  showTabBar = menu.includes(router.currentRoute.value.path)
})
</script>

<template>
  <RouterView />
  <TabBar v-show="showTabBar" />
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>
