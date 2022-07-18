<script setup lang="ts">
interface Props {
  title: string
}

const { title } = defineProps<Props>()
</script>

<template>
  <div class="block"></div>
  <VanNavBar 
    class="header"
    @click-left="$router.back()"
    :title="title"
    left-text="返回"
    left-arrow
  >
    <template #right>
      <i class="iconfont more" />
    </template>
  </VanNavBar>
</template>

<style scoped>
.block {
  width: 100%;
  height: 46px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.header .more {
  font-size: 20px;
}
</style>
