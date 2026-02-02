import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    basic: {
      loaded: false,
      application: {}
    },
    shop: {},
    /* Auth */
    auth: null,
    /* NavBar */
    isNavBarVisible: true,
    /* FooterBar */
    isFooterBarVisible: true,
    marks: {},
    /* Aside */
    isAsideVisible: true,
    isAsideMobileExpanded: false,
    status: '',
    endpoint: (process.env.NODE_ENV === 'production' ? 'https://api.geotiendas.com' : 'http://localhost:5500')
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

    /* Aside Mobile */
    asideMobileStateToggle (state, payload = null) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null) {
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
      localStorage.setItem('auth', JSON.stringify(auth))
    },
    update_success (state, data) {
      let auth = state.auth
      auth.user = data
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
      return state.userName
    }
  },
  actions: {
    loaded ({ commit }, state) {
      this.state.basic.loaded = state
    },
    basic ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('/basic').then((res) => {
          commit('basic_success', res.data)
          resolve(res.data)
        }).catch(err => {
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
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/admin/login', user).then((res) => {
          const auth = res.data
          axios.defaults.headers.common['Authorization'] = auth.token
          commit('auth_success', auth)
          resolve(res)
        }).catch(err => {
          commit('auth_error')
          localStorage.removeItem('auth')
          reject(err)
        })
      })
    },
    update ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/admins/' + this.state.auth.user._id, data).then((res) => {
          const user = res.data
          commit('update_success', user)
          resolve(res)
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
        const user = this.state.auth.user.first_name
        commit('logout')
        delete axios.defaults.headers.common['Authorization']
        resolve(user)
      })
    }
  }
})
