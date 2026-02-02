export const chartColors = {
  default: ['#1da1f2', '#ea4335', '#c32aa3', '#fbbc05', '#34a853', '#f46f30', '#00a0dc', '#f688bb', '#35465d', '#69c9d0', '#a6b1b7', '#ff9900', '#3f4d51', '#12cad6', '#91bd3a']
}

export const baseChartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  responsive: true
}

export let chartOptionsMain = {
  ...baseChartOptions,
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: 'nearest',
    intersect: 0,
    position: 'nearest'
  },
  scales: {
    yAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.0)',
        zeroLineColor: 'transparent'
      },
      ticks: {
        padding: 20,
        fontColor: '#9a9a9a'
      }
    }],

    xAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: 'transparent'
      },
      ticks: {
        padding: 20,
        fontColor: '#9a9a9a'
      }
    }]
  }
}
