import { utils, write } from 'xlsx'

export const download = (url: string, name: string) => {
  const a = document.createElement('a')
  a.download = name
  a.href = url
  a.click()
}

export const useExport = (name: string) => {
  const helper = (data: unknown[], type: 'xlsx' | 'csv') => {
    const sheet = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, sheet, name)
    return write(wb, { bookType: type, bookSST: true, type: 'array' });
  }

  return {
    exportToExcel: (data: unknown[]) => {
      const url = URL.createObjectURL(new Blob([helper(data, 'xlsx')], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }))
      download(url, `${name}.xlsx`)
    },
    exportToCSV: (data: unknown[]) => {
      const url = URL.createObjectURL(new Blob([helper(data, 'csv')], {
        type: "text/csv"
      }))
      download(url, `${name}.csv`)
    },
    exportToJSON: (data: unknown[]) => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      }))
      download(url, `${name}.json`)
    },
  }
}
