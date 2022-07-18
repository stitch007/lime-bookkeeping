import * as echarts from 'echarts/core'
import type { TitleComponentOption, TooltipComponentOption, LegendComponentOption } from 'echarts/components'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import type { PieSeriesOption } from 'echarts/charts'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

export type PieChartOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>

export const usePieChart = (option: PieChartOption) => {
  const el = ref<HTMLElement | null>(null)
  let chart: echarts.ECharts

  const setOption = (option: PieChartOption) => {
    chart.setOption(option)
  }

  onMounted(() => {
    if (el.value) {
      chart = echarts.init(el.value)
      chart.setOption(option)
    }
  })

  onUnmounted(() => {
    chart.dispose()
  })

  return {
    el,
    setOption,
  }
}
