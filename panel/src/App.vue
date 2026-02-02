<template>
  <div id="app">
    <div :class="{ 'is-blured': !basic.loaded }">
      <!--router-view :key="$route.fullPath" /-->
      <router-view />
      <footer-bar />
    </div>
    <div v-show="!basic.loaded" id="loading" class="animated">
      <svg class="spinner-container" viewBox="0 0 44 44">
        <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FooterBar from '@/components/FooterBar'
export default {
  name: 'home',
  components: {
    FooterBar
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  created () {
    let auth = JSON.parse(localStorage.getItem('auth'))
    if (auth) {
      this.$store.commit('auth', auth)
    }
  }
}
</script>
