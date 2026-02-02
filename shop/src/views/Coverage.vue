<template>
  <div>
    <header-component/>
    <div class="content is-bottom-extra-extra-padded animated fadeIn">
      <card-component class="is-white">
        <div class="columns is-multiline">
          <div class="column is-12 content">
            <h5 v-show="this.shop.scope === 'country'">
              <!--b-icon icon="map-marker-circle"/-->
              <span> {{ shop.shop }} vende en todo el país</span>
            </h5>
            <h5 v-show="this.shop.scope === 'custom'">
              <!--b-icon icon="select-marker"/-->
              <span> {{ shop.shop }} vende de forma localizada</span>
            </h5>
            <p class="is-size-7">
              <span>{{ shop.about_important }} </span>
              <span> {{ shop.text }}</span>
            </p>
          </div>
          <div class="column">
            <div id="map" class="is-box-rounded"></div>
          </div>
        </div>
      </card-component>
      <div class="buttons is-flex-center">
        <router-link to="/">
          <b-button type="is-info is-small is-link">
            <span class="is-size-6">Volver a la tienda</span>
          </b-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import HeaderComponent from '../components/HeaderComponent'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'coverage',
  components: {
    CardComponent,
    HeaderComponent
  },
  computed: {
    ...mapState([
      'shop'
    ])
  },
  data () {
    return {
      isLoading: false,
      data: {},
      defaultBounds: null
    }
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      const scope = this.shop.scope
      let deliveryBounds = JSON.parse(JSON.stringify(this.shop.delivery_bounds))
      let center = [-70.268, -39.886]
      let zoom = 2.5
      if (scope === 'custom' && this.shop.geo) {
        center = [this.shop.geo.lng, this.shop.geo.lat]
        zoom = 10
      }
      mapboxgl.accessToken = this.$root.mp.accessToken
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: center,
        zoom: zoom
      })
      const modes = MapboxDraw.modes
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: true
        },
        modes: modes
      })
      map.addControl(draw)
      map.on('load', function (e) {
        if (scope === 'custom' && deliveryBounds && Object.keys(deliveryBounds).length && deliveryBounds.features.length) {
          draw.add(deliveryBounds)
          let coordinates = deliveryBounds.features[0].geometry.coordinates[0]
          var bounds = coordinates.reduce((e, i) => {
            return e.extend(i)
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
          map.fitBounds(bounds, {
            padding: 100,
            offset: [0, 0]
          })
        }
      })
      /* const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 24.886, lng: -70.268 },
        zoomControl: true,
        scaleControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        mapTypeId: 'roadmap'
      })
      const goldStar = {
        path: 'M14.7613 44.0345H7.56129C4.66129 44.0345 2.46129 41.5264 2.76129 38.7173L4.86129 17.6489C5.16129 15.1407 7.16129 13.2346 9.66129 13.2346H16.7613C14.2613 13.2346 12.1613 15.1407 11.9613 17.6489L9.96129 38.8176C9.76129 41.5264 11.9613 44.0345 14.7613 44.0345Z M40.8612 38.8346C41.0612 41.6346 38.8612 44.0346 36.0612 44.0346H14.7612C11.9612 44.0346 9.66119 41.5346 9.96119 38.7346L11.9612 17.6346C12.1612 15.1346 14.2612 13.2346 16.7612 13.2346H34.4612C36.9612 13.2346 39.0612 15.2346 39.2612 17.7346L40.8612 38.8346Z M29.4613 6.83457C26.5613 1.63457 19.0613 1.63457 16.1613 6.83457 M30.2613 44.0346H21.3613C20.9613 44.0346 20.6613 43.7346 20.6613 43.3346V36.9346C20.6613 36.5346 20.9613 36.2346 21.3613 36.2346H30.2613C30.6613 36.2346 30.9613 36.5346 30.9613 36.9346V43.3346C30.9613 43.7346 30.5613 44.0346 30.2613 44.0346Z',
        fillColor: 'white',
        fillOpacity: 1,
        scale: 1,
        strokeColor: '#19bbde',
        strokeWeight: 4,
        anchor: new window.google.maps.Point(30, 30)
      }
      const myLatLng = { lat: this.shop.geo.lat, lng: this.shop.geo.lng }
      const marker = new window.google.maps.Marker({
        position: myLatLng,
        icon: goldStar,
        title: this.shop.shop
      })
      marker.setMap(map)
      map.setCenter(myLatLng)
      if (this.shop.scope === 'custom' && this.shop.delivery_bounds && this.shop.delivery_bounds.features.length) {
        let bounds = this.shop.delivery_bounds.features[0].geometry.coordinates[0]
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
      } */
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
