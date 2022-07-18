BillType<script setup lang="ts">
import dayjs from 'dayjs'
import type { Bill } from '@/stores'
import { useAppStore } from '@/stores'
import { Dialog, Toast } from 'vant'
import 'vant/es/dialog/style'
import 'vant/es/toast/style'

const VanDialog = Dialog.Component

const props = defineProps<{ bill?: Bill }>()

const app = useAppStore()

const newBill = reactive({
  typeId: props.bill?.typeId || 1,
  amount: props.bill?.amount || 0,
  note: props.bill?.note || '',
  createAt: props.bill?.createAt || new Date(),
})

// 是否显示弹出框
let showPopupAdd = $ref(false)
const toggle = () => showPopupAdd = !showPopupAdd
defineExpose({ toggle })

// 显示时期选择器
let showDatetimePicker = $ref(false)
let datetimePickerTime = $ref(newBill.createAt)
const formatDate = $computed(() => dayjs(datetimePickerTime).format('YYYY-MM-DD'))

// 显示输入备注的对话框
let showNoteDialog = $ref(false)

// 支出的类型
let payType = $ref<'expense' | 'income'>(newBill.amount > 0 ? 'income' : 'expense')
const changePayType = (type: 'expense' | 'income') => {
  payType = type
  newBill.typeId = type === 'expense' ? app.expenseTypes[0].id : app.incomeTypes[0].id
}

// 数字键盘的值
let keyboardValue = $ref(newBill.amount !== 0 ? String(Math.abs(newBill.amount)) : '')
// 监听输入框改变值
const onKeyboardInput = (value: string) => {
  // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加
  if (value == '.' && keyboardValue.includes('.')) return
  // 最高只能到小数点后两位
  if (value != '.' && keyboardValue.includes('.') && keyboardValue.split('.')[1].length >= 2) return
  keyboardValue += value
}
// 删除输入框内容
const onKeyboardDelete = () => {
  keyboardValue = keyboardValue.slice(0, keyboardValue.length - 1)
}

const onAddButtonClick = () => {
  newBill.amount = payType === 'expense' ? -Number(keyboardValue) : Number(keyboardValue)
  newBill.createAt = new Date(datetimePickerTime)
  if (newBill.amount === 0) {
    Toast.fail('请输入具体金额')
    return
  }
  if (props.bill) {
    app.updateBill(props.bill.id, newBill)
  } else {
    app.addBill(newBill)
  }
  showPopupAdd = false
  Toast.success('添加成功')
}
</script>

<template>
  <VanPopup v-model:show="showPopupAdd" position="bottom" round>
    <div class="popup-add">
      <div class="header">
        <VanIcon name="cross" class="close" @click="showPopupAdd = false" />
        <VanButton class="add-button" type="primary" size="small" @click="onAddButtonClick">
          确定
        </VanButton>
      </div>
      <div class="filter">
        <div>
          <span 
            :class="['expense', payType === 'expense' && 'active']"
            @click="changePayType('expense')"
          >
            支出
          </span>
          <span 
            :class="['income', payType === 'income' && 'active']" 
            @click="changePayType('income')"
          >
            收入
          </span>
        </div>
        <div class="time" @click="showDatetimePicker = true">
          {{ formatDate }}
          <i class="iconfont sort-down" />
        </div>
      </div>
      <div class="money">
        <span class="prefix">¥</span>
        <span class="amount">{{ keyboardValue }}</span>
      </div>
      <div class="type">
        <div>
          <div
            class="type-item"
            v-for="item in (payType === 'expense' ? app.expenseTypes : app.incomeTypes)"
            :key="item.id"
            @click="newBill.typeId = item.id"
          >
            <span :class="[newBill.typeId === item.id && 'active', payType, 'iconfont-wrap']">
              <i class="iconfont" :class="[item.icon]" />
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="note" @click="showNoteDialog = true">
        {{ newBill.note.length ? newBill.note : '添加备注' }}
      </div>
      <VanNumberKeyboard 
        :show="true" 
        extra-key="." 
        @delete="onKeyboardDelete" 
        @input="onKeyboardInput" 
      />
    </div>
    <VanDialog v-model:show="showNoteDialog" title="备注" show-cancel-button>
      <VanField
        v-model="newBill.note"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入备注"
        show-word-limit
      />
    </VanDialog>
    <VanPopup 
      v-model:show="showDatetimePicker" 
      position="bottom" 
      round
      :style="{ height: '46%' }"
    >
      <VanDatetimePicker
        v-model="datetimePickerTime"
        type="date"
        title="选择时间"
        @confirm="showDatetimePicker = false"
        @cancel="showDatetimePicker = false"
      />
    </VanPopup>
  </VanPopup>
</template>

<style scoped>
.popup-add {
  padding-top: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.popup-add :deep(.van-icon-cross) {
  font-size: 20px;
  color: var(--color-text-secondary);
}

.close {
  display: flex;
  align-items: center;
}

.add-button {
  padding: 0 12px;
  background-color: var(--primary);
  border-color: var(--primary);
}

.filter {
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter span {
  display: inline-block;
  background: #f5f5f5;
  color: var(--color-text-caption);
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 24px;
  border: 1px solid #f5f5f5;
}

.filter .expense {
  margin-right: 6px;
}

.filter .expense.active {
  background-color: #eafbf6;
  border-color: var(--primary);
  color: var(--primary);
}

.filter .income.active {
  background-color: #fbf8f0;
  border-color: var(--text-warning);
  color: var(--text-warning);
}

.time {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  background-color: #f0f0f0;
  border-radius: 20px;
  color: var(--color-text-base);
}

.time .sort-down {
  font-size: 12px;
  margin-left: 5px;
}

.money {
  padding-bottom: 12px;
  border-bottom: 1px solid #e9e9e9;
  margin: 0 24px;
}

.money .prefix {
  font-size: 36px;
  font-weight: bold;
  vertical-align: top;
}

.money .amount {
  font-size: 40px;
  padding-left: 10px;
}

.money .amount::after {
  content: '';
  display: inline-block;
  margin-left: 5px;
  width: 2px;
  height: 28px;
  animation: blink 1s infinite steps(1, start);
}

@keyframes blink {
  0% {
    background-color: white;
  }

  50% {
    background-color: var(--color-text-secondary);
  }

  100% {
    background-color: white;
  }
}

.type {
  display: flex;
  overflow-x: auto;
  margin: 0 24px;
  margin-bottom: 20px;
}

.type>div {
  display: flex;
  white-space: nowrap;
}

.type * {
  touch-action: pan-x;
}

.type-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 12px 10px 12px;
}

.iconfont-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.iconfont-wrap .iconfont {
  color: var(--color-text-caption);
  font-size: 20px;
}

.expense.active {
  background-color: var(--primary);
}

.expense.active .iconfont {
  color: #fff;
}

.income.active {
  background-color: var(--text-warning);
}

.income.active .iconfont {
  color: #fff;
}

.note {
  padding: 0 24px;
  padding-bottom: 12px;
  color: #4b67e2;
}

.popup-add :deep(.van-number-keyboard) {
  position: unset;
}

.popup-add :deep(.van-dialog__confirm) {
  color: var(--primary);
}
</style>
