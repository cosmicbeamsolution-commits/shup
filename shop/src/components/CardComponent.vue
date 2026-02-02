<template>
  <div class="card-container is-white">
    <h1 v-if="isMobile && title" class="has-text-white is-main-title has-text-weight-extra-bold">{{title}}</h1>
    <div class="card" :class="{ 'card-floating': isFloat, 'is-narrow': isNarrow, 'is-centered': isCentered, 'is-vcondensed': isVCondensed, 'is-mobile': isMobile }">
      <div class="card-content" :class="{ 'is-bottom-rounded': isBottomRounded }">
        <div v-if="title" class="content has-text-centered" :class="{ 'card-background': isBackground }">
          <h3 v-if="title && !isMobile" class="has-text-white">
            {{ title }}
          </h3>
        </div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
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
    },
    isFloat: null,
    isNarrow: null,
    isMobile: null,
    isCentered: null,
    isBackground: null,
    isVCondensed: null,
    backgroundImage: null,
    isBottomRounded: null
  },
  methods: {
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
