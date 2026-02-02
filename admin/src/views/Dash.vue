<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar :has-right-visible="false">
      <b-icon icon="monitor-dashboard" size="is-medium"/>
      Escritorio
    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <card-widget class="tile is-child" type="is-info" icon="shopping" :number="shopsCount" :link="'/shops'" label="Tiendas"/>
        <card-widget class="tile is-child" type="is-danger" icon="cash-usd" prefix="$" :number="salesCount" :link="'/sales'" label="Ventas"/>
        <card-widget class="tile is-child" type="is-warning" icon="clipboard-text-multiple-outline" :number="itemsCount" :link="'/stock'" label="Stock"/>
        <card-widget class="tile is-child" type="is-success" icon="gesture-tap-button" :number="eventsCount" :link="'/'" label="Eventos"/>
        <!--card-widget class="tile is-child" type="is-primary" icon="email" :number="contactsCount" :link="'/contacts'" label="Consultas"/-->
      </tiles>
      <div class="field is-hpadded has-text-right">
        <div class="select">
          <select v-model="days" @change="setFromSpan()">
            <option value="0.010416666">15 minutos</option>
            <option value="0.020833333">30 minutos</option>
            <option value="0.041666667">1 hora</option>
            <option value="0.125">3 horas</option>
            <option value="0.25">6 horas</option>
            <option value="0.5">12 horas</option>
            <option value="1">24 horas</option>
            <option value="2">48 horas</option>
            <option value="7">7 días</option>
            <option value="15">15 días</option>
            <option value="30">30 días</option>
            <option value="60">60 días</option>
            <option value="90">90 días</option>
            <option value="365">1 año</option>
          </select>
        </div>
      </div>
      <div class="field">
        <card-component title="Actividad por tienda" icon="shopping">
          <div v-if="shopChart.chartData" class="chart-area">
            <line-chart style="height: 100%"
              ref="shopData"
              chart-id="chart"
              :chart-data="shopChart.chartData"
              :extra-options="shopChart.extraOptions">
            </line-chart>
          </div>
        </card-component>
      </div>
      <div class="field">
        <card-component title="Actividad por evento" icon="chart-bell-curve">
          <div v-if="defaultChart.chartData" class="chart-area">
            <line-chart style="height: 100%"
              ref="chartData"
              chart-id="chart"
              :chart-data="defaultChart.chartData"
              :extra-options="defaultChart.extraOptions">
            </line-chart>
          </div>
        </card-component>
      </div>
      <div class="field">
        <!--pre v-html="mapFeatures"/-->
        <card-component title="Heatmap" icon="fire" class="animated fadeIn delay2" :is-paddingless="true">
          <div id="map" class="card-map"></div>
        </card-component>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
// @ is an alias to /src
import moment from 'moment'
import * as chartConfig from '@/components/Charts/chart.config'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardWidget from '@/components/CardWidget'
import CardComponent from '@/components/CardComponent'
import PlaySound from '@/components/PlaySound'
import LineChart from '@/components/Charts/LineChart'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'dash',
  components: {
    NavBar,
    AsideMenu,
    LineChart,
    CardComponent,
    CardWidget,
    Tiles,
    HeroBar
  },
  data () {
    return {
      salesData: [],
      groupCharts: [],
      mapFeatures: [],
      events: {},
      eventsCount: 0,
      itemsCount: 0,
      days: localStorage.getItem('span') || 7,
      contactsCount: 0,
      salesCount: 0,
      shopsCount: 0,
      onlineCount: 0,
      tagLabels: {
        start_button: 'Comenzar',
        box_next_button: 'Datos compra',
        product_add: 'Agregar producto',
        product_remove: 'Quitar producto',
        payment_takeaway: 'Retiro en sucursal',
        payment_cash: 'Envío a domicilio',
        payment_bank: 'CBU',
        payment_mercadopago: 'Mercado Pago',
        payment_started: 'Inicio Pago'
      },
      defaultChart: {
        chartData: null,
        extraOptions: chartConfig.chartOptionsMain
      },
      shopChart: {
        chartData: null,
        extraOptions: chartConfig.chartOptionsMain
      }
    }
  },
  sockets: {
    event (data) {
      this.$buefy.toast.open({
        message: `Actualizando datos en tiempo real`,
        type: 'is-success'
      })
      this.events.push(data)
      this.updateRealTime()
    },
    sale (data) {
      this.getSales()
    }
  },
  created () {
    this.getSectionData()
  },
  methods: {
    setFromSpan () {
      localStorage.setItem('span', this.days)
      this.getSectionData()
    },
    getSectionData () {
      this.$store.dispatch('loaded', false)
      axios.post('/admin/dash', {
        days: parseFloat(this.days)
      }).then((res) => {
        if (res.data.status === 'success') {
          this.itemsCount = res.data.itemsCount
          this.salesCount = res.data.salesCount
          this.shopsCount = res.data.shopsCount
          this.events = res.data.events
          this.updateRealTime()
        }
        this.$store.dispatch('loaded', true)
      })
    },
    updateRealTime () {
      this.eventsCount = this.events.length
      this.fillDefaultChartData()
      this.fillShopChartData()
      this.fillHeatmap()
      PlaySound('event.mp3', 0.25)
    },
    fillHeatmap () {
      this.mapFeatures = this.getHeatmapFeatures()
      this.createHeatmap()
    },
    createHeatmap () {
      let features = this.mapFeatures
      mapboxgl.accessToken = this.$root.accessToken
      var map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/dark-v10',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-65.368325, -36.879621],
        zoom: 3
      })
      map.on('load', function () {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('events', {
          'type': 'geojson',
          'data': features
        })

        map.addLayer({
          'id': 'events-heat',
          'type': 'heatmap',
          'source': 'events',
          'maxzoom': 9,
          'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
            ]
          }
        }, 'waterway-label')

        map.addLayer({
          'id': 'events-point',
          'type': 'circle',
          'source': 'events',
          'minzoom': 7,
          'paint': {
            // Size circle radius by earthquake magnitude and zoom level
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              ['interpolate', ['linear'],
                ['get', 'mag'], 1, 1, 6, 4
              ],
              16,
              ['interpolate', ['linear'],
                ['get', 'mag'], 1, 5, 6, 50
              ]
            ],
            // Color circle by earthquake magnitude
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              'rgba(33,102,172,0)',
              2,
              'rgb(103,169,207)',
              3,
              'rgb(209,229,240)',
              4,
              'rgb(253,219,199)',
              5,
              'rgb(239,138,98)',
              6,
              'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            // Transition from heatmap to circle layer by zoom level
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              0,
              8,
              1
            ]
          }
        }, 'waterway-label')

        map.on('click', 'events-point', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML([
              '<b>Tienda:</b> ' + e.features[0].properties.shop,
              '<b>Evento:</b> ' + e.features[0].properties.tag,
              '<b>Valor:</b> ' + e.features[0].properties.value,
              '<b>Fecha:</b> ' + e.features[0].properties.created
            ].join('<br>'))
            .addTo(map)
        })
      })
    },
    getHeatmapFeatures () {
      let features = this.events.map(e => {
        if (e && e.geo) {
          return {
            type: 'Feature',
            properties: {
              created: e.created,
              tag: e.tag,
              value: e.value,
              shop: e.shop_name,
              ip: e.ip
            },
            geometry: {
              'type': 'Point',
              'coordinates': [
                parseFloat(e.geo.location.lng),
                parseFloat(e.geo.location.lat)
              ]
            }
          }
        }
      })
      return {
        type: 'FeatureCollection',
        features: features.filter(e => e && e.geometry)
      }
    },
    fillDefaultChartData () {
      let events = this.events
      let data = []
      let chart = {
        datasets: []
      }
      if (Object.keys(events).length) {
        let days = this.days
        let labels = []

        // default process data ranges for days
        let hformat = 'D/M'
        let hlimit = days
        let hspan = 'days'
        // data range for hours
        if (hlimit <= 1 && hlimit > 0.041666667) {
          hspan = 'hours'
          hformat = 'HH[hs]'
          hlimit = parseInt(hlimit * 24)
        } else if (hlimit <= 0.041666667) {
          hspan = 'minutes'
          hformat = 'HH:mm'
          hlimit = parseInt(hlimit * 1440)
        }

        for (var i = hlimit; i >= 0; i--) {
          labels.push(moment().subtract({ [hspan]: i }).format(hformat))
        }

        events.map((e, i) => {
          let tag = e.tag
          let ind = moment(e.created).format(hformat)
          if (!data[tag]) {
            data[tag] = {}
          }
          if (!data[tag][ind]) {
            data[tag][ind] = 0
          }
          data[tag][ind]++
        })

        chart = {
          labels: labels,
          datasets: []
        }

        Object.keys(data).map((e, i) => {
          let dataset = []
          labels.map((o, u) => {
            dataset[u] = data[e][o] || 0
          })
          chart.datasets[i] = {
            label: this.tagLabels[e] || e,
            fill: true,
            borderColor: chartConfig.chartColors.default[i],
            borderWidth: 4,
            borderDash: [],
            borderDashOffset: 0.1,
            pointBackgroundColor: chartConfig.chartColors.default[i],
            pointBorderColor: 'rgba(255,255,255,0.5)',
            pointHoverBackgroundColor: chartConfig.chartColors.default[i],
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: dataset
          }
        })
      }
      this.defaultChart.chartData = chart
    },
    fillShopChartData () {
      let events = this.events
      let chart = {
        datasets: []
      }
      if (Object.keys(events).length) {
        let days = this.days
        let data = []
        let labels = []
        // default process data ranges for days
        let hformat = 'D/M'
        let hlimit = days
        let hspan = 'days'
        // data range for hours
        if (hlimit <= 1 && hlimit > 0.041666667) {
          hspan = 'hours'
          hformat = 'HH[hs]'
          hlimit = parseInt(hlimit * 24)
        } else if (hlimit <= 0.041666667) {
          hspan = 'minutes'
          hformat = 'HH:mm'
          hlimit = parseInt(hlimit * 1440)
        }
        for (var i = hlimit; i >= 0; i--) {
          labels.push(moment().subtract({ [hspan]: i }).format(hformat))
        }
        events.map((e, i) => {
          let tag = e.shop_name || e.shop
          let ind = moment(e.created).format(hformat)
          if (!data[tag]) {
            data[tag] = {}
          }
          if (!data[tag][ind]) {
            data[tag][ind] = 0
          }
          data[tag][ind]++
        })
        chart = {
          labels: labels,
          datasets: []
        }
        Object.keys(data).map((e, i) => {
          let dataset = []
          labels.map((o, u) => {
            dataset[u] = data[e][o] || 0
          })
          chart.datasets[i] = {
            label: e,
            fill: true,
            borderColor: chartConfig.chartColors.default[i],
            borderWidth: 5,
            borderDash: [],
            borderDashOffset: 0.1,
            pointBackgroundColor: chartConfig.chartColors.default[i],
            pointBorderColor: 'rgba(255,255,255,0.5)',
            pointHoverBackgroundColor: chartConfig.chartColors.default[i],
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: dataset
          }
        })
      }
      this.shopChart.chartData = chart
    }
  }
}
</script>
