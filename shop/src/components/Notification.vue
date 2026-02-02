<template>
  <div v-if="!isDismissed" class="notification is-notification-fixed">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data () {
    return {
      isDismissed: false
    }
  },
  methods: {
    ready () {
      this.$emit('ready')
    },
    dismiss () {
      this.isDismissed = true
      this.$buefy.snackbar.open({
        message: 'Dismissed',
        queue: false
      })
    }
  }
}
</script>
