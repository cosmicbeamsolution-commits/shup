<template>
  <section class="section is-background-section" :style="`background-image:url('${basic.shop.background}')`">
    <slot/>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SectionBackground',
  props: {
    sectionData: null,
    shortSection: null,
    isRolled: null,
    title: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    headerIcon: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      short: false
    }
  },
  computed: {
    photoRepeat () {
      return this.page.photoRepeat || 'no-repeat'
    },
    photoPosition () {
      return this.page.photoPosition || 'center center'
    },
    photoSize () {
      return this.page.photoSize || 'cover'
    },
    ...mapState([
      'basic'
    ])
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
