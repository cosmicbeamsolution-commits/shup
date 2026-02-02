<template>
  <section class="section is-background-section is-background-image" :class="{ 'is-main-section': !shortSection, 'is-rolled': isRolled }">
    <slot/>
    <div class="background-image"/>
  </section>
</template>

<script>
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
    }
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
