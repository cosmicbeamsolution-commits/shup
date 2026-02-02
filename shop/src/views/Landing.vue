<template>
  <div>
    <modal-share
      :is-active="isShareActive"
      :data-item="dataItem"
      :data-type="'item'"
      @cancel="shareCancel"/>
    <modal-item
      :is-active="isItemActive"
      :data-item="dataItem"
      :data-index="dataIndex"
      :data-length="Object.keys(data).length"
      :data-order-length="Object.keys(order).length"
      @cancel="itemCancel"
      @prev="itemPrev"
      @next="itemNext"
      @checkout="checkout"
      @orderbox-modal="orderBoxModal"
      @update-count="updateItemCount"
      @remove-from-cart="removeFromCart" />
    <order-box
      :is-active="isOrderBoxActive"
      :data-order="order"
      :data-order-total="getOrderTotal()"
      @cancel="orderBoxCancel"
      @checkout="checkout"
      @update-cart="updateOrderFromCard"
      @remove-from-cart="removeFromCart" />
    <header-component
      :details="true"/>
    <div class="is-content animated fadeIn">
      <div v-if="shop.items.length" class="columns is-hpadded">
        <div class="column is-desktop-8">
          <div class="columns is-mobile">
            <div v-show="Object.keys(data).length > 1" class="column">
              <b-field grouped>
                <div v-show="shop.stock.length > 1" class="control">
                  <span class="select">
                    <select @input="filterGroup">
                      <option value="">Categorías</option>
                      <option v-for="(item, index) in shop.stock" :key="index" :value="item._id">{{ item.name }}</option>
                    </select>
                  </span>
                </div>
                <div class="control has-icons-right is-hidden-mobile" :class="{ 'is-loading': searching }">
                  <input class="input" @input="search" @change="search" ref="query" v-model="query" placeholder="Buscar..." autofocus>
                  <span class="icon is-right">
                    <svg-icon icon="magnify"/>
                  </span>
                </div>
                <div class="control has-theme-buttons">
                  <b-field grouped position="is-right">
                    <div class="control">
                      <button class="button" @click="vista = 'table'" :class="{ 'is-selected': vista === 'table' }">
                        <svg-icon icon="table"/>
                      </button>
                    </div>
                    <div class="control">
                      <button class="button" @click="vista = 'grid'" :class="{ 'is-selected': vista === 'grid' }">
                        <svg-icon icon="grid"/>
                      </button>
                    </div>
                  </b-field>
                </div>
              </b-field>
            </div>
            <div v-if="orderSize" id="orderTotal" class="column has-text-right is-hidden-touch animated">
              <button type="button" class="button is-clickable has-theme-color" :class="{ 'is-light': !minSelected, 'is-theme': minSelected }" @click="orderBoxModal()">
                <span class="is-item-button is-grouped">
                  <span class="icon">
                    <svg-icon icon="bag"/>
                    <span class="count has-text-color">{{ orderSize }}</span>
                  </span>
                </span>
                <span class="has-text-weight-bold has-text-color">${{ orderTotal | formatNumber }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-desktop">
        <div class="column is-9-desktop">
          <div class="columns is-grid is-multiline">
            <div v-for="(item, index) in data" :key="index" class="column" :class="{ 'is-3-fullhd is-4-widescreen is-6-tablet': vista === 'grid', 'id-3-fullhd is-4-widescreen is-6-tablet': vista === 'table', 'is-hidden': item.hidden }">
              <card-item
                :data-item="item"
                :data-count.sync="item.count"
                :data-vista="vista"
                :data-index="index"
                :data-length="data.length"
                :data-share-active="isShareActive"
                @data-item="updateItem"
                @share-modal="shareModal"
                @update-cart="updateOrderFromCard"/>
            </div>
          </div>
        </div>
        <div class="column">
          <shop-about/>
        </div>
      </div>
      <div v-show="orderSize" class="column is-clickable is-fixed-status has-text-centered is-hidden-desktop animated slideIn delay2" @click="orderBoxModal()">
        <span class="is-item-button is-grouped">
          <span class="icon">
            <svg-icon icon="bag"/>
            <span v-show="orderSize" class="count">{{ orderSize }}</span>
            <span v-show="!orderSize" class="count">+</span>
          </span>
        </span>
        <span class="has-text-weight-bold has-text-dark">${{ orderTotal | formatNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import appendLink from '@/components/appendLink'
import HeaderComponent from '@/components/HeaderComponent'
import ShopAbout from '@/components/ShopAbout'
import CardItem from '@/components/CardItem'
import OrderBox from '@/components/OrderBox'
import ModalItem from '@/components/ModalItem'
import ModalShare from '@/components/ModalShare'
import PlaySound from '@/components/PlaySound'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'landing',
  components: {
    HeaderComponent,
    ShopAbout,
    CardItem,
    OrderBox,
    ModalShare,
    ModalItem,
    SvgIcon
  },
  sockets: {
    event: function (data) {
      if (data.tag === 'theme') {
        if (data.value.themecolor) {
          document.documentElement.style.setProperty('--themecolor', data.value.themecolor)
          document.querySelector('meta[name="theme-color"]').setAttribute('content', data.value.themecolor)
          document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', data.value.themecolor)
        }
        if (data.value.textcolor) {
          document.documentElement.style.setProperty('--textcolor', data.value.textcolor)
        }
        if (data.value.themefont) {
          document.documentElement.style.setProperty('--themefontdistro', data.value.themefont.distro)
          appendLink('themefont', `https://cdn.geotiendas.com/css/${data.value.themefont.name}.css`)
        }
      }
    },
    connected: function (data) {
      console.log('total connected: ' + data)
    }
  },
  computed: {
    ...mapState([
      'shop'
    ]),
    minSelected () {
      const total = this.getOrderTotal()
      const min = this.shop ? this.shop.min_price || 0 : 0
      return total && total >= min
    },
    sortedOrder () {
      return this.order.slice().sort((a, b) => {
        return (b.name === a.name) ? 0 : b.name ? -1 : 1
      })
    }
  },
  data () {
    return {
      isOrderBoxActive: false,
      isShareActive: false,
      isItemActive: false,
      dataItem: {},
      dataIndex: 0,
      lastItemCount: 0,
      priceAnim: 'flash',
      data: {},
      vista: 'grid',
      searching: false,
      query: '',
      order: [],
      clock: 0,
      orderTotal: 0,
      orderSize: 0
    }
  },
  created () {
    const existingOrder = JSON.parse(localStorage.getItem('order'))
    if (this.shop.items) {
      this.data = this.shop.items
    }
    if (this.shop.about) {
      this.shop.about = this.shop.about.replace(/(<([^>]+)>)/gi, '')
    }
    if (existingOrder) {
      this.order = existingOrder
      this.updateItemsCount()
    }
    this.updateOrder()
  },
  mounted () {
    if (this.$refs.query) {
      this.$refs.query.focus()
    }
  },
  methods: {
    updateItem (data, index, length) {
      this.dataItem = data
      this.dataIndex = index
      this.dataLength = length
      this.isItemActive = true
    },
    updateItemsCount () {
      this.data.map(i => {
        i.count = 0
        return i
      })
      this.order.forEach(e => {
        this.data.map(i => {
          if (i._id === e._id) {
            i.count = e.count
          }
          return e
        })
      })
    },
    filterGroup ({ type, target }) {
      this.data = this.data.map(e => {
        e.hidden = target.value.length === 0 ? false : (e.pid !== target.value)
        return e
      })
    },
    search () {
      if (this.clock) {
        clearInterval(this.clock)
      }
      this.searching = true
      this.clock = setTimeout(() => {
        const query = this.$root.sanitize(this.query)
        if (query.length) {
          this.$store.dispatch('event', { tag: 'search', value: 'query' })
        }
        this.data = this.data.map(e => {
          let hidden = false
          if (this.query.trim().length) {
            hidden = !(this.$root.sanitize(e.name).indexOf(query) !== -1 ||
              this.$root.sanitize(e.text).indexOf(query) !== -1)
          }
          e.hidden = hidden
          return e
        })
        this.searching = false
      }, 1000)
    },
    checkout () {
      if (!this.minSelected && this.shop.min_price) {
        PlaySound('error.wav', 0.25)
        this.$buefy.toast.open({
          message: `La compra mínima es de ${this.shop.min_price} ARS`,
          queue: false,
          duration: 5000
        })
      } else {
        this.$store.dispatch('event', { tag: 'click', value: 'selected' })
        this.$router.push('/datos')
      }
    },
    removeFromCart (item) {
      this.order = this.order.filter(e => e._id !== item._id)
      this.updateOrder()
    },
    updateOrderFromCard (item) {
      if (item.quotable) {
        this.order = []
      } else {
        this.order = this.order.filter(e => e._id !== item._id).filter(e => e.sid !== item._id)
      }
      if (item.count) {
        this.order.push(item)
      }
      this.updateOrder()
      if (item.quotable) {
        this.$store.dispatch('event', { tag: 'click', value: 'selected' })
        this.$router.push('/datos')
      }
    },
    updateOrder () {
      /* needed for map to work */
      this.order = JSON.parse(JSON.stringify(this.order))
      const spanTotal = document.querySelector('.order-total')
      this.orderSize = this.getOrderItems()
      if (spanTotal) {
        spanTotal.classList.remove(this.priceAnim)
      }
      let orderTotal = this.getOrderTotal()
      setTimeout(() => {
        if (spanTotal && this.orderTotal !== orderTotal) {
          spanTotal.classList.add(this.priceAnim)
        }
        this.orderTotal = orderTotal
        this.updateItemsCount()
        this.$store.dispatch('order', this.order)
      }, 0)
    },
    getOrderTotal () {
      return this.order.reduce((acc, e) => acc + parseInt(e.count * e.price), 0)
    },
    getOrderItems () {
      return this.order.reduce((acc, e) => acc + e.count, 0)
    },
    shareModal () {
      this.isItemActive = false
      this.isShareActive = true
    },
    shareCancel () {
      this.isShareActive = false
    },
    orderBoxModal () {
      this.isItemActive = false
      this.isOrderBoxActive = true
    },
    orderBoxCancel () {
      this.isOrderBoxActive = false
    },

    /* item modal methods */

    updateItemCount (count) {
      if (count > this.lastItemCount) {
        PlaySound('click.mp3', 0.25)
        this.$store.dispatch('event', { tag: 'click', value: 'product_add' })
      } else {
        this.$store.dispatch('event', { tag: 'click', value: 'product_remove' })
        this.$store.dispatch('event', { tag: 'click', value: 'product_remove' })
      }
      this.lastItemCount = count
      this.dataItem.count = count
      this.updateOrderFromCard(this.dataItem)
    },
    itemPrev () {
      this.isItemActive = false
      setTimeout(() => {
        const el = document.getElementById(`click_mod_${this.dataIndex - 1}`)
        if (el) {
          el.click()
        }
      }, 100)
    },
    itemNext () {
      this.isItemActive = false
      setTimeout(() => {
        const el = document.getElementById(`click_mod_${this.dataIndex + 1}`)
        if (el) {
          el.click()
        }
      }, 100)
    },
    itemCancel () {
      // this.$store.dispatch('actionBarStateToggle', true)
      this.isItemActive = false
    }
  }
}
</script>
