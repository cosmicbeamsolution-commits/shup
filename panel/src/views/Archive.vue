<template>
  <div>
    <sale-box
      :is-active="isSaleBoxActive"
      :data-item="item"
      @update="saleUpdate"
      @cancel="saleCancel"/>
    <sale-delivery-box
      :is-active="isSaleDeliveryBoxActive"
      :data-item="item"
      @update="saleDeliveryUpdate"
      @cancel="saleDeliveryCancel"/>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="cash-usd" size="is-large"/>
      Ventas
      <div class="buttons" slot="right">
        <a class="button " @click="getData">
          <span>Actualizar</span>
        </a>
        <a class="button " @click="print">
          <span>Imprimir</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns" :key="statsKey">
        <div v-for="(item, index) in data" :key="index" class="column is-clickable" @click="showPartial(index)">
          <card-widget class="tile is-child is-clickable" :class="{ 'is-active': activeIndex === index }" type="is-light" icon="cash-usd" prefix="$" :number="item.total_complete" :label="item.formated_date + ' $(' + item.total + ')'" :style="activeIndex === index && item.ratio_complete?'background: linear-gradient(to right,#02b875cc '+item.ratio_complete+'%,#02b875 '+item.ratio_complete+'%)':''"/>
        </div>
      </div>
      <card-component v-if="partial.sales">
        <b-field grouped>
          <b-switch v-model="showDetailIcon"></b-switch>
          <input class="input" @keyup="search" v-model="query" placeholder="Buscar...">
        </b-field>
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
            <b-table-column field="id" label="#" width="40" sortable numeric>
              <a @click="showItem(props.row)" class="tag" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }" title="Ver venta">
                <b-icon icon="toy-brick" type="is-white" size="is-small"/> <span class="has-text-weight-bold"> {{ props.row.id }}</span>
              </a>
            </b-table-column>
            <b-table-column field="delivery_code" label="Código" sortable>
              <a @click="showItemDelivery(props.row)" class="tag has-text-weight-bold" :class="{ 'is-danger': !props.row.cancelled, 'is-light': props.row.cancelled }">{{ props.row.delivery_code || '?' }}</a>
            </b-table-column>
            <b-table-column field="created" label="Solicitado" sortable>
              <span class="tag has-text-weight-bold is-uppercase" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }">{{ props.row.created | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="customer.address" label="Dirección" sortable>
              <span class="is-capitalized">{{ props.row.customer.address }} {{ props.row.customer.address_extra }}</span>
            </b-table-column>
            <b-table-column field="customer.fullname" label="Cliente" sortable>
              <span class="is-capitalized">{{ props.row.customer.fullname }}</span>
            </b-table-column>
            <b-table-column field="customer.phone" label="Tel." sortable>
              <span>{{ props.row.customer.phone }}</span>
            </b-table-column>
            <b-table-column field="total" label="Total" sortable numeric>
              <span v-if="props.row.payment_mode === 'cash'" class="tag is-grey has-text-weight-bold">EFECT</span>
              <span v-if="props.row.payment_mode === 'bank'" class="tag is-grey has-text-weight-bold">BANCO</span>
              <span v-if="props.row.payment_mode === 'mercadopago'" class="tag is-grey has-text-weight-bold">MERCADOPAGO</span>
              <span class="has-text-weight-bold has-text-grey"> ${{ props.row.total }}</span>
            </b-table-column>
            <b-table-column label="Cobrado" class="is-actions-cell">
              <div class="buttons is-right">
                <b-switch v-model="props.row.payment_complete" @input="togglePaymentComplete(props.row)" :disabled="props.row.cancelled || (props.row.payment_mode === 'mercadopago' && props.row.payment_complete)"></b-switch>
              </div>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <span class="tag is-tag-spaced" v-for="(item, index) in props.row.items_sorted" :key="index" :style="{ backgroundColor: item[0].color }">
              <span class="has-text-weight-bold has-text-white">{{item.length}} {{ index }}</span>
            </span>
          </template>
        </b-table>
      </card-component>
      <notification v-else class="is-info">
        <p>No se registra historial de ventas</p>
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
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import SaleBox from '@/components/SaleBox'
import SaleDeliveryBox from '@/components/SaleDeliveryBox'
import CardWidget from '@/components/CardWidget'
import Notification from '@/components/Notification'
export default {
  name: 'Sales',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    TitleBar,
    SaleBox,
    CardComponent,
    CardWidget,
    SaleDeliveryBox,
    Notification
  },
  data () {
    return {
      isSaleBoxActive: false,
      isSaleDeliveryBoxActive: false,
      showDetailIcon: false,
      defaultOpenedDetails: [],
      activeIndex: 0,
      statsKey: 0,
      query: '',
      item: {},
      data: [],
      partial: []
    }
  },
  sockets: {
    sale (data) {
      if (!this.isSaleBoxActive && !this.isSaleDeliveryBoxActive) {
        setTimeout(() => {
          this.getData()
        }, 1000)
      } else {
        this.$buefy.toast.open({
          message: `Hay nuevas ventas`
        })
      }
    }
  },
  created () {
    this.$store.dispatch('mark', { sales: false })
    this.getData()
  },
  computed: {
    titleStack () {
      return [
        'Gestor',
        'Ventas'
      ]
    }
  },
  methods: {
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
    search () {
      const sanitize = (str) => {
        if (!str) {
          return ''
        }
        if (typeof str !== 'string') {
          return str
        }
        return str.toLowerCase().split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u').split('ñ').join('n')
      }
      const query = sanitize(this.query)
      this.partial.sales = this.partial.sales.map(e => {
        let state = true
        if (this.query.trim().length) {
          state = sanitize(e.customer.fullname).indexOf(query) !== -1 ||
            sanitize(e.customer.phone).indexOf(query) !== -1 ||
            sanitize(e.customer.address).indexOf(query) !== -1 ||
            sanitize(e.delivery_code).indexOf(query) !== -1 ||
            sanitize(e.id).indexOf(query) !== -1
        }
        e.hidden = !state
        return e
      })
    },
    showPartial (index) {
      this.activeIndex = index
      this.partial = this.data[index]
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/sales/sort', {
        find: {
          delivery_date: { $lte: moment().subtract(1, 'day') }
        },
        sort: { created: 1 }
      }).then(res => {
        if (res.data.length) {
          this.data = []
          let grouped = this.$root.groupBy(res.data, 'delivery_date')
          Object.keys(grouped).forEach(i => {
            let row = grouped[i]
            let complete = row.filter(e => e.payment_complete && !e.cancelled).reduce((acc, e) => acc + e.total, 0)
            let total = row.filter(e => !e.cancelled).reduce((acc, e) => acc + e.total, 0)
            row.map(e => {
              e.items_sorted = this.$root.groupBy(e.order, 'name')
              return e
            })
            this.data.push({
              date: i,
              formated_date: moment(i).format('DD MMMM YYYY'),
              sales: row.reverse(),
              total: total,
              total_complete: complete,
              ratio_complete: parseInt(complete / total * 100)
            })
          })
          this.showPartial(0)
        }
        this.$store.dispatch('loaded', true)
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
    printActionList () {
      window.open('/sales/print', `height=${window.screen.availHeight},width=800`)
    },
    print () {
      window.print()
    },
    toggleCancelled (item) {
      this.updateItem(item, { cancelled: item.cancelled }).then(res => {
        this.$buefy.toast.open({
          message: `Estado de cancelación actualizado`
        })
      })
    },
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
    saleDeliveryUpdate (data) {
      this.updateItem(data.item, data.update).then(res => {
        this.setItem(data.item, data.update).then(item => {
          this.$buefy.toast.open({
            message: `Código de entrega actualizado`
          })
        })
      })
      this.isSaleDeliveryBoxActive = false
    },
    showItemDelivery (item) {
      this.item = item
      this.isSaleDeliveryBoxActive = true
    },
    saleDeliveryCancel () {
      this.isSaleDeliveryBoxActive = false
    },
    saleUpdate (data) {
      this.updateItem(data.item, data.update).then(res => {
        this.setItem(data.item, data.update).then(item => {
          let complete = this.data[this.activeIndex].sales.filter(e => e.payment_complete && !e.cancelled).reduce((acc, e) => acc + e.total, 0)
          let total = this.data[this.activeIndex].sales.filter(e => !e.cancelled).reduce((acc, e) => acc + e.total, 0)
          this.data[this.activeIndex].total_complete = complete
          this.data[this.activeIndex].ratio_complete = parseInt(complete / total * 100)
          this.data[this.activeIndex].total = total
          this.statsKey++
          this.$buefy.toast.open({
            message: `Estado de cancelación actualizado`
          })
        })
      })
      this.isSaleBoxActive = false
    },
    showItem (item) {
      this.item = item
      this.isSaleBoxActive = true
    },
    saleCancel () {
      this.isSaleBoxActive = false
    }
  },
  watch: {
    showDetailIcon (value) {
      if (value) {
        this.defaultOpenedDetails = this.partial.sales.map(e => e.id)
      } else {
        this.defaultOpenedDetails = []
      }
    }
  }
}
</script>
