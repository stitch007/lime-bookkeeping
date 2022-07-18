import { defineStore } from "pinia"
import { nanoid } from 'nanoid'

export interface AppState {
  types: BillType[]
  bills: Bill[]
}

export interface BillType {
  id: number
  name: string
  // 0: all, 1: expense, 2: income
  type: number
  icon: string
}

export interface Bill {
  // 唯一id nanoid生成
  id: string
  typeId: number
  amount: number
  note: string
  createAt: Date
}

export interface BillByType {
  name: string
  sum: number
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    types: [
      { id: 0, name: '全部类型', type: 0, icon: 'types' },
      { id: 1, name: '餐饮', type: 1, icon: 'eat' },
      { id: 2, name: '服饰', type: 1, icon: 'clothes' },
      { id: 3, name: '交通', type: 1, icon: 'traffic' },
      { id: 4, name: '日用', type: 1, icon: 'daily-expenses' },
      { id: 5, name: '购物', type: 1, icon: 'shopping' },
      { id: 6, name: '学习', type: 1, icon: 'study' },
      { id: 7, name: '医疗', type: 1, icon: 'medical' },
      { id: 8, name: '旅行', type: 1, icon: 'travel' },
      { id: 9, name: '人情', type: 1, icon: 'human-feelings' },
      { id: 10, name: '其他', type: 1, icon: 'other' },
      { id: 11, name: '工资', type: 2, icon: 'salary' },
      { id: 12, name: '奖金', type: 2, icon: 'bonus' },
      { id: 13, name: '转账', type: 2, icon: 'transfer-accounts' },
      { id: 14, name: '理财', type: 2, icon: 'financing' },
      { id: 15, name: '退款', type: 2, icon: 'refund' },
      { id: 16, name: '其他', type: 2, icon: 'other' },
    ],
    bills: []
  }),
  getters: {
    allType(): BillType {
      return this.types[0]
    },
    expenseTypes(): BillType[] {
      return this.types.filter(item => item.type === 1)
    },
    incomeTypes(): BillType[] {
      return this.types.filter(item => item.type === 2)
    },
    expenseBills(): Bill[] {
      return this.bills.filter(item => item.amount < 0)
    },
    incomeBills(): Bill[] {
      return this.bills.filter(item => item.amount > 0)
    },
    billsByType(state) {
      return (bills = state.bills) => {
        return bills.reduce<BillByType[]>((prev, cur) => {
          const type = state.types.find(item => item.id === cur.typeId)!
          const find = prev.find(item => item.name === type.name)
          if (find) {
            find.sum += cur.amount
          } else {
            prev.push({ name: type.name, sum: cur.amount })
          }
          return prev
        }, [])
      }
    },
    expenseBillsByType(state) {
      return (bills = state.bills) => this.billsByType(bills).filter(item => item.sum < 0)
    },
    incomeBillsByType(state) {
      return (bills = state.bills) => this.billsByType(bills).filter(item => item.sum > 0)
    },
    totalIncome(state) {
      return (bills = state.bills) => bills
        .filter(item => item.amount > 0)
        .reduce((sum, cur) => sum + cur.amount, 0)
    },
    totalExpense(state) {
      return (bills = state.bills) => bills
        .filter(item => item.amount < 0)
        .reduce((sum, cur) => sum + cur.amount, 0)
    },
  },
  actions: {
    addBill({ typeId, amount, note, createAt }: Omit<Bill, 'id'>) {
      this.$patch((state) => {
        state.bills.push({
          typeId,
          id: nanoid(10),
          amount,
          note,
          createAt,
        })
      })
    },
    updateBill(id: string, { typeId: type, amount, note, createAt }: Partial<Omit<Bill, 'id'>>) {
      this.$patch((state) => {
        const record = state.bills.find(item => item.id === id)
        if (record) {
          type && (record.typeId = type)
          amount && (record.amount = amount)
          note && (record.note = note)
          createAt && (record.createAt = createAt)
        }
      })
    },
    deleteBill(id: string) {
      this.$patch((state) => {
        const index = state.bills.findIndex(item => item.id === id)
        index >= 0 && state.bills.splice(index, 1)
      })
    },
  },
  persist: true,
})
