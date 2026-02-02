<template>
  <footer v-show="basic.loaded && isFooterBarVisible" class="footer animated fadeIn delay3">
    <div class="container-fluid">
      <div class="level is-flex-end">
        <div class="level-right">
          <div class="level-item has-text-grey is-size-7 is-capitalized">
            &copy; {{ year }} geotiendas
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'FooterBar',
  computed: {
    pathName () {
      return window.location.pathName
    },
    year () {
      return moment().year()
    },
    ...mapState([
      'basic',
      'isFooterBarVisible'
    ])
  }
}
</script>
