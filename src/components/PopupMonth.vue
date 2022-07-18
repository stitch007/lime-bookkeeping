<script setup lang="ts">
import dayjs from 'dayjs'

const emit = defineEmits<{ (e: 'select', date: string): void }>()

let show = $ref(false)
let date = $ref(new Date())

const toggle = () => show = !show

const chose = (date: Date) => {
  show = false
  emit('select', dayjs(date).format('YYYY-MM'))
}

const formatter = (type: string, val: string) => {
  if (type === 'year') {
    return `${val}年`
  } else if (type === 'month') {
    return `${val}月`
  }
  return val
}

defineExpose({ toggle })
</script>

<template>
  <VanPopup v-model:show="show" position="bottom" round :style="{ height: '46%' }">
    <VanDatetimePicker
      v-model="date"
      type="year-month"
      title="选择年月"
      :formatter="formatter"
      @confirm="chose"
      @cancel="toggle"
    />
  </VanPopup>
</template>

<style scoped>
</style>
