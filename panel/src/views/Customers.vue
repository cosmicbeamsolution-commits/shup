<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="account-card-details" size="is-medium"/>
      Clientes
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
      <card-component>
        <b-field grouped>
          <b-switch v-model="showDetailIcon"></b-switch>
          <input class="input" @keyup="search" v-model="query" placeholder="Buscar...">
        </b-field>
        <b-table
          :data="data"
          default-sort-direction="desc"
          default-sort="phone"
          detail-key="phone"
          :opened-detailed="defaultOpenedDetails"
          :row-class="onRowClass"
          detailed
          focusable>
          <template slot-scope="props">
            <b-table-column field="id" icon="phone" width="40" sortable numeric>
              <span class="tag is-info">
                <b-icon icon="phone" type="is-white" size="is-small"/> <span class="has-text-weight-bold"> {{ props.row.phone }}</span>
              </span>
            </b-table-column>
            <b-table-column field="fullname" label="Cliente" sortable>
              <span class="is-capitalized">{{ props.row.fullname }}</span>
            </b-table-column>
            <b-table-column field="sales_count" label="Compras" sortable numeric>
              <span class="has-text-weight-bold has-text-grey"> #{{ props.row.sales_count }}</span>
            </b-table-column>
            <b-table-column field="sales_total" label="Total" sortable numeric>
              <span class="has-text-weight-bold has-text-grey"> ${{ props.row.sales_total }}</span>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <table class="table is-striped is-narrow">
              <tr>
                <td width="1%">
                  <b-icon size="is-small" icon="account"/>
                </td>
                <td>
                  <span>{{ props.row.fullname }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <b-icon size="is-small" icon="phone"/>
                </td>
                <td>
                  <span>{{ props.row.phone }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <b-icon size="is-small" icon="email"/>
                </td>
                <td>
                  <span>{{ props.row.email }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <b-icon size="is-small" icon="map"/>
                </td>
                <td>
                  <span>{{ props.row.address }} {{ props.row.address_extra }}</span>
                </td>
              </tr>
            </table>
          </template>
        </b-table>
      </card-component>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Archive',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent
  },
  data () {
    return {
      defaultOpenedDetails: [],
      showDetailIcon: false,
      data: [],
      query: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    onRowClass: function (item, index) {
      let classList = []
      if (item.hidden) {
        classList.push('is-hidden')
      }
      return classList.join(' ')
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.get('/sales').then(res => {
        this.data = {}
        let data = res.data.map(e => {
          return {
            fullname: e.customer.fullname,
            phone: e.customer.phone,
            email: e.customer.email,
            address: e.customer.address,
            total: e.total,
            count: e.order.length
          }
        })
        data = this.$root.groupBy(data, 'phone')
        let customers = Object.keys(data).map(e => {
          let items = data[e]
          return {
            fullname: items[0].fullname,
            phone: items[0].phone,
            email: items[0].email,
            address: items[0].address,
            address_extra: items[0].address_extra,
            sales_count: items.length,
            sales_total: items.reduce((acc, i) => acc + i.total, 0)
          }
        })
        this.data = customers
        this.$store.dispatch('loaded', true)
      })
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
      this.data = this.data.map(e => {
        let state = true
        if (this.query.trim().length) {
          state = sanitize(e.fullname).indexOf(query) !== -1 ||
            sanitize(e.phone).indexOf(query) !== -1 ||
            sanitize(e.address).indexOf(query) !== -1
        }
        e.hidden = !state
        return e
      })
    },
    print () {
      window.print()
    }
  },
  watch: {
    showDetailIcon (value) {
      if (value) {
        this.defaultOpenedDetails = this.data.map(e => e.phone)
      } else {
        this.defaultOpenedDetails = []
      }
    }
  }
}
</script>
