<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="gesture-tap-box" size="is-medium"/>
      Analíticas
    </hero-bar>
    <section class="section is-main-section">
      <div id="map"></div>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'analytics',
  components: {
    NavBar,
    AsideMenu,
    HeroBar
  },
  data () {
    return {
      connected: {}
    }
  },
  sockets: {
    event (data) {
      this.connected = data
    }
  },
  created () {
    setTimeout(() => {
      this.$socket.emit('findConnectedAll')
    }, 1000)
  }
}
</script>
