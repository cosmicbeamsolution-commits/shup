<template>
  <div v-if="!isDismissed" class="notification">
    <button v-if="dismissable" @click="dismiss" class="delete"></button>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <slot/>
        </div>
      </div>
      <div v-if="action" class="level-right level-right-padded">
        <div class="level-item">
          <button type="button" class="button is-small is-white">{{ action.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    dismissable: {
      type: Boolean,
      default: true
    },
    action: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isDismissed: false
    }
  },
  methods: {
    dismiss () {
      this.isDismissed = true
    }
  }
}
</script>
