<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="clipboard-flow" size="is-medium"/>
      Presupuestos
      <div class="buttons" slot="right">
        <a class="button " @click="getData">
          <span>Actualizar</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div v-for="(item, index) in data" :key="'statsKeys'+index" class="column is-clickable" @click="showPartial(index)">
          <card-widget class="tile is-child is-clickable" :class="{ 'is-active': activeIndex === index }" type="is-light" icon="clipboard-flow" prefix="$" :number="item.total" :label="item.formatted_date"/>
        </div>
      </div>
      <card-component v-if="partial.items">
        <b-table
          class="items-table"
          :data="partial.items"
          default-sort-direction="desc"
          default-sort="id"
          detail-key="id"
          :opened-detailed="defaultOpenedDetails"
          :row-class="onRowClass"
          detailed
          focusable>
          <template slot-scope="props">
            <b-table-column field="id" label="#" width="40" sortable numeric searchable>
              <span class="tag is-info" title="Ver venta">
                <b-icon icon="toy-brick" type="is-white" size="is-small"/> <span class="has-text-weight-bold"> {{ props.row.id }}</span>
              </span>
            </b-table-column>
            <b-table-column field="created" label="Solicitado" sortable searchable>
              <span class="tag has-text-weight-bold is-uppercase" :class="{ 'is-info': !props.row.cancelled, 'is-light': props.row.cancelled }">{{ props.row.created | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="customer.fullname" label="Cliente" sortable searchable>
              <span class="is-capitalized">{{ props.row.customer.fullname }}</span>
            </b-table-column>
            <b-table-column field="order[0].name" label="Servicio" sortable searchable>
              <span class="is-capitalized">{{ props.row.order[0].name }}</span>
            </b-table-column>
            <b-table-column field="total" label="Total" sortable numeric searchable>
              <span class="has-text-weight-bold has-text-grey"> ${{ props.row.total }}</span>
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
                <div v-show="props.row.sent" class="notification is-grey">
                  Presupuesto enviado
                </div>
                <form @submit.prevent="submit(props.row)">
                  <b-field label="Fundamentá tu presupuesto" :message="quoteTextLength + '/' + quoteTextMax">
                    <textarea class="textarea is-rows-condensed" @input="checkQuoteTextLength(props.row.text)" @keyup="checkQuoteTextLength(props.row.text)" v-model="props.row.text" placeholder="El presupuesto incluye..." :disabled="sending || props.row.sent" required />
                  </b-field>
                  <b-field label="Monto final de la cotización" :message="`La cotización se enviará a ${props.row.customer.email}`">
                    <b-input type="number" v-model="props.row.total" :disabled="sending || props.row.sent" required />
                  </b-field>
                  <div v-show="!props.row.sent" class="buttons is-flex-end">
                    <b-button type="is-success" native-type="submit" :loading="sending">Enviar cotización</b-button>
                  </div>
                </form>
              </div>
            </div>
          </template>
        </b-table>
      </card-component>
      <notification v-else class="is-info">
        <p>No se registran presupuestos para este periodo</p>
      </notification>
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
import CardWidget from '@/components/CardWidget'
import Notification from '@/components/Notification'
export default {
  name: 'Quotes',
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
      showDetailIcon: false,
      defaultOpenedDetails: [],
      activeIndex: 0,
      quoteTextLength: 0,
      quoteTextMax: 500,
      sending: false,
      query: '',
      form: {},
      data: [],
      partial: []
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  methods: {
    checkQuoteTextLength (text) {
      if (text) {
        this.quoteTextLength = text.length
      }
    },
    onRowClass: function (item, index) {
      let classList = []
      if (item.hidden) {
        classList.push('is-hidden')
      }
      if (item.sent) {
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
      axios.post('/quotes/sort', {
        find: { shop: this.shop._id },
        sort: { created: 1 }
      }).then(res => {
        this.$store.dispatch('loaded', true)
        if (res.data.length) {
          this.data = []
          res.data.map(e => {
            e.date_group = moment(e.created).format('YYYY-MM')
            return e
          })
          let grouped = this.$root.groupBy(res.data, 'date_group')
          Object.keys(grouped).forEach(i => {
            let row = grouped[i]
            let total = row.reduce((acc, e) => acc + parseFloat(e.total), 0)
            this.data.push({
              date: i,
              formatted_date: moment(i).format('MMM YYYY').toUpperCase(),
              items: row.reverse(),
              total: total
            })
            this['statsKeys' + this.data.length - 1] = 0
          })
          this.showPartial(this.data.length - 1)
        }
      })
    },
    submit (quote) {
      this.sending = true
      axios.post(`/panel/quotes/reply/${quote._id}`, {
        text: quote.text,
        total: parseFloat(quote.total)
      }).then(res => {
        this.sending = false
        this.defaultOpenedDetails = []
        this.$buefy.toast.open({
          type: `is-${res.data.status}`,
          message: `${res.data.message}`
        })
      })
    }
  }
}
</script>
