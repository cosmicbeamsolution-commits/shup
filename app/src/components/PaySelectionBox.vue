<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title title">¿Cómo querés pagar?</p>
      </header>
      <!--section class="modal-card-body">
        <h4 class="modal-card-title has-text-centered">Elegí como querés pagar</h4>
      </section-->
      <footer class="modal-card-foot is-flex-center is-rounded">
        <!--button class="button is-rounded" type="button" @click="cancel">Cerrar</button-->
        <button v-if="shop.payment_methods.includes('cash')" class="button is-info" type="button" @click="paySelect('cash')">Efectivo</button>
        <button v-if="shop.payment_methods.includes('bank')" class="button is-info" type="button" @click="paySelect('bank')">CBU</button>
        <button v-if="shop.payment_methods.includes('online')" class="button is-info" type="button" @click="paySelect('online')">Mercado Pago</button>
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
      'shop'
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
