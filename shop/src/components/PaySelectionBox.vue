<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title is-size-5 has-text-weight-bold">¿Cómo querés pagar?</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <div class="is-flex-center">
              <div v-if="shop.payment_methods" class="buttons is-flex-center">
                <div class="is-hidden-mobile">
                  <b-button v-if="shop.payment_methods.includes('takeaway')" type="is-info is-fullwidth is-small is-link is-size-6" icon-left="car" @click="paySelect('takeaway')">Retiro en sucursal</b-button>
                  <b-button v-if="shop.payment_methods.includes('cash')" type="is-info is-fullwidth is-small is-link is-size-6" icon-left="truck" @click="paySelect('cash')">Envío a domicilio</b-button>
                  <b-button v-if="shop.payment_methods.includes('bank')" type="is-success is-fullwidth is-small is-link is-size-6" icon-left="bank" @click="paySelect('bank')">CBU</b-button>
                  <b-button v-if="shop.payment_methods.includes('mercadopago')" type="is-success is-fullwidth is-small is-link is-size-6" icon-left="credit-card" @click="paySelect('mercadopago')">Mercado Pago</b-button>
                </div>
                <div class="is-hidden-tablet">
                  <nav class="level is-mobile">
                    <div class="level-item">
                      <a v-if="shop.payment_methods.includes('takeaway')" @click="paySelect('takeaway')" class="button is-info">
                        <b-icon icon="car"/>
                      </a>
                    </div>
                    <div class="level-item">
                      <a v-if="shop.payment_methods.includes('cash')" @click="paySelect('cash')" class="button is-info">
                        <b-icon icon="truck"/>
                      </a>
                    </div>
                    <div class="level-item">
                      <a v-if="shop.payment_methods.includes('bank')" @click="paySelect('bank')" class="button is-success">
                        <b-icon icon="bank"/>
                      </a>
                    </div>
                    <div class="level-item">
                      <a v-if="shop.payment_methods.includes('mercadopago')" @click="paySelect('mercadopago')" class="button is-success">
                        <b-icon icon="credit-card"/>
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="has-text-centered is-vpadded">
              <img src="/img/art/credit-card.svg" width="220"/>
            </div>
            <div v-if="shop.payment_methods.includes('takeaway')" class="has-text-dark">
              <p>La forma de pago <b>Retiro en sucursal</b> no conlleva costos de envío y recibirás la dirección de la tienda por correo.</p>
            </div>
            <div v-if="shop.payment_methods.includes('bank')" class="has-text-dark">
              <p>La forma de pago <b>CBU</b> implica una trasferencia electrónica y recibirás los datos de la cuenta bancaria de la tienda por correo.</p>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-flex-center">
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
    goBack () {
      history.go(-1)
    },
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
