<template>
  <div v-if="Object.keys(data).length" class="content printable">
    <table class="table is-striped is-fullwidth">
      <tr v-for="(item, index) in data.order" :key="index">
        <td>
          <span>
            <h5 class="is-marginless" :style="{ color: item.color }">{{ item.name }}</h5>
            <p :style="{ color: item.color }">{{ item.text }}</p>
          </span>
        </td>
      </tr>
    </table>
    <div class="columns">
      <div class="column">
        <table class="table is-striped is-fullwidth">
          <tr>
            <td width="1%">
              <b-icon icon="clock" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.created }}</p>
            </td>
          </tr>
          <tr v-for="(item, index) in customerData" :key="index">
            <td width="1%">
              <b-icon :icon="item.icon" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.customer[item.value] }}</p>
            </td>
          </tr>
          <tr class="has-background-light">
            <td width="1%">
              <b-icon icon="coin" type="is-grey"/>
            </td>
            <td>
              <p>${{ data.total }}</p>
            </td>
          </tr>
          <tr class="has-background-light">
            <td width="1%">
              <b-icon v-if="data.pay_with_cash" icon="cash" type="is-grey"/>
              <b-icon v-else icon="credit-card" type="is-grey"/>
            </td>
            <td>
              <p v-if="data.pay_with_cash">Envío a domicilio</p>
              <p v-else>Online</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="column">
        <div id="marker"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'sale_print',
  data () {
    return {
      data: {},
      customerData: [{
        value: 'fullname',
        icon: 'account'
      }, {
        value: 'email',
        icon: 'email-edit-outline'
      }, {
        value: 'phone',
        icon: 'phone'
      }, {
        value: 'address',
        icon: 'map-marker'
      }, {
        value: 'comments',
        icon: 'comment-check-outline'
      }]
    }
  },
  mounted () {
    axios.get('/sales/' + this.$route.params.id).then(res => {
      this.data = res.data
      setTimeout(() => {
        this.drawMap()
      }, 100)
    })
  },
  methods: {
    drawMap () {
      mapboxgl.accessToken = this.$root.accessToken
      let coordinates = [this.data.customer.geo.lng, this.data.customer.geo.lat]
      var map = new mapboxgl.Map({
        container: 'marker',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        // interactive: false,
        zoom: 14
      })
      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
      map.on('sourcedata', e => {
        if (e.isSourceLoaded) {
          setTimeout(() => {
            window.print()
          }, 500)
        }
      })
    }
  }
}
</script>

<style>
  .printable {
    max-width: 800px;
  }
  #marker {
    height: 100%;
    width: 360px;
  }
</style>
