<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title title">¿Cómo querés pagar?</p>
      </header>
      <footer class="modal-card-foot is-flex-center ">
        <button class="button is-info " type="button" @click="paySelect('bank')">Banco</button>
        <button class="button is-info " type="button" @click="paySelect('online')">Mercado Pago</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PaySelectionBox',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  data () {
    return {
      isModalActive: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    paySelect (mode) {
      this.$emit('pay-select', mode)
    }
  },
  watch: {
    isActive (newValue) {
      this.isModalActive = newValue
    },
    isModalActive (newValue) {
      if (!newValue) {
        this.cancel()
      }
    }
  }
}
</script>
