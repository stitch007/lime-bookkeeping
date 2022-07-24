<script setup lang="ts">
import { useExport } from '@/composables'
import { useAppStore } from '@/stores'
import dayjs from 'dayjs';

const app = useAppStore()

const exportBills = $computed(() => {
  return app.bills.map(bill => ({
    id: bill.id,
    '类型': app.types.find(type => type.id === bill.typeId)?.name ?? '未知类型',
    '金额': bill.amount,
    '备注': bill.note,
    '账单创建时间': dayjs(bill.createAt).format('YYYY-MM-DD HH:mm:ss'),
  }))
})

const { exportToExcel, exportToCSV, exportToJSON } = useExport('账单')
</script>

<template>
  <div class="user">
    <div class="head">
      <img class="logo" src="../assets/lime.png" />
      <div class="info">
        <div class="name">青柠记账</div>
      </div>
    </div>
    <div class="content">
      <VanCell @click="exportToExcel(exportBills)" is-link>💣 导出账单为excel</VanCell>
      <VanCell @click="exportToCSV(exportBills)" is-link>🧨 导出账单为csv</VanCell>
      <VanCell @click="exportToJSON(exportBills)" is-link>🔥 导出账单为json</VanCell>
    </div>
  </div>
</template>

<style scoped>
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 12px;
}

.head {
  display: flex;
  background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.head .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin-right: 10px;
}

.head .info .name {
  font-size: 18px;
  color: #fff;
  font-weight: 500;
}
</style>
