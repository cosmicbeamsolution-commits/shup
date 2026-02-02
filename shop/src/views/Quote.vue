<template>
  <div>
    <pay-selection-box
      :is-active="isPayModalActive"
      @cancel="payBoxCancel"
      @pay-select="payBoxSelect" />
    <header-component/>
    <div class="is-bottom-extra-extra-padded animated fadeIn">
      <card-component :is-float="true" :is-narrow="true" :is-centered="true" class="is-white">
        <h3 class="is-special-title has-text-centered">Detalle de tu cotización</h3>
        <table class="table is-striped is-fullwidth">
          <tr>
            <td width="1%">
              <b-icon icon="toy-brick" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.id }}</p>
            </td>
          </tr>
          <tr>
            <td width="1%">
              <b-icon icon="clock" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.created | adjustTZ }} ({{ data.created | fromNow }})</p>
            </td>
          </tr>
          <tr v-if="data.order[0]">
            <td width="1%">
              <b-icon icon="credit-card" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.order[0].name }}</p>
            </td>
          </tr>
          <tr>
            <td width="1%">
              <b-icon icon="account" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.customer.fullname }}</p>
            </td>
          </tr>
          <tr>
            <td width="1%">
              <b-icon icon="comment" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.text }}</p>
            </td>
          </tr>
        </table>
      </card-component>
    </div>
    <notification class="is-dark animate delay-1s slideInUp">
      <div class="level is-mobile">
        <div class="level-item level-left">
          <span class="icon">
            <span class="mdi mdi-shopping-outline mdi-36px is-relative">
              <span class="tag is-success order-size-tag has-text-weight-bold">1</span>
            </span>
          </span>
        </div>
        <div class="level-item">
          <button type="button" class="button is-small is-info" @click="paySelectionModal()">
            <span class="is-size-6 is-line-height1">Contratar</span>
          </button>
        </div>
        <div class="level-item level-right">
          <div class="is-transparent order-total">
            <span v-show="orderSum" class="has-text-weight-bold">(${{ orderSum }})</span>
          </div>
        </div>
      </div>
    </notification>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import HeaderComponent from '../components/HeaderComponent'
import CardComponent from '@/components/CardComponent'
import PaySelectionBox from '@/components/PaySelectionBox'
import Notification from '@/components/Notification'
export default {
  name: 'quote',
  components: {
    CardComponent,
    HeaderComponent,
    PaySelectionBox,
    Notification
  },
  data () {
    return {
      data: {
        order: [],
        customer: {}
      },
      payMode: '',
      orderSum: 0,
      isPayModalActive: false
    }
  },
  created () {
    axios.post('/shops/quotes/' + this.$route.params.id).then(res => {
      this.data = res.data.data
      this.orderSum = this.data.total
    })
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  methods: {
    paySelectionModal () {
      this.isPayModalActive = true
    },
    payBoxCancel () {
      this.isPayModalActive = false
    },
    payBoxSelect (mode) {
      this.isPayModalActive = false
      this.payMode = mode
      this.submit()
    },
    submit () {
      this.$buefy.toast.open({
        message: `Generando orden de compra, por favor espere...`,
        queue: false,
        duration: 3000
      })
      // this.customer.email = this.customer.email.trim()
      /* save customer data for future orders */
      // localStorage.setItem('customer', JSON.stringify(this.customer))
      /* register payment */
      axios.post(`/shops/payments/quote/${this.data._id}`, {
        paymode: this.payMode
      }).then(res => {
        if (res.data.status === 'success') {
          setTimeout(() => {
            if (this.payMode === 'mercadopago') {
              this.$buefy.toast.open({
                message: `Recibiendo datos de mercadopago, por favor espere...`,
                queue: true
              })
              /* save payment preference for further use */
              localStorage.setItem('preference', JSON.stringify(res.data.data))
              this.$router.push('/pagar')
            } else {
              localStorage.removeItem('order')
              this.$router.push('/gracias')
            }
          }, 1000)
        } else {
          this.$buefy.toast.open({
            message: `Hubo un error al generar la orden de compra. Por favor, intente nuevamente en unos instantes.`,
            type: 'is-danger',
            queue: true,
            duration: 10000
          })
        }
      }).catch(err => {
        this.$buefy.toast.open({
          message: `Hubo un error al generar la orden de compra. Por favor, intente nuevamente en unos instantes. Error: ${err}`,
          type: 'is-danger',
          queue: false,
          duration: 10000
        })
      })
    }
  }
}
</script>
