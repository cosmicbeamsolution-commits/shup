<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="clipboard-text-multiple-outline" size="is-large"/>
      Compras
      <div class="buttons" slot="right">
        <a class="button" @click="getData">
          <span>Actualizar</span>
        </a>
        <a class="button" @click="print">
          <span>Imprimir</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div v-for="(item, index) in data" :key="index" class="column is-clickable" @click="showPartial(index)">
          <card-widget class="tile is-child is-clickable" :class="{ 'is-active': activeIndex === index }" type="is-light" icon="clipboard-text-multiple-outline" :number="item.products_count" :label="item.formatted_date"/>
        </div>
      </div>
      <card-component v-if="Object.keys(partial).length">
        <div class="field">
          <input class="input" @keyup="search" v-model="query" placeholder="Buscar...">
          <input type="submit" class="is-hidden"/>
        </div>
        <table class="table is-striped is-fullwidth">
          <tr v-for="(item, index) in partial.products_sorted" :key="index" class="sales-item" :class="{ 'is-hidden': item.hidden }">
            <td><span class="has-text-weight-bold" :style="{ color: item[0].color }">{{ index }}</span></td>
            <td><strong>{{item.length}}</strong></td>
          </tr>
        </table>
      </card-component>
      <notification v-else class="is-info">
        <p>No se registran compras para este periodo</p>
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
import CardWidget from '@/components/CardWidget'
import Notification from '@/components/Notification'
export default {
  name: 'Kitchen',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    TitleBar,
    CardWidget,
    CardComponent,
    Notification
  },
  data () {
    return {
      isModalActive: false,
      activeIndex: 0,
      query: '',
      data: [],
      partial: []
    }
  },
  created () {
    this.getData()
  },
  computed: {
    titleStack () {
      return [
        'Admin',
        'Compras'
      ]
    }
  },
  methods: {
    showPartial (index) {
      this.activeIndex = index
      this.partial = this.data[index]
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
      Object.keys(this.partial.products_sorted).forEach(e => {
        let hidden = false
        if (this.query.trim().length) {
          hidden = sanitize(e).indexOf(query) === -1
        }
        this.$set(this.partial.products_sorted[e], 'hidden', hidden)
      })
    },
    print () {
      window.print()
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/sales/sort', {
        find: {},
        sort: { created: 1 }
      }).then(res => {
        if (res.data.length) {
          this.data = []
          let grouped = this.$root.groupBy(res.data, 'delivery_date')
          Object.keys(grouped).forEach(i => {
            let row = grouped[i]
            this.data.push({
              date: i,
              formatted_date: moment(i).format('DMMM YYYY').toUpperCase(),
              products_sorted: this.$root.groupBy(row.flatMap(e => [...e.order]), 'name'),
              products_count: row.reduce((acc, e) => acc + e.order.length, 0),
              total_complete: row.filter(e => e.payment_complete).reduce((acc, e) => acc + e.total, 0),
              total_uncomplete: row.filter(e => !e.payment_complete).reduce((acc, e) => acc + e.total, 0)
            })
          })
          this.showPartial(this.data.length - 1)
        }
        this.$store.dispatch('loaded', true)
      })
    },
    togglePaymentComplete (item) {
      this.updateItem(item, { payment_complete: item.payment_complete }).then(res => {
        this.$buefy.toast.open({
          message: `Estado de pago actualizado`
        })
      })
      // window.open('/sales/print/' + item._id, item._id, `height=${window.screen.availHeight},width=800`)
    },
    updateItem (item, payload) {
      console.log(item.payment_complete)
      console.log(payload)
      return new Promise((resolve, reject) => {
        axios.post(`/sales/${item._id}`, payload).then(res => {
          resolve(item)
        })
      })
    },
    setItem (item, data) {
      const index = this.data.findIndex(e => e._id === item._id)
      Object.keys(data).map(i => {
        item[i] = data[i]
      })
      this.$set(this.data, index, item)
    },
    showItem (item) {
      this.item = item
      this.isModalActive = true
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
