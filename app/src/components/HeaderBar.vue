<template>
  <div :class="$route.meta.theme">
    <div class="slipper animated slideOutUp">
      <div class="level is-mobile container has-margin-auto">
        <div class="level-left">
          <div v-if="$router.path !== '/'" class="level-item">
            <router-link class="top-logo" to="/">
              <img src="/img/GeoBlackCyan.svg"/>
            </router-link>
          </div>
          <div v-else class="level-item">
            <a onclick="document.scrollTo(0, 0)" class="top-logo">
              <img src="/img/GeoBlackCyan.svg"/>
            </a>
          </div>
        </div>
        <div v-show="$route.fullPath !== '/crea-tu-tienda' && $route.fullPath !== '/tienda-creada'" class="level-right">
          <div class="level-item has-text-right">
            <button type="button" class="button is-info" @click="shopCreate()">
              <span>Crear tienda</span>
              <svg-icon icon="shop" class="is-hidden-mobile" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="top container" :class="$route.meta.theme">
      <div class="top-container columns is-mobile is-vcentered">
        <div class="column is-2 has-text-left">
          <router-link class="top-logo" to="/">
            <img :src="iconColor"/>
          </router-link>
        </div>
        <div class="column top-menu has-text-right is-hidden-touch">
          <b-field v-if="basic.settings" class="is-share-icons" grouped group-multiline position="is-centered">
            <p v-for="(item, index) in basic.settings.social" :key="index" class="control">
              <a :href="item.url" :title="`Seguinos en ${item.icon}`" target="_blank">
                <b-icon :type="{ 'is-dark': !$route.meta.theme, 'is-white': $route.meta.theme }" :icon="item.icon"/>
              </a>
            </p>
          </b-field>
          <router-link to="/planes" :class="textColor">
            <span>Planes</span>
          </router-link>
          <a href="https://panel.overlemon.com" :class="textColor">
            <span>Iniciar sesión</span>
          </a>
          <button v-show="$route.fullPath !== '/crea-tu-tienda'" type="button" class="button is-info" @click="shopCreate()">
            <span>Crear tienda</span>
            <svg-icon icon="shop"/>
          </button>
        </div>
        <div class="column is-pulled-right has-text-right is-hidden-desktop">
          <div class="menu-burger" @click="toggleNavBar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17"><g id="Grupo_770" data-name="Grupo 770" transform="translate(-10412 7661)"><path id="Trazado_546" data-name="Trazado 546" d="M0,0H21" transform="translate(10413.5 -7659.5)" fill="none" :stroke="strokeColor" stroke-linecap="round" stroke-width="3"/><path id="Trazado_547" data-name="Trazado 547" d="M0,0H21" transform="translate(10413.5 -7652.5)" fill="none" :stroke="strokeColor" stroke-linecap="round" stroke-width="3"/><path id="Trazado_548" data-name="Trazado 548" d="M0,0H21" transform="translate(10413.5 -7645.5)" fill="none" :stroke="strokeColor" stroke-linecap="round" stroke-width="3"/></g></svg>
          </div>
        </div>
      </div>
      <div class="menu-items is-hidden-desktop">
        <div class="columns">
          <div class="column list">
            <span class="navbar-item">
              <router-link to="/crea-tu-tienda" :class="textColor">
                <span>Crear mi geotienda</span>
              </router-link>
            </span>
            <span class="navbar-item">
              <a href="https://panel.overlemon.com" :class="textColor">
                <span>Iniciar sesión</span>
              </a>
            </span>
            <span class="navbar-item">
              <router-link to="/planes" :class="textColor">
                <span>Planes</span>
              </router-link>
            </span>
            <div class="copyright has-text-centered">
              <span :class="textColor">© {{ year }} geotiendas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import SvgIcon from '../components/SvgIcon'
export default {
  name: 'HeaderBar',
  components: {
    SvgIcon
  },
  props: {
    hasRightVisible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    year () {
      return moment().year()
    },
    strokeColor () {
      return this.$route.meta.theme ? '#fafafa' : '#19bbde'
    },
    textColor () {
      return this.$route.meta.theme ? 'has-text-white' : 'has-text-dark'
    },
    iconColor () {
      return this.$route.meta.theme ? '/img/GeoWhite.svg' : '/img/GeoBlackCyan.svg'
    },
    ...mapState([
      'basic'
    ])
  },
  data () {
    return {}
  },
  methods: {
    shopCreate () {
      this.$router.push('crea-tu-tienda')
    },
    scrollToBottom () {
      document.querySelector('.menu-items').style.display = 'none'
      this.scrollTo(document.querySelector('body').clientHeight)
    },
    toggleNavBar () {
      let menu = document.querySelector('.menu-items')
      if (menu.style.display === '') {
        menu.style.display = 'none'
      }
      menu.style.display = menu.style.display !== 'none' ? 'none' : 'block'
    }
  }
}
</script>
