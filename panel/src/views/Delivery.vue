<template>
  <div>
    <sale-box :is-active="isModalActive" :data-item="item" @confirm="trashConfirm" @cancel="trashCancel"/>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="map-marker-multiple-outline" size="is-medium"/>
      Entregas
      <div class="buttons" slot="right">
        <a class="button " @click="getData">
          <span>Actualizar</span>
        </a>
        <a class="button " @click="print">
          <span>Imprimir</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div v-for="(item, index) in data" :key="index" class="column is-clickable" @click="showPartial(index)">
          <card-widget class="tile is-child is-clickable" :class="{ 'is-active': activeIndex === index }" type="is-light" icon="map-marker-multiple-outline" :number="item.total_deliveries" :label="item.formatted_date"/>
        </div>
      </div>
      <card-component v-if="Object.keys(partial).length">
        <div id="map"></div>
      </card-component>
      <notification v-else class="is-info">
        <p>No hay pedidos activos por el momento</p>
      </notification>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import SaleBox from '@/components/SaleBox'
import CardWidget from '@/components/CardWidget'
import mapboxgl from 'mapbox-gl'
import Notification from '@/components/Notification'
export default {
  name: 'Delivery',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    SaleBox,
    CardWidget,
    CardComponent,
    Notification
  },
  data () {
    return {
      isModalActive: false,
      activeIndex: 0,
      map: null,
      item: {},
      data: [],
      partial: [],
      features: [],
      coordinates: []
    }
  },
  sockets: {
    sale (data) {
      this.getData()
    }
  },
  created () {
    let self = this
    this.getData()
    window.set_delivery_code = (id) => {
      const input = document.getElementById(id)
      if (input) {
        const value = input.value.toUpperCase()
        self.updateItem(id, { delivery_code: value }).then(res => {
          this.features.map(e => {
            if (e.properties._id === id) {
              e.properties.title = ['#' + res.id, input.value].join(' - ')
              e.properties.description = [`<h6 class="subtitle has-text-weight-bold is-marginless">Código de Entrega</h6>`, `<p>Zona y prioridad ej. A1, C5, etc</p>`, `<div class="field has-addons"><div class="control"><input class="input" type="text" id="${id}" value="${value}"></div><div class="control"><input class="button is-info" type="button" onclick="set_delivery_code('${id}')" value="OK"></div></div>`].join('')
            }
            return e
          })
          var geojson = {
            type: 'FeatureCollection',
            features: this.features
          }
          this.map.getSource('markers').setData(geojson)
          const popup = document.getElementsByClassName('mapboxgl-popup')
          if (popup.length) {
            popup[0].remove()
          }
          this.$buefy.toast.open({
            message: `Zona de Entrega actualizada`
          })
        })
      }
    }
  },
  computed: {
    titleStack () {
      return [
        'Gestor',
        'Entregas'
      ]
    }
  },
  methods: {
    updateItem (id, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`/sales/${id}`, payload).then(res => {
          resolve(res.data)
        })
      })
    },
    showPartial (index) {
      this.activeIndex = index
      this.partial = this.data[index]
      setTimeout(() => {
        this.drawMap()
      }, 700)
    },
    print (id) {
      window.print()
      // window.open('/sales/print/' + id, id, `height=${window.screen.availHeight},width=${window.screen.availWidth}`)
    },
    showItem (item) {
      this.item = item
      this.isModalActive = true
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/sales/sort', {
        find: {
          // delivery_date: { $gte: moment().subtract(1, 'day') }
        },
        sort: { created: 1 }
      }).then(res => {
        this.data = []
        if (res.data.length) {
          let grouped = this.$root.groupBy(res.data, 'delivery_date')
          Object.keys(grouped).forEach(i => {
            let row = grouped[i]
            this.data.push({
              date: i,
              formatted_date: moment(i).format('DMMM YYYY').toUpperCase(),
              sales: row,
              total_deliveries: row.length
            })
          })
          this.showPartial(this.data.length - 1)
        }
        this.$store.dispatch('loaded', true)
      })
    },
    drawMap () {
      mapboxgl.accessToken = this.$root.accessToken
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.partial.sales[0].customer.geo.lng, this.partial.sales[0].customer.geo.lat],
        // interactive: false,
        zoom: 14
      })

      let features = []
      let coordinates = []

      this.partial.sales.forEach(e => {
        if (e.customer && e.customer.geo && e.customer.geo.lng && e.customer.geo.lat) {
          let coordinate = [e.customer.geo.lng, e.customer.geo.lat]
          // let time = moment(e.created).utcOffset(-3).format('YYYY-MM-DD HH:mm')
          coordinates.push(coordinate)
          let deliveryCode = e.delivery_code || '?'
          features.push({
            'type': 'Feature',
            'properties': {
              '_id': e._id,
              'title': ['#' + e.id, e.delivery_code].join(' - '),
              // 'title': window.delivery_codes[e._id],
              // 'description': ['#' + e.id, time, '$' + e.total, e.customer.fullname, e.customer.phone, e.customer.geo.formatted_address, e.customer.comments].join('<br>'),
              'description': [`<h6 class="subtitle has-text-weight-bold is-marginless">Código de Entrega</h6>`, `<p>Zona y prioridad ej. A1, C5, etc</p>`, `<div class="field has-addons"><div class="control"><input class="input" type="text" id="${e._id}" value="${deliveryCode}"></div><div class="control"><input class="button is-info" type="button" onclick="set_delivery_code('${e._id}')" value="OK"></div></div>`].join(''),
              'icon': 'custom-marker'
            },
            'geometry': {
              'type': 'Point',
              'coordinates': coordinate
            }
          })
        }
      })

      map.on('load', () => {
        map.loadImage('/img/custom_marker.png', (error, image) => {
          if (error) throw error
          map.addImage('custom-marker', image)
          map.addSource('markers', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          })
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'markers',
            'layout': {
              'icon-image': 'custom-marker',
              'icon-size': 1,
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 0.25],
              'text-anchor': 'top'
            }
          })
        })

        map.on('click', 'points', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice()
          var description = e.features[0].properties.description
          var _id = e.features[0].properties._id

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map)

          setTimeout(() => {
            document.getElementById(_id).select()
          }, 100)
        })

        map.on('mouseenter', 'points', function () {
          map.getCanvas().style.cursor = 'pointer'
        })

        map.on('mouseleave', 'points', function () {
          map.getCanvas().style.cursor = ''
        })

        var bounds = coordinates.reduce((e, i) => {
          return e.extend(i)
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
        if (coordinates.length > 1) {
          map.fitBounds(bounds, {
            padding: 100,
            offset: [0, 0]
          })
        }
      })

      this.features = features
      this.map = map
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      axios
        .post(['upload', 'delete'].join('/'), {
          files: [this.trashObject.src]
        }).then(res => {
          this.isLoading = false
          this.$emit('fileDeleted', res.data)
        })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>

<style>
  #map {
    width: 100%;
    height: 500px;
  }
</style>
