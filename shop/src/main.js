/* Styles */
import '@/scss/main.scss'
import '@mdi/font/css/materialdesignicons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
// import '@splidejs/splide/dist/css/themes/splide-default.min.css'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'
import moment from 'moment'
import VueSocketIO from 'vue-socket.io'
// import VueSplide from '@splidejs/vue-splide'

/* Router & Store */
import router from './router'
import store from './store'
import appendLink from './components/appendLink'

/* Service Worker */
import './registerServiceWorker'

/* Vue. Main component */
import App from './App.vue'

// Vue.use(VueSplide)
Vue.use(Buefy)

axios.defaults.baseURL = store.state.endpoint

let domain = window.location.host.split(':')[0].split('/')[0]
moment.locale('es')

router.beforeEach((to, from, next) => {
  if (!store.state.shop.loaded) {
    let themefontname = 'raleway'
    let themefontdistro = 'Raleway Bold'
    store.dispatch('basic', domain).then(res => {
      if (res.shop) {
        document.title = res.shop
        document.querySelector('link[rel=icon]').setAttribute('href', res.logo)
        if (res.extra) {
          if (res.extra.themecolor) {
            document.documentElement.style.setProperty('--themecolor', res.extra.themecolor)
            document.querySelector('meta[name="theme-color"]').setAttribute('content', res.extra.themecolor)
            document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', res.extra.themecolor)
          }
          if (res.extra.textcolor) {
            document.documentElement.style.setProperty('--textcolor', res.extra.textcolor)
          }
          if (res.extra.themefont) {
            themefontname = res.extra.themefont.name
            themefontdistro = res.extra.themefont.distro
          }
        }
        Vue.use(new VueSocketIO({
          debug: process.env.NODE_ENV !== 'production',
          connection: store.state.endpoint,
          options: { query: { origin: 'shop', shop: res.id } }
        }))
        store.dispatch('device').then(data => {
          router.app.$socket.emit('device', data)
        })
      }

      router.app.$socket.emit('joinRoom', res.id)
      next()
      console.log(`✔️ Basic`)
    }).catch(err => {
      console.log(`❌ Basic: ${err}`)
    }).then(() => {
      /* load default fonts if needed */
      document.documentElement.style.setProperty('--themefontname', themefontname)
      document.documentElement.style.setProperty('--themefontdistro', themefontdistro)
      appendLink('themefont', `https://cdn.overlemon.com/css/${themefontname}.css`)
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  store.dispatch('event', { tag: 'pageview', value: window.location.pathname })
  store.dispatch('footerBarStateToggle', true)
})

Vue.config.productionTip = false

Vue.filter('fromNow', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).fromNow(false)
})

Vue.filter('adjustTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('YYYY-MM-DD HH:mm')
})

Vue.filter('adjustDayTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('DD MMM')
})

Vue.filter('wordsplice', function (value) {
  if (!value) return ''
  let words = value.split(' ')
  words = words.splice(0, 25)
  return words.join(' ')
})

Vue.filter('sanitize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.split(' ').filter(function (str) {
    var word = str.match(/(\w+)/)
    return word && word[0].length < 15
  }).join(' ')
})

Vue.filter('formatNumber', function (value) {
  if (!value) return ''
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
})

var mixin = {
  methods: {
    event (data) {
      router.app.$socket.emit('event', Object.assign({ device: store.state.device }, data))
    },
    sanitize (str) {
      return str.toLowerCase().split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u').split('ñ').join('n')
    },
    formatNumber (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    },
    animate ({ parent, target }) {
      if (target.getAttribute('animate')) {
        target.classList.remove(target.getAttribute('animate'))
        setTimeout(() => {
          target.classList.add(target.getAttribute('animate'))
        }, 10)
      }
    },
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

Vue.config.silent = true
new Vue({
  mixins: [mixin],
  router,
  store,
  data () {
    return {
      mp: {
        accessToken: 'pk.eyJ1Ijoib3ZlcmxlbW9uIiwiYSI6ImNraHVtN2lxOTB1dGUycm1hbHFvM215NzkifQ.mq69zruKTDCKvFuxi2dBjw'
      }
    }
  },
  render: h => h(App)
}).$mount('#app')
