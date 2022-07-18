<script setup lang="ts">
import dayjs from 'dayjs'
import { useAppStore } from '@/stores'
import { Dialog, Toast } from 'vant'
import 'vant/es/dialog/style'
import 'vant/es/toast/style'
import { usePopup } from '@/composables'

const app = useAppStore()
const route = useRoute()
const router = useRouter()

const id = route.query.id?.toString()
const bill = $computed(() => app.bills.find(item => item.id === id))
const type = $computed(() => app.types.find(item => item.id === bill?.typeId))

const { el: popupAddRef } = usePopup()

const deleteBill = () => {
  Dialog.confirm({
    title: '删除',
    message: '确认删除账单？',
  }).then(async () => {
    bill?.id && app.deleteBill(bill.id)
    Toast.success('删除成功')
    router.back()
  })
}
</script>

<template>
  <div class="detail">
    <NavBar title="账单详情" />
    <div v-if="bill && type" class="card">
      <div class="type">
        <span :class="[bill?.amount > 0 ? 'income' : 'expense']">
          <i class="iconfont" :class="[type.icon]" />
        </span>
        <span>{{ type.name || '' }}</span>
      </div>
      <div class="amount">
        {{ bill.amount > 0 ? `+${bill.amount.toFixed(2)}` : `${bill.amount.toFixed(2)}` }}
      </div>
      <div class="info">
        <div class="time">
          <span>记录时间</span>
          <span>{{ `${dayjs(bill.createAt).format('YYYY-MM-DD HH:mm')}` }}</span>
        </div>
        <div class="note">
          <span>备注</span>
          <span>{{ bill.note || '-' }}</span>
        </div>
      </div>
      <div class="operation">
        <span class="van-hairline--right" @click="deleteBill"><van-icon name="delete" />
          删除
        </span>
        <span @click="popupAddRef?.toggle()">
          <van-icon name="edit" />
          编辑
        </span>
      </div>
      <PopupAdd ref="popupAddRef" :bill="bill" />
    </div>
    <div v-else class="tip">
      没找到这个账单~
    </div>
  </div>
</template>

<style scoped>
.detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 12px 24px 0 24px;
}

.detail .tip {
  text-align: center;
  color: var(--color-text-caption);
}

.card {
  border-radius: 12px;
  background-color: #fff;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card .type {
  padding: 24px 0 12px 0;
}

.card .type span:nth-child(1) {
  display: inline-block;
  width: 22px;
  height: 22px;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  margin-right: 8px;
}

.card .type .expense {
  background-color: var(--primary);
}

.card .type .income {
  background-color: var(--text-warning);
}

.card .amount {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.info {
  width: 100%;
  font-size: 14px;
  text-align: left;
}

.info .time {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;        
}

.info .time span:nth-child(1) {
  flex: 3;
  color: var(--color-text-caption);
}

.info .time span:nth-child(2) {
  flex: 9;
}

.info .note {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.info .note span:nth-child(1) {
  flex: 3;
  color: var(--color-text-caption);
}

.info .note span:nth-of-type(2) {
  flex: 9;
  color: var(--color-text-base);
}

.operation {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.van-icon {
  margin-right: 4px;
}

.operation span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1
}

.operation span:nth-child(1) {
  color: red;
}
</style>
