<template>
  <div>
    <div class="columns is-mobile is-multiline" size="A4">
      <div class="column is-6">
        <table class="table is-narrow is-fullwidth is-size-6">
          <tr class="has-bottom-border">
            <td>
              <span class="has-text-weight-bold">{{ data.delivery_date | adjustDayTZ }} </span>
              <span class="has-text-weight-bold">YACABRON*{{ data.id }}</span>
            </td>
            <td class="has-text-right">
              <span class="has-text-weight-bold is-size-5">{{ data.delivery_code }}</span>
            </td>
          </tr>
          <tr v-for="(order, name) in data.order_sorted" :key="name">
            <td>
              <span>
                <h5 class="is-marginless" :style="{ color: order[0].color }">{{ name }}</h5>
              </span>
            </td>
            <td class="has-text-right">
              <span>
                <h5 class="is-marginless" :style="{ color: order[0].color }">{{ order.length }}</h5>
              </span>
            </td>
          </tr>
          <tr class="has-top-border">
            <td>
              <span class="is-capitalized">{{ data.customer.address }}</span>
              <span v-if="data.customer.address_extra" class="is-capitalized"><strong>{{ data.customer.address_extra }}</strong></span>
            </td>
            <td class="has-text-right" :class="{ 'has-text-success': data.payment_complete }">
              <span class="has-text-weight-bold">${{ data.total }}</span>
              <span v-if="data.payment_mode === 'bank'"> CBU</span>
              <span v-if="data.payment_mode === 'cash'"> Envío a domicilio</span>
              <span v-if="data.payment_mode === 'online'"> Mercado Pago</span>
              <span v-if="data.payment_complete"> (Pagado)</span>
            </td>
          </tr>
          <tr class="has-text-grey">
            <td>
              <p class="is-capitalized">{{ data.customer.fullname }}</p>
            </td>
            <td class="has-text-right">
              <p>{{ data.customer.phone }}</p>
            </td>
          </tr>
          <tr v-if="data.customer.comments && data.customer.comments.length" class="has-text-grey">
            <td colspan="2">
              <p>{{ data.customer.comments }}</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="column">
        <div id="marker"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'sale_print',
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    axios.get('/sales/' + this.$route.params.id).then(res => {
      this.data = res.data
      this.data.order_sorted = this.$root.groupBy(res.data.order, 'name')
      setTimeout(() => {
        window.print()
      }, 5000)
    })
  }
}
</script>

<style>
  html, body {
    background: white;
  }
  div[size="A4"] {
    width: 21cm;
    height: 29.7cm;
    display: block;
    margin: 0 auto;
  }
  .footer {
    display: none;
  }
  .column {
    padding: 1.75rem;
    height: 15cm;
  }
  @media print {
    body, div[size="A4"] {
      margin: 0;
      box-shadow: 0;
    }
  }
</style>
