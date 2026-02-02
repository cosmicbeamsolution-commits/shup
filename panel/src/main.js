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
  options: { query: { origin: 'panel' } }
}))

moment.locale('es')

router.beforeEach((to, from, next) => {
  /* Check session status */
  if (to.path.indexOf('/validar') === 0 ||
      to.path.indexOf('/forgotpassword') === 0 ||
      to.path.indexOf('/resetpassword') === 0) {
    store.state.basic.loaded = true
    next()
  } else {
    if (store.state.status !== 'success' && to.path !== '/login' && !auth) {
      const shop = JSON.parse(localStorage.getItem('shop'))
      router.app.$socket.emit('leaveRoom', shop)
      next('/login')
    } else {
      if (!store.state.basic.loaded) {
        if (store.state.auth) {
          store.dispatch('basic').then(res => {
            if (res.shop) {
              if (!res.shop.wizard_complete) {
                if (to.path !== '/comenzar') {
                  next('/comenzar')
                } else {
                  next()
                }
              } else {
                router.app.$socket.emit('joinRoom', res.shop.id)
                if (res.shop.extra) {
                  if (res.shop.extra.themecolor) {
                    document.documentElement.style.setProperty('--themecolor', res.shop.extra.themecolor)
                  }
                  if (res.shop.extra.textcolor) {
                    document.documentElement.style.setProperty('--textcolor', res.shop.extra.textcolor)
                  }
                }
                next()
              }
            } else {
              store.state.auth = null
              next('/login')
            }
          }).catch(err => {
            console.log(err)
          }).catch(err => {
            console.log(err)
          })
        } else {
          store.state.basic.loaded = true
          next()
        }
      } else {
        next()
      }
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

Vue.filter('adjustDayTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('DMMM')
})

var utils = {
  methods: {
    groupBy (items, key) {
      return items.reduce((result, item) => ({
        ...result, [item[key]]: [...(result[item[key]] || []), item]
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
      accessToken: 'pk.eyJ1Ijoib3ZlcmxlbW9uIiwiYSI6ImNraHVtN2lxOTB1dGUycm1hbHFvM215NzkifQ.mq69zruKTDCKvFuxi2dBjw'
    }
  },
  sockets: {
    event (data) {
      PlaySound('tag.mp3', 0.25)
      this.$buefy.toast.open({
        message: `Nuevo evento ${data.tag}`,
        duration: 1000,
        queue: false
      })
    },
    connected (data) {
      PlaySound('tag.mp3', 0.25)
      this.$buefy.toast.open({
        message: `Conectados ahora ${data}`,
        type: 'is-info',
        duration: 1000,
        queue: false
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
