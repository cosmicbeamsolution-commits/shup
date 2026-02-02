<template>
  <div>
    <section-background>
      <div class="content">
        <div class="columns is-centered">
          <div class="column is-6">
            <h1 class="has-text-centered has-text-white has-text-shadow">{{ page.name }}</h1>
            <p class="has-text-centered has-text-white has-text-weight-bold has-text-shadow has-line-height" v-html="page.content"></p>
          </div>
        </div>
      </div>
    </section-background>
    <div class="column has-padding-extra-bottom animated fadeIn delay">
      <card-component>
        <div id="map"></div>
      </card-component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SectionBackground from '../components/SectionBackground'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'coverage',
  components: {
    CardComponent,
    SectionBackground
  },
  computed: {
    ...mapState([
      'shop',
      'page'
    ])
  },
  data () {
    return {
      isLoading: false,
      data: {},
      defaultBounds: [
        [-60.292954, -35.564406],
        [-58.142812, -34.362287]
      ]
    }
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: 24.886, lng: -70.268 },
        disableDefaultUI: true,
        mapTypeId: 'terrain'
      })
      let bounds = this.defaultBounds
      let shopBounds = this.shop.delivery_bounds
      if (Object.keys(shopBounds).length && shopBounds.features.length) {
        bounds = this.shop.delivery_bounds.features[0].geometry.coordinates[0]
      }
      var latLngBounds = new window.google.maps.LatLngBounds()
      bounds.forEach((e, i) => {
        latLngBounds.extend(new window.google.maps.LatLng(e[1], e[0]))
      })
      const coverageCoords = bounds.map(e => {
        return {
          lat: e[1],
          lng: e[0]
        }
      })
      // Construct the polygon.
      const coverageArea = new window.google.maps.Polygon({
        paths: coverageCoords,
        strokeColor: '#02b875',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#02b875',
        fillOpacity: 0.35
      })
      coverageArea.setMap(map)
      map.fitBounds(latLngBounds)
    }
  }
}
</script>

<style>
  #map {
    width: 100%;
    height: 400px;
  }
</style>
