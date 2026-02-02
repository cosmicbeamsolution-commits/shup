<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="cash-usd" size="is-medium"/>
      Ventas
      <div class="buttons" slot="right">
        <a class="button" @click="getData">
          <span>Actualizar</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div v-for="(item, index) in data" :key="'statsKeys'+index" class="column is-clickable" @click="showPartial(index)">
          <card-widget class="tile is-child is-clickable" :class="{ 'is-active': activeIndex === index }" type="is-light" icon="cash-usd" prefix="$" :number="item.total_complete" :label="item.formatted_date + ' $(' + item.total + ')'" :style="activeIndex === index && item.ratio_complete?'background: linear-gradient(to right,#02b875cc '+item.ratio_complete+'%,#02b875 '+item.ratio_complete+'%)':''"/>
        </div>
      </div>
      <card-component v-if="partial.sales">
        <b-table
          class="sales-table"
          :data="partial.sales"
          default-sort-direction="desc"
          default-sort="id"
          detail-key="id"
          :opened-detailed="defaultOpenedDetails"
          :row-class="onRowClass"
          detailed
          focusable>
          <template slot-scope="props">
            <b-table-column field="id" label="#" width="40" sortable numeric searchable>
              <b-icon icon="toy-brick" type="is-white" size="is-small"/> <span class="has-text-weight-bold"> {{ props.row.id }}</span>
            </b-table-column>
            <b-table-column field="created" label="Solicitado" sortable searchable>
              <span class="tag has-text-weight-bold is-uppercase" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }">{{ props.row.created | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="customer.shop_name" label="Tienda" sortable searchable>
              <span class="is-capitalized">{{ props.row.shop_name }}</span>
            </b-table-column>
            <b-table-column field="customer.fullname" label="Cliente" sortable searchable>
              <span class="is-capitalized">{{ props.row.customer.fullname }}</span>
            </b-table-column>
            <b-table-column field="customer.phone" label="Tel" sortable searchable>
              <span class="is-capitalized">{{ props.row.customer.phone }}</span>
            </b-table-column>
            <b-table-column field="customer.address" label="Dirección" sortable searchable>
              <span class="is-capitalized">{{ props.row.customer.address }} {{ props.row.customer.address_extra }}</span>
            </b-table-column>
            <b-table-column field="total" label="Total" sortable numeric searchable>
              <span v-if="props.row.payment_mode === 'cash'" class="tag is-grey has-text-weight-bold">EFECT</span>
              <span v-if="props.row.payment_mode === 'bank'" class="tag is-grey has-text-weight-bold">CBU</span>
              <span v-if="props.row.payment_mode === 'online'" class="tag is-grey has-text-weight-bold">ONLINE</span>
              <span class="has-text-weight-bold has-text-grey"> ${{ props.row.total }}</span>
            </b-table-column>
            <b-table-column label="Cobrado" class="is-actions-cell" numeric>
              <div class="buttons is-right">
                <b-switch v-model="props.row.payment_complete" @input="togglePaymentComplete(props.row)" :disabled="props.row.cancelled || (props.row.payment_mode === 'online' && props.row.payment_complete)"></b-switch>
              </div>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <table class="table is-striped is-narrow">
              <tr v-for="(item, index) in props.row.order" :key="index">
                <td>
                  <span>{{ item.name }} ({{ item.count }})</span>
                </td>
                <td>
                  <span>${{ item.price }}</span>
                </td>
              </tr>
            </table>
          </template>
        </b-table>
      </card-component>
      <notification v-else class="is-info">
        <p>No se registran ventas para este periodo</p>
      </notification>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import CardWidget from '@/components/CardWidget'
import Notification from '@/components/Notification'
export default {
  name: 'Sales',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    CardWidget,
    Notification
  },
  data () {
    return {
      isSaleBoxActive: false,
      isSaleDeliveryBoxActive: false,
      defaultOpenedDetails: [],
      activeIndex: 0,
      query: '',
      item: {},
      data: [],
      partial: []
    }
  },
  sockets: {
    sale (data) {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  methods: {
    updateItem (item, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`/sales/${item._id}`, payload).then(res => {
          resolve(item)
        })
      })
    },
    setItem (item, data) {
      return new Promise((resolve, reject) => {
        const index = this.data[this.activeIndex].sales.findIndex(e => e._id === item._id)
        Object.keys(data).map(i => {
          item[i] = data[i]
        })
        this.$set(this.data[this.activeIndex].sales, index, item)
        resolve(item)
      })
    },
    togglePaymentComplete (item) {
      let state = { payment_complete: item.payment_complete }
      this.updateItem(item, state).then(res => {
        this.setItem(item, state).then(item => {
          let complete = this.data[this.activeIndex].sales.filter(e => e.payment_complete && !e.cancelled).reduce((acc, e) => acc + e.total, 0)
          let total = this.data[this.activeIndex].total
          this.data[this.activeIndex].total_complete = complete
          this.data[this.activeIndex].ratio_complete = parseInt(complete / total * 100)
          this.statsKey++
          this.$buefy.toast.open({
            message: `Estado de pago actualizado`
          })
        })
      })
    },
    onRowClass: function (item, index) {
      let classList = []
      if (item.hidden) {
        classList.push('is-hidden')
      }
      if (item.cancelled) {
        classList.push('is-cancelled')
      }
      return classList.join(' ')
    },
    showPartial (index) {
      this.activeIndex = index
      this.partial = this.data[index]
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/sales/sort', {
        find: {},
        sort: { created: 1 }
      }).then(res => {
        if (res.data.length) {
          this.data = []
          res.data.map(e => {
            e.date_group = moment(e.created).format('YYYY-MM')
            return e
          })
          let grouped = this.$root.groupBy(res.data, 'date_group')
          Object.keys(grouped).forEach(i => {
            let row = grouped[i]
            let complete = row.filter(e => e.payment_complete && !e.cancelled).reduce((acc, e) => acc + parseFloat(e.total), 0)
            let total = row.filter(e => !e.cancelled).reduce((acc, e) => acc + parseInt(e.total) || 0, 0)
            this.data.push({
              date: i,
              formatted_date: moment(i).format('MMM YYYY').toUpperCase(),
              sales: row.reverse(),
              total: total,
              total_complete: complete,
              ratio_complete: parseInt(complete / total * 100)
            })
            this['statsKeys' + this.data.length - 1] = 0
          })
          this.showPartial(this.data.length - 1)
        }
        this.$store.dispatch('loaded', true)
      })
    }
  }
}
</script>
