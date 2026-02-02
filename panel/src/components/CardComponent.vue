<template>
  <div class="card">
    <header v-if="title" class="card-header">
      <p class="card-header-title">
        <b-icon v-if="icon" :icon="icon" custom-size="default"/>
        <svg-icon v-if="svgIcon" :icon="svgIcon"/>
        {{ title }}
      </p>
      <a v-if="headerIcon" href="#" class="card-header-icon" aria-label="more options" @click.prevent="headerIconClick">
        <b-icon :icon="headerIcon" custom-size="default"/>
      </a>
    </header>
    <div class="card-content" :class="{ 'is-paddingless': isPaddingless }">
      <slot/>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'CardComponent',
  components: {
    SvgIcon
  },
  props: {
    title: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    svgIcon: {
      type: String,
      default: null
    },
    headerIcon: {
      type: String,
      default: null
    },
    isPaddingless: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
