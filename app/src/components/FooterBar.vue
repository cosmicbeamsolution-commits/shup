<template>
  <div class="animated fadeIn delay2">
    <div class="container" v-show="basic.loaded && isFooterBarVisible">
      <footer class="section">
        <div class="columns">
          <div class="column">
            <div class="v-field has-text-centered is-padded-top">
              <span class="has-text-grey">
                © {{ year }} <img class="is-logo-small" src="/img/GeoBlackCyan.svg"/><router-link to="/guia">Guía</router-link><span class="is-hidden-mobile"> | <router-link to="/terminos-y-condiciones">Términos y condiciones</router-link></span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'FooterBar',
  computed: {
    year () {
      return moment().year()
    },
    ...mapState([
      'isFooterBarVisible',
      'basic'
    ])
  }
}
</script>
