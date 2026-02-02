import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    basic: {
      loaded: false
    },
    shop: {
      extra: {}
    },
    /* Auth */
    auth: JSON.parse(localStorage.getItem('auth')),
    /* NavBar */
    isNavBarVisible: true,
    /* FooterBar */
    isFooterBarVisible: true,
    marks: {},
    /* Aside */
    isAsideVisible: true,
    isAsideMobileExpanded: false,
    status: '',
    endpoint: (process.env.NODE_ENV === 'production' ? 'https://api.overlemon.com' : 'http://localhost:5500')
  },
  mutations: {
    initialiseStore (state) {
      let auth = JSON.parse(localStorage.getItem('auth'))
      if (auth) {
        state.auth = auth
      }
    },
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    basic_error (state) {
      state.status = 'error'
    },
    basic_success (state, data) {
      state.basic = data
    },

    /* Auth */
    auth (state, payload) {
      if (payload) {
        state.auth = payload
      }
    },

    /* Footer */
    footerBarStateVisible (state, payload) {
      state.isFooterBarVisible = payload
    },

    /* Aside Mobile */
    asideMobileStateToggle (state, payload) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null && payload !== undefined) {
        isShow = payload
      } else {
        isShow = !state.isAsideMobileExpanded
      }

      if (isShow) {
        document.documentElement.classList.add(htmlClassName)
      } else {
        document.documentElement.classList.remove(htmlClassName)
      }

      state.isAsideMobileExpanded = isShow
    },

    /* Auth */
    auth_request (state) {
      state.status = 'loading'
    },
    auth_error (state) {
      state.status = 'error'
    },
    auth_success (state, auth) {
      state.status = 'success'
      state.auth = auth
      localStorage.setItem('shop', JSON.stringify(auth.shop._id))
      localStorage.setItem('auth', JSON.stringify(auth))
    },
    update_success (state, data) {
      state.status = 'success'
      let auth = state.auth
      auth.shop = data
      localStorage.setItem('auth', JSON.stringify(auth))
    },
    update_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.auth = null
      localStorage.removeItem('auth')
    }
  },
  getters: {
    name (state) {
      console.log(state.userName)
      return state.userName
    }
  },
  actions: {
    loaded ({ commit }, state) {
      this.state.basic.loaded = state
    },
    event ({ commit }, data) {
      router.app.$socket.emit('event', Object.assign({}, {
        device: {
          os: 'unknown',
          browser: 'unknown',
          res: {
            width: 0,
            height: 0
          }
        }
      }, data))
    },
    basic ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(`/panel/basic/${this.state.auth.shop.id}`).then((res) => {
          commit('basic_success', res.data)
          axios.get(`/panel/advanced/${this.state.auth.shop.id}`).then((res2) => {
            let shop = res2.data.data
            commit('basic', {
              key: 'shop',
              value: shop
            })
            resolve(res.data)
          })
        }).catch(err => {
          console.log(err)
          commit('basic_error')
          reject(err)
        })
      })
    },
    shop ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('basic', {
          key: 'shop',
          value: payload
        })
        resolve(payload)
      })
    },
    authenticate ({ commit }, auth) {
      return new Promise((resolve, reject) => {
        axios.defaults.headers.common['Authorization'] = auth.token
        commit('auth_success', auth)
        resolve(auth)
      })
    },
    login ({ commit }, shop) {
      return new Promise((resolve, reject) => {
        axios.post('/panel/login', shop).then((res) => {
          axios.defaults.headers.common['Authorization'] = res.data.token
          commit('auth_success', res.data)
          resolve(res.data)
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    update ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.post('/shops/' + this.state.auth.shop._id, data).then((res) => {
          commit('update_success', res.data)
          resolve(res.data)
        }).catch(err => {
          commit('update_success')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    mark ({ commit }, data) {
      commit('basic', {
        key: 'marks',
        value: data
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        const shop = this.state.auth.shop
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve(shop)
      })
    }
  }
})
