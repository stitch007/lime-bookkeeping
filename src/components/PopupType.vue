BillType<script setup lang="ts">
import type { BillType } from '@/stores'
import { useAppStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { allType: all, expenseTypes, incomeTypes } = storeToRefs(useAppStore())

const emit = defineEmits<{ (e: 'select', type: BillType): void }>()

let show = $ref(false)
let active = $ref(0)

const toggle = () => show = !show

const chose = (type: BillType) => {
  active = type.id
  show = false
  emit('select', type)
}

defineExpose({ toggle })
</script>

<template>
  <VanPopup v-model:show="show" position="bottom" round>
    <div class="popup">
      <header class="header">
        请选择类型
        <VanIcon name="cross" class="cross" @click="toggle" />
      </header>
      <main class="content">
        <div @click="chose(all)" :class="{ all: true, active: active === 0 }">
          全部类型
        </div>
        <div class="title">支出</div>
        <div class="expense">
          <p 
            v-for="item in expenseTypes" 
            :key="item.id" @click="chose(item)" 
            :class="{ active: active === item.id }"
          >
            {{ item.name }}
          </p>
        </div>
        <div class="title">收入</div>
        <div class="income">
          <p 
            v-for="item in incomeTypes"
            :key="item.id" @click="chose(item)" 
            :class="{ active: active === item.id }"
          >
            {{ item.name }}
          </p>
        </div>
      </main>
    </div>
  </VanPopup>
</template>

<style scoped>
.popup {
  position: relative;
  background-color: #f5f5f5;
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 56px;
  text-align: center;
  font-size: 16px;
  line-height: 56px;
  color: var(--color-text-base);
  background-color: #fff;
}

.cross {
  position: absolute;
  left: 10px;
  top: 50%;
  font-size: 20px;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.content {
  padding: 20px;
}

.all {
  display: inline-block;
  padding: 12px 20px;
  font-size: 16px;
  color: var(--color-text-base);
  background-color: #fff;
}

.title {
  color: var(--color-text-caption);
  margin: 10px 0;
  font-size: 14px;
}

.expense,
.income {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
}

.expense p,
.income p {
  text-align: center;
  padding: 12px 0;
  margin: 0;
  background-color: #fff;
  font-size: 16px;
}

.active {
  background-color: var(--primary) !important;
  color: #fff;
}
</style>
