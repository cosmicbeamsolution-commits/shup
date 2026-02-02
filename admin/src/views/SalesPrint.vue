<template>
  <div>
    <div class="columns is-mobile is-multiline" size="A4">
      <div v-for="(item, index) in data" :key="index" class="column is-6">
        <table class="table is-narrow is-fullwidth is-size-6">
          <tr class="has-bottom-border">
            <td>
              <span class="has-text-weight-bold">{{ item.delivery_date | adjustDayTZ }} </span>
              <span class="has-text-weight-bold">YACABRON*{{ item.id }}</span>
            </td>
            <td class="has-text-right">
              <span class="has-text-weight-bold is-size-5">{{ item.delivery_code }}</span>
            </td>
          </tr>
          <tr v-for="(order, name) in item.order_sorted" :key="name">
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
              <span class="is-capitalized">{{ item.customer.address }}</span>
              <span v-if="item.customer.address_extra" class="is-capitalized"><strong>{{ item.customer.address_extra }}</strong></span>
            </td>
            <td class="has-text-right" :class="{ 'has-text-success': item.payment_complete }">
              <span class="has-text-weight-bold">${{ item.total }}</span>
              <span v-if="item.payment_mode === 'bank'"> CBU</span>
              <span v-if="item.payment_mode === 'cash'"> Envío a domicilio</span>
              <span v-if="item.payment_mode === 'online'"> Mercado Pago</span>
              <span v-if="item.payment_complete"> (Pagado)</span>
            </td>
          </tr>
          <tr class="has-text-grey">
            <td>
              <p class="is-capitalized">{{ item.customer.fullname }}</p>
            </td>
            <td class="has-text-right">
              <p>{{ item.customer.phone }}</p>
            </td>
          </tr>
          <tr v-if="item.customer.comments && item.customer.comments.length" class="has-text-grey">
            <td colspan="2">
              <p>{{ item.customer.comments }}</p>
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
import moment from 'moment'
export default {
  name: 'sales_print',
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    axios.post('/sales/sort', {
      find: {
        cancelled: false,
        delivery_date: { $gte: moment().subtract(1, 'day') }
      },
      sort: { created: 1 }
    }).then(res => {
      this.data = res.data.map(e => {
        e.order_sorted = this.$root.groupBy(e.order, 'name')
        return e
      })
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
