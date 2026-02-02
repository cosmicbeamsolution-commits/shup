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
    <hero-bar>
      <b-icon icon="cash-usd" size="is-medium"/>
      Ventas
      <div v-if="partial.sales" class="buttons" slot="right">
        <a class="button " @click="getData">
          <span>Actualizar</span>
        </a>
        <a class="button " @click="print">
          <span>Imprimir</span>
        </a>
        <!--a class="button is-success" @click="printActionList">
          <span>Comandar</span>
        </a-->
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
          class="items-table"
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
              <a @click="showItem(props.row)" class="tag" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }" title="Ver venta">
                <b-icon icon="toy-brick" type="is-white" size="is-small"/> <span class="has-text-weight-bold"> {{ props.row.id }}</span>
              </a>
            </b-table-column>
            <b-table-column field="created" label="Solicitado" sortable searchable>
              <span class="tag has-text-weight-bold is-uppercase" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }">{{ props.row.created | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="customer.fullname" label="Cliente" sortable searchable>
              <span class="is-capitalized">{{ props.row.customer.fullname }}</span>
            </b-table-column>
            <b-table-column field="total" label="Total" sortable numeric searchable>
              <span v-if="props.row.payment_mode === 'cash'" class="tag is-grey has-text-weight-bold">EFECT</span>
              <span v-if="props.row.payment_mode === 'bank'" class="tag is-grey has-text-weight-bold">Banco</span>
              <span v-if="props.row.payment_mode === 'mercadopago'" class="tag is-grey has-text-weight-bold">MERCADOPAGO</span>
              <span class="has-text-weight-bold has-text-grey"> ${{ props.row.total }}</span>
            </b-table-column>
            <b-table-column label="Cobrado" class="is-actions-cell" numeric>
              <div class="buttons is-right">
                <b-switch v-model="props.row.payment_complete" @input="togglePaymentComplete(props.row)" :disabled="props.row.cancelled || (props.row.payment_mode === 'mercadopago' && props.row.payment_complete)"></b-switch>
              </div>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <div class="columns">
              <div class="column">
                <table class="table is-striped is-narrow is-bordered">
                  <tr>
                    <td width="1%">
                      <span class="has-text-grey">
                        <b-icon icon="account"/>
                      </span>
                    </td>
                    <td>
                      <span class="has-text-weight-bold">{{ props.row.customer.fullname }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td width="1%">
                      <span class="has-text-grey has-text-weight-bold">
                        <b-icon icon="cellphone"/>
                      </span>
                    </td>
                    <td>
                      <a :href="`call:${props.row.customer.phone}`" target="_blank">
                        <span class="has-text-weight-bold">{{ props.row.customer.phone }}</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td width="1%">
                      <span class="has-text-grey has-text-weight-bold">
                        <b-icon icon="email"/>
                      </span>
                    </td>
                    <td>
                      <a :href="`mailto:${props.row.customer.email}`" target="_blank">
                        <span class="has-text-weight-bold">{{ props.row.customer.email }}</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td width="1%">
                      <span class="has-text-grey has-text-weight-bold">
                        <b-icon icon="select-marker"/>
                      </span>
                    </td>
                    <td>
                      <span class="has-text-weight-bold">{{ props.row.customer.address }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td width="1%">
                      <span class="has-text-grey has-text-weight-bold">
                        <b-icon icon="comment"/>
                      </span>
                    </td>
                    <td>
                      <span class="has-text-weight-bold">{{ props.row.customer.comments }}</span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="column">
                <table class="table is-striped is-narrow">
                  <tr v-for="(item, index) in props.row.items_sorted" :key="index">
                    <td width="1%">
                      <span :style="{ color: item[0].color }">{{item.length}}</span>
                    </td>
                    <td>
                      <span :style="{ color: item[0].color }">{{ index }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </template>
        </b-table>
      </card-component>
      <div v-else class="has-text-centered is-vpadded-x3 content">
        <img src="/img/art/team-success.svg" width="320" />
        <h3>Sin ventas, pero solo por ahora!</h3>
        <p>Cuando tu tienda registre su primera venta aparecerá acá. <br>Podés consultar nuestra Guía y conocer más acerca de <a href="https://overlemon.com/guia/tu-primera-venta">Cómo concretar tu primera venta</a></p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import SaleBox from '@/components/SaleBox'
import SaleDeliveryBox from '@/components/SaleDeliveryBox'
import CardWidget from '@/components/CardWidget'
export default {
  name: 'Sales',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    SaleBox,
    CardComponent,
    CardWidget,
    SaleDeliveryBox
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
    this.$store.dispatch('mark', { sales: false })
    this.getData()
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
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
    showPartial (index) {
      this.activeIndex = index
      this.partial = this.data[index]
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/sales/sort', {
        find: { shop: this.shop._id },
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
            let total = row.filter(e => !e.cancelled).reduce((acc, e) => acc + parseFloat(e.total), 0)
            row.map(e => {
              e.items_sorted = this.$root.groupBy(e.order, 'name')
              return e
            })
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
    },
    togglePaymentComplete (item) {
      let state = { payment_complete: item.payment_complete }
      this.updateItem(item, state).then(res => {
        this.setItem(item, state).then(item => {
          let complete = this.data[this.activeIndex].sales.filter(e => e.payment_complete && !e.cancelled).reduce((acc, e) => acc + parseFloat(e.total), 0)
          let total = parseFloat(this.data[this.activeIndex].total)
          this.data[this.activeIndex].total_complete = complete
          this.data[this.activeIndex].ratio_complete = parseInt(complete / total * 100)
          this['statsKeys' + this.activeIndex]++
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
  }
}
</script>
