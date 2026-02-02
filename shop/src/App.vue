<template>
  <div id="app" class="container">
    <div v-if="!shop.loaded" id="loading" class="animated">
      <svg class="spinner-container" viewBox="0 0 44 44">
        <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
    <div v-if="isOnline">
      <header-bar/>
      <router-view />
      <footer-bar/>
    </div>
    <div v-if="isOffline && !isUnregistered" class="is-fit-section card-container animated fadeIn delay">
      <card-component :is-float="true">
        <div class="content has-text-centered">
          <div class="is-logo-title">
            <img src="/img/GeoCyan.svg"/>
          </div>
          <hr>
          <div class="is-spaced">
            <h2 class="has-text-weight-bold">{{ shop.shop }} no está disponible</h2>
            <p class="has-text-light">Esta tienda está desactivada o aún le falta configurar. Podés volver a intentar dentro de un rato.</p>
          </div>
          <hr>
          <a href="https://comunidad.geotiendas.com" class="button is-info is-outlined  has-text-weight-bold">Ver más tiendas</a>
        </div>
      </card-component>
    </div>
    <div v-if="isUnregistered" class="is-fit-section card-container animated fadeIn delay">
      <card-component :is-float="true">
        <div class="content has-text-centered">
          <div class="is-logo-title">
            <img src="/img/GeoBlack.svg"/>
          </div>
          <hr>
          <div class="is-spaced">
            <h2 class="has-text-weight-bold">Tienda no encontrada</h2>
            <p class="has-text-light">Esta tienda no ha sido creada todavía.</p>
          </div>
          <hr>
          <a :href="`https://geotiendas.com/crea-tu-tienda/${shop.id}`" class="button is-success is-outlined  has-text-weight-bold">Crear mi tienda {{ shop.id }}</a>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
export default {
  name: 'home',
  components: {
    CardComponent,
    HeaderBar,
    FooterBar
  },
  computed: {
    isOnline () {
      return this.shop && this.shop.loaded && this.shop.enabled && !this.shop.offline && this.shop.items.length
    },
    isOffline () {
      return (this.shop && this.shop.loaded && !this.shop.enabled) || (this.shop.loaded && !this.shop.items.length) || (this.shop.loaded && this.shop.offline)
    },
    isUnregistered () {
      return !this.shop.shop && this.shop.loaded
    },
    ...mapState([
      'shop'
    ])
  },
  mounted () {
    window.addEventListener('scroll', function (e) {
      const slipper = document.querySelector('.slipper')
      const orderTotal = document.getElementById('orderTotal')
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      if (scrollTop > 200) {
        if (slipper.classList.contains('slideOutUp')) {
          slipper.classList.remove('slideOutUp')
          slipper.classList.add('slideInDown')
        }
        if (orderTotal) {
          if (!orderTotal.classList.contains('is-float')) {
            orderTotal.classList.add('is-float')
          }
        }
        document.querySelectorAll('.top').forEach(e => e.classList.add('fixed'))
      } else {
        if (slipper.classList.contains('slideInDown')) {
          slipper.classList.remove('slideInDown')
          slipper.classList.add('slideOutUp')
        }
        if (orderTotal) {
          if (orderTotal.classList.contains('is-float')) {
            orderTotal.classList.remove('is-float')
          }
        }
        document.querySelectorAll('.top').forEach(e => e.classList.remove('fixed'))
      }
    })
  }
}
</script>
