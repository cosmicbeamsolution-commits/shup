<template>
  <div>
    <modal-share
      :is-active="isShareActive"
      :data-item="shop"
      :data-type="'shop'"
      @cancel="shareCancel"/>
    <div class="slipper animated slideOutUp has-theme-background">
      <div class="level is-mobile container has-margin-auto">
        <div class="level-left">
          <div class="level-item">
            <router-link to="/">
              <div class="top-logo is-background-image is-circle" :style="`background-image: url(${shop.logo})`"/>
            </router-link>
          </div>
          <div class="level-item">
            <h1 class="is-size-5 is-font-bold has-text-color has-text-weight-light">{{ shop.shop }}</h1>
          </div>
          <div class="level-item">
            <router-link to="/geo" @click="this.$store.dispatch('event', { tag: 'click', value: 'geo'})" :title="`Conocé dónde ofrece ${shop.shop}`">
              <span class="icon">
                <i class="mdi mdi-selection-marker mdi-24px has-text-color"></i>
              </span>
            </router-link>
          </div>
          <div v-for="(item, index) in extraSocial" :key="index" class="level-item">
            <a :href="item.url" :title="`Seguinos en ${item.icon}`" @click="store.dispatch('event', { tag: 'click', value: item.icon })" target="_blank">
              <span class="icon">
                <i :class="`mdi mdi-${item.icon} mdi-24px has-text-color`"></i>
              </span>
            </a>
          </div>
          <div class="level-item">
            <a @click.prevent="shareModal" :title="`Compartí ${shop.shop} en tus redes sociales`">
              <span class="icon">
                <i class="mdi mdi-share-variant mdi-24px has-text-color"></i>
              </span>
            </a>
          </div>
        </div>
        <div class="level-right is-hidden-mobile">
          <div class="level-item is-rpadded">
            <a href="https://overlemon.com/crea-tu-tienda" target="_blank" class="has-text-color">
              <span class="icon is-hpadded">
                <svg-icon icon="bag"/>
              </span>
              <span>Creá tu tienda gratis</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import ModalShare from '@/components/ModalShare'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'HeaderBar',
  components: {
    ModalShare,
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
    extraSocial () {
      return this.shop.extra ? this.shop.extra.social : false
    },
    ...mapState([
      'shop'
    ])
  },
  data () {
    return {
      isShareActive: false
    }
  },
  methods: {
    shareModal () {
      this.$store.dispatch('event', { tag: 'click', value: 'share' })
      this.isShareActive = true
    },
    shareCancel () {
      this.isShareActive = false
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
