/* Styles */
import '@/scss/main.scss'
import '@mdi/font/css/materialdesignicons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'vue-swatches/dist/vue-swatches.css'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'
import moment from 'moment'
import VueSocketIO from 'vue-socket.io'

/* Router & Store */
import router from './router'
import store from './store'

/* Service Worker */
import './registerServiceWorker'

/* Vue. Main component */
import App from './App.vue'

/* Vue. Component in recursion */
/* Vue. Component in recursion */
import AsideMenuList from '@/components/AsideMenuList'
import PlaySound from '@/components/PlaySound'

const auth = JSON.parse(localStorage.getItem('auth'))

if (auth) {
  axios.defaults.headers.common['Authorization'] = auth.token
}

axios.defaults.baseURL = store.state.endpoint

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV !== 'production',
  connection: store.state.endpoint,
  options: { query: { origin: 'admin' } }
}))

moment.locale('es')

router.beforeEach((to, from, next) => {
  /* Check session status */
  if (store.state.status !== 'success' && to.path !== '/login' && !auth) {
    next('/login')
  } else {
    if (!store.state.basic.loaded) {
      store.dispatch('basic').then(res => {
        router.app.$socket.emit('joinRoom', 'geotiendas')
        if (res.application && res.application.themecolor) {
          document.documentElement.style.setProperty('--themecolor', res.application.themecolor)
        }
        next()
      })
    } else {
      next()
    }
  }
})

/* Collapse mobile aside menu on route change */
router.afterEach(() => {
  store.commit('asideMobileStateToggle', false)
})

Vue.config.productionTip = false

Vue.filter('fromNow', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).fromNow(true)
})

Vue.filter('adjustTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('YYYY-MM-DD HH:mm')
})

Vue.filter('adjustShortTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('MMMD HH:mm')
})

Vue.filter('adjustRecentTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('HH:mm')
})

Vue.filter('adjustDayTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('DMMM')
})

var utils = {
  methods: {
    groupBy (items, key) {
      return items.reduce((result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item
        ]
      }), {})
    }
  }
}

/* These components are used in recursion algorithm */
Vue.component('AsideMenuList', AsideMenuList)

Vue.use(Buefy)

new Vue({
  mixins: [utils],
  router,
  store,
  data () {
    return {
      isLoading: false,
      accessToken: 'pk.eyJ1Ijoib3ZlcmxlbW9uIiwiYSI6ImNrZ3k0Ymp5NjA4dGoydHV1eGo5dnR5bmcifQ.04l9FZQdc_bXkI-f8ROB_Q'
    }
  },
  sockets: {
    etag (data) {
      PlaySound('tag.mp3', 0.25)
      this.$buefy.toast.open({
        message: `Nuevo evento ${data.tag}`,
        duration: 2000
      })
    },
    mercadopago (data) {
      PlaySound('mercadopago.mp3', 0.5)
      this.$buefy.toast.open({
        message: `Nuevo cobro por mercadopago: $ ${data.total} 😍`,
        duration: 3000
      })
    },
    sale (data) {
      PlaySound('sale.mp3', 0.5)
      this.$store.dispatch('mark', { sales: true })
      this.$buefy.toast.open({
        message: `Nueva venta (${data.payment_mode}) $ ${data.total} 🎉`,
        type: 'is-success',
        duration: 10000
      })
    }
  },
  render: h => h(App)
}).$mount('#app')
