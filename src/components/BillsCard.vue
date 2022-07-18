<script setup lang="ts">
import dayjs from 'dayjs'
import type { Bill } from '@/stores'
import { useAppStore } from '@/stores'

interface Props {
  date: string
  bills: Bill[]
}

const { date, bills } = defineProps<Props>()

const app = useAppStore()
</script>

<template>
  <VanCellGroup class="bills">
    <div class="date">
      <div>{{ date }}</div>
      <div class="money">
        <span>
          <b>出</b>
          {{ `${(app.totalExpense(bills)).toFixed(2)}` }}
        </span>
        <span>
          <b>入</b>
          {{ `${app.totalIncome(bills).toFixed(2)}` }}
        </span>
      </div>
    </div>
    <VanCell 
      v-for="bill in bills"
      :key="bill.id"
      :class="[bill.amount > 0 ? 'income' : 'expense']" 
      @click="$router.push({ path: '/detail', query: { id: bill.id }})" 
      :title="app.types.find(type => type.id === bill.typeId)?.name"
      :value="bill.amount > 0 ? `+${bill.amount.toFixed(2)}` : `${bill.amount.toFixed(2)}`"
      :label="dayjs(bill.createAt).format('HH:mm')"
    />
  </VanCellGroup>
</template>

<style scoped>
.bills {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.date {
  height: 60px;
  display: flex;
  background-color: #f9f9f9;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 14px;
  color: var(--color-text-base);
}

.date > div {
  color: var(--color-text-base);
}

.money span {
  margin-left: 20px; 
}

.money span b {
  color: var(--color-text-caption);
  font-weight: normal;
  background-color: #f5f5f5;
  padding: 3px;
  margin-right: 2px;
}

.expense :deep(.van-cell__value) {
  color: var(--color-text-base) !important;
}

.income :deep(.van-cell__value) {
  color: var(--text-warning) !important;
}
</style>
