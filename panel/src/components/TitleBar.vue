<template>
  <section class="section is-title-bar">
    <div class="level is-flex-start">
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li v-for="(title,index) in titleStack" :key="index">{{ title }}</li>
          </ul>
        </div>
      </div>
      <div v-if="callAction" class="level-right">
        <div class="level-item">
          <div class="buttons is-right">
            <router-link :to="callAction.link" class="button is-danger">
              <b-icon :icon="callAction.icon" custom-size="default"/>
              <span>{{ callAction.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TitleBar',
  props: {
    titleStack: {
      type: Array,
      default: () => []
    },
    callAction: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
