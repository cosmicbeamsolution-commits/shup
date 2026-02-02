<template>
  <div id="app">
    <div v-show="loaded">
      <header-bar/>
      <router-view/>
      <footer-bar/>
    </div>
    <div v-show="!loaded" id="loading" class="animated">
      <svg class="spinner-container" viewBox="0 0 44 44">
        <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
export default {
  name: 'home',
  computed: {
    ...mapState([
      'basic',
      'loaded'
    ])
  },
  components: {
    HeaderBar,
    FooterBar
  },
  mounted () {
    window.addEventListener('scroll', function (e) {
      const slipper = document.querySelector('.slipper')
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      if (scrollTop > 300) {
        if (slipper.classList.contains('slideOutUp')) {
          slipper.classList.remove('slideOutUp')
          slipper.classList.add('slideInDown')
        }
      } else {
        if (slipper.classList.contains('slideInDown')) {
          slipper.classList.remove('slideInDown')
          slipper.classList.add('slideOutUp')
        }
      }
    })
  }
}
</script>
