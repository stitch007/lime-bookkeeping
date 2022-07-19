<script setup lang="ts">
import dayjs from 'dayjs'
import type { PieChartOption } from '@/composables'
import { usePopup, usePieChart } from '@/composables'
import { useAppStore } from '@/stores'

const app = useAppStore()

const {
  el: popupMonthRef,
  current: currentBillDate,
  onSelect: onPopupMonthSelect
} = usePopup(dayjs().format('YYYY-MM'))

let payType = $ref<'expense' | 'income'>('expense')
// 符合条件的账单
const bills = $computed(() => {
  return app.bills.filter((bill) => dayjs(bill.createAt).format('YYYY-MM') === currentBillDate.value)
})
const billsByType = $computed(() => {
  return payType === 'expense' ? app.expenseBillsByType(bills) : app.incomeBillsByType(bills)
})

const getTypeByName = (name: string) => {
  return app.types.find(type => type.name === name)
}

const getProgress = (num: number) => {
  const total = payType === 'expense' ? app.totalExpense(bills) : app.totalIncome(bills)
  return (Math.abs(num) / Math.abs(total)) * 100
}

const option = $computed((): PieChartOption => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    data: billsByType.map(item => item.name)
  },
  series: [
    {
      name: '支出',
      type: 'pie',
      radius: '55%',
      data: billsByType.map(item => {
        return {
          value: Math.abs(item.sum),
          name: item.name
        }
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
}))

const { el: chartEl, setOption } = usePieChart(option)

watch(() => payType, () => setOption(option))
watch(() => currentBillDate.value, () => setOption(option))
</script>

<template>
  <div class="data">
    <div class="total">
      <div class="time" @click="popupMonthRef?.toggle">
        <span>{{ currentBillDate }}</span>
        <VanIcon name="notes-o" />
      </div>
      <div class="title">共支出</div>
      <div class="expense">¥{{ (-app.totalExpense(bills)).toFixed(2) }}</div>
      <div class="income">共收入¥{{ app.totalIncome(bills).toFixed(2) }}</div>
    </div>
    <div class="structure">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            class="expense"
            :class="[payType == 'expense' && 'active']"
            @click="payType = 'expense'"
          >
            支出
          </span>
          <span
            class="income"
            :class="[payType == 'income' && 'active']"
            @click="payType = 'income'"
          >
            收入
          </span>
        </div>
      </div>
      <div class="content">
        <div class="item" v-for="(item, index) in billsByType" :key="index">
          <div class="type" :class="[payType === 'expense' ? 'expense' : 'income']">
            <i class="iconfont" :class="[getTypeByName(item.name)?.icon]" />
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="progress">
            {{ `${getProgress(item.sum).toFixed(2)}%` }}
          </div>
          <VanProgress
            class="percent"
            :percentage="getProgress(item.sum)"
            stroke-width="6px"
            :show-pivot="false"
            track-color="#ffffff" color="#39be77"
          />
          <div class="money">¥{{ Math.abs(item.sum).toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <div class="proportion">
      <div ref="chartEl" />
    </div>
    <PopupMonth ref="popupMonthRef" @select="onPopupMonthSelect" />
  </div>
</template>

<style scoped>
.data {
  min-height: 100%;
  background-color: #f5f5f5;
}

.total {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  margin-bottom: 10px;
}

.total .time {
  position: relative;
  width: 96px;
  padding: 6px;
  background-color: #f5f5f5;
  color: var(--color-text-base);
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.total .time span:nth-child(1)::after {
  content: '';
  position: absolute;
  top: 9px;
  bottom: 8px;
  right: 28px;
  width: 1px;
  background-color: rgba(0, 0, 0, .5);
}

.total .time :deep(.van-icon-notes-o) {
  font-size: 16px;
  color: var(--color-text-caption) !important;
}

.total .title {
  color: var(--primary);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.total .expense {
  font-size: 24px;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 16px;
}

.total .income {
  color: var(--color-text-caption);
  font-size: 12px;
  font-weight: 500;
}

.structure {
  padding: 0 16px;
  background-color: #fff;
  margin-bottom: 10px;
}

.structure .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.structure .head .title {
  font-size: 18px;
  color: var(--color-text-base);
}

.structure .head .tab span {
  display: inline-block;
  width: 40px;
  height: 24px;
  background-color: #f5f5f5;
  font-size: 13px;
  text-align: center;
  line-height: 24px;
  margin-left: 10px;
  border-radius: 4px;
}

.expense.active {
  background-color: rgba(57, 190, 119, 0.2);
  color: var(--primary);
}

.income.active {
  background-color: rgba(236, 190, 37, 0.2);
  color: var(--text-warning);
}

.content .item {
  display: grid;
  grid-template-columns: 2fr 2fr 3fr 8fr 4fr;
  height: 50px;
  align-content: center;
  align-items: center;
  font-size: 14px;
}

.content .item>*:not(.percent) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content .item .type {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

.content .item .type .iconfont {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.content .item .type.expense {
  background-color: var(--primary);
}

.content .item .type.income {
  background-color: var(--text-warning);
}

.content .item .percent {
  margin-left: 6px;
}

.proportion {
  background-color: #fff;
  padding: 12px;
}

.proportion>div {
  width: 100%;
  height: 400px;
}
</style>
