import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import { getBrowser, getOS, uuidv4 } from '@/components/Browser'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shop: {
      items: {},
      stock: {},
      loaded: false,
      extra: {
        social: {}
      }
    },
    order: [],
    device: {},
    isFooterBarVisible: true,
    isActionBarVisible: true,
    status: '',
    uuid: null,
    os: 'unknown',
    browser: 'unknown',
    shareapi: (process.env.NODE_ENV === 'production' ? 'https://share.geotiendas.com' : 'http://localhost:5501'),
    endpoint: (process.env.NODE_ENV === 'production' ? 'https://api.geotiendas.com' : 'http://localhost:5500')
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },
    basic_error (state, data) {
      if (data && data.id) {
        state.shop.id = data.id
      }
      state.status = 'error'
      state.shop.loaded = true
    },
    basic_success (state, data) {
      state.shop = data
      state.uuid = uuidv4()
      state.os = getOS()
      state.browser = getBrowser()
      state.shop.loaded = true
    },
    order_success (state, data) {
      state.order = data
      localStorage.setItem('order', JSON.stringify(data))
    }
  },
  getters: {
    status (state) {
      return state.status
    }
  },
  actions: {
    device ({ commit }) {
      return new Promise((resolve, reject) => {
        const data = {
          os: this.state.os,
          browser: this.state.browser,
          res: {
            width: window.screen.width,
            height: window.screen.height
          }
        }
        this.state.device = data
        resolve(data)
      })
    },
    basic ({ commit }, domain) {
      return new Promise((resolve, reject) => {
        axios.get(`/shops/basic/${domain}`).then((res) => {
          if (res.data.shop) {
            commit('basic_success', res.data)
          } else {
            commit('basic_error', res.data)
          }
          resolve(res.data)
        }).catch(err => {
          commit('basic_error')
          reject(err)
        })
      })
    },
    order ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('order_success', data)
        resolve(data)
      })
    },
    event ({ commit }, data) {
      router.app.$socket.emit('event', Object.assign({}, { device: this.state.device }, data))
    },
    actionBarStateToggle (state, data) {
      if (document.querySelector('.actionbar')) {
        document.querySelector('.actionbar').style.display = data ? 'block' : 'none'
      }
      state.isActionBarVisible = data
    },
    footerBarStateToggle (state, data) {
      if (document.querySelector('.footer')) {
        document.querySelector('.footer').style.display = data ? 'block' : 'none'
      }
      state.isFooterBarVisible = data
    }
  }
})
