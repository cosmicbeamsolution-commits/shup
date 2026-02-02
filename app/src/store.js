import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaded: false,
    basic: {
      loaded: false
    },
    isFooterBarVisible: true,
    endpoint: (process.env.NODE_ENV === 'production' ? 'https://api.geotiendas.com' : 'http://localhost:5500'),
    panel: (process.env.NODE_ENV === 'production' ? 'https://gestor.geotiendas.com' : 'http://localhost:9100')
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },
    basic_success (state, data) {
      console.log(Object.keys(data.landing.plans).length)
      console.log(data.landing.plans)
      state.basic = { ...data, loaded: true }
      // state.basic.loaded = true
    },
    basic_error (state) {
      state.status = 'error'
    }
  },
  getters: {
    status (state) {
      return state.status
    }
  },
  actions: {
    basic ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('/getBasicData').then((res) => {
          commit('basic_success', res.data)
          resolve(res.data)
        }).catch(err => {
          commit('basic_error')
          reject(err)
        })
      })
    },
    loaded ({ commit }, state) {
      this.state.loaded = state
    },
    etag ({ commit }, tag) {
      const tagObject = {
        tag: tag,
        os: this.state.os,
        browser: this.state.browser,
        res: {
          width: window.screen.width,
          height: window.screen.height
        }
      }
      axios.post('/etag', tagObject)
    }
  }
})
