import { Line, mixins } from 'vue-chartjs'

export default {
  name: 'line-chart',
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'chartId', 'extraOptions'],
  data () {
    return {
      ctx: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.extraOptions)
  },
  watch: {
    'chartData' (to, from) {
      this.renderChart(this.chartData, this.extraOptions)
    }
  }
}
