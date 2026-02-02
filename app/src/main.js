/* Styles */
import '@/scss/main.scss'
import '@mdi/font/css/materialdesignicons.css'
// import '@splidejs/splide/dist/css/themes/splide-default.min.css'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'
import moment from 'moment'
// import VueSplide from '@splidejs/vue-splide'

/* Router & Store */
import router from './router'
import store from './store'

/* Service Worker */
import './registerServiceWorker'

/* Vue. Main component */
import App from './App.vue'

// Vue.use(VueSplide)
Vue.use(Buefy)

axios.defaults.baseURL = store.state.endpoint

router.beforeEach((to, from, next) => {
  if (to.name === 'page') {
    store.dispatch('loaded', false)
  }
  if (!store.state.basic.loaded) {
    store.dispatch('basic').then(res => {
      console.log(`[B] ✔️`)
      next()
    }).catch(err => {
      console.log(`[B] ❌: ${err}`)
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (window.fbq) {
    // window.fbq('track', 'PageView')
  }
  document.querySelector('.menu-items').style.display = 'none'
  if (to.meta && to.meta.white) {
    document.querySelector('.top').classList.add('white')
  } else {
    document.querySelector('.top').classList.remove('white')
  }

  if (to.name !== 'page') {
    store.dispatch('loaded', true)
  }
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

Vue.filter('adjustFormalTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('DD MMM YYYY HH:mm')
})

Vue.filter('adjustDayTZ', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).utcOffset(-3).format('DD MMM')
})

Vue.filter('wordsplice_5', function (value) {
  if (!value) return ''
  let words = value.split(' ')
  words = words.splice(0, 5)
  return words.join(' ')
})

Vue.filter('wordsplice_10', function (value) {
  if (!value) return ''
  let words = value.split(' ')
  words = words.splice(0, 10)
  return words.join(' ')
})

Vue.filter('wordsplice_15', function (value) {
  if (!value) return ''
  let words = value.split(' ')
  words = words.splice(0, 15)
  return words.join(' ')
})

Vue.filter('wordsplice_25', function (value) {
  if (!value) return ''
  let words = value.split(' ')
  words = words.splice(0, 25)
  words.push('...')
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
new Vue({
  mixins: [mixin],
  router,
  store,
  render: h => h(App)
}).$mount('#app')

moment.locale('es')
