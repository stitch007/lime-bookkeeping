<script setup lang="ts">
import dayjs from 'dayjs'
import type { Bill } from '@/stores'
import { useAppStore } from '@/stores'
import { usePopup } from '@/composables'

const app = useAppStore()

const {
  el: popupTypeRef,
  current: currentBillType,
  onSelect: onPopupTypeSelect
} = usePopup(app.allType)

const { el: popupAddRef } = usePopup()

const {
  el: popupMonthRef,
  current: currentBillDate,
  onSelect: onPopupMonthSelect
} = usePopup(dayjs().format('YYYY-MM'))

// 符合条件的账单
const bills = $computed(() => {
  return app.bills.filter((bill) => {
    return (currentBillType.value?.id === 0 || bill.typeId === currentBillType.value?.id)
      && dayjs(bill.createAt).format('YYYY-MM') === currentBillDate.value
  })
})

// 每月账单
const monthlyBill = $computed(() => {
  const map = new Map<string, Bill[]>()
  bills.forEach((bill) => {
    const date = dayjs(bill.createAt).format('YYYY-MM-DD')
    if (map.has(date)) {
      map.get(date)?.push(bill)
    } else {
      map.set(date, [bill])
    }
  })
  return map
})
</script>

<template>
  <div class="home">
    <header class="header">
      <div class="type-wrapper" @click="popupTypeRef?.toggle()">
        <span>{{ currentBillType?.name }}</span>
        <i class="iconfont" :class="[currentBillType?.icon]" />
      </div>
      <div class="data-wrapper">
        <span class="time" @click="popupMonthRef?.toggle()">
          {{ currentBillDate }}
          <i class="iconfont sort-down" />
        </span>
        <span class="expense">
          总支出 ¥{{ (-app.totalExpense(bills)).toFixed(2) }}
        </span>
        <span class="income">
          总收入 ¥{{ app.totalIncome(bills).toFixed(2) }}
        </span>
      </div>
    </header>
    <main class="content">
      <template v-if="bills.length">
        <BillsCard 
          v-for="([date, bills], index) in monthlyBill" 
          :key="index" 
          :bills="bills" 
          :date="date" 
        />
      </template>
      <template v-else>
        <div class="tip">没有更多了~</div>
      </template>
    </main>
    <div class="add" @click="popupAddRef?.toggle()">
      <VanIcon name="records" />
      <span>记一笔</span>
    </div>
    <PopupType ref="popupTypeRef" @select="onPopupTypeSelect" />
    <PopupMonth ref="popupMonthRef" @select="onPopupMonthSelect" />
    <PopupAdd ref="popupAddRef" />
  </div>
</template>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 90px;
  background-color: var(--primary);
  color: #fff;
  font-size: 14px;
  padding: 20px 20px;
  z-index: 100;
}

.type-wrapper {
  background-color: #50ca84;
  display: inline-block;
  padding: 6px 8px;
  border-radius: 4px;
  position: relative;
  align-self: baseline;
}

.type-wrapper>span {
  display: inline-block;
  padding-right: 6px;
}

.data-wrapper {
  margin-top: 10px;
  font-size: 14px;
}

.data-wrapper .time {
  margin-right: 12px;
}

.data-wrapper .time .sort-down {
  font-size: 12px;
}

.data-wrapper .expense {
  margin-right: 10px;
}

.add {
  position: fixed;
  bottom: 80px;
  right: 20px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #e9e9e9;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  color: var(--primary);
  font-weight: bold;
}

.add > :nth-child(1) {
  font-size: 20px;
}

.add > span {
  font-size: 14px;
}

.content {
  height: calc(100% - 50px);
  overflow: hidden;
  overflow-y: scroll;
  background-color: #f5f5f5;
  padding: 10px;
}

.content .tip {
  text-align: center;
  color: var(--color-text-caption);
}
</style>
