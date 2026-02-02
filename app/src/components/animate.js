import Vue from 'vue'

Vue.mixin({
  methods: {
    pulseAnim ({ parent, target }) {
      target.classList.remove('pulse')
      setTimeout(() => {
        target.classList.add('pulse')
      }, 10)
    }
  }
})
