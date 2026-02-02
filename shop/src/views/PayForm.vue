<template>
  <div>
    <order-box
      :is-active="isOrderBoxActive"
      :data-order="order"
      :data-order-total="getOrderTotal()"
      @checkout="checkout"
      @cancel="orderBoxCancel"
      @update-cart="updateOrderFromCard"
      @remove-from-cart="removeFromCart" />
    <pay-selection-box
      :is-active="isPayModalActive"
      @cancel="payBoxCancel"
      @pay-select="payBoxSelect" />
    <header-component/>
    <div class="is-bottom-extra-extra-padded is-payform animated fadeIn">
      <card-component class="is-white">
        <div class="columns is-multiline">
          <div class="column is-12 content">
            <h5 v-show="orderSum">Confirmá tu compra en {{ shop.shop }}</h5>
            <h5 v-show="!orderSum">Solicitá cotización de {{ order[0].name }} en {{ shop.shop }}</h5>
            <p class="is-size-7">Solo te solicitamos los datos básicos necesarios para realizar el envío, una vez rellenados no será necesario volver a introducirlos en tu dispositivo.</p>
          </div>
          <div class="column">
            <form class="form is-margin-top" @submit.prevent="submit">
              <b-field>
                <b-input v-model="customer.fullname" ref="autofocus" placeholder="Nombre completo" required />
              </b-field>
              <b-field>
                <b-input v-model="customer.email" type="email" placeholder="Email" required />
              </b-field>
              <b-field>
                <input class="input" v-model="customer.phone" type="text" @keyup="onlyNumeric" placeholder="Teléfono" required />
              </b-field>
              <b-field>
                <input type="text"
                  v-model="customer.address"
                  id="address"
                  class="input"
                  placeholder="Dirección"
                  required/>
              </b-field>
              <b-field>
                <input class="input" v-model="customer.address_extra" type="text" placeholder="Piso ó depto." />
              </b-field>
              <b-field>
                <textarea class="textarea is-rows-condensed" v-model="customer.comments" placeholder="Agregá alguna indicación si lo ves necesario" />
              </b-field>
              <div class="is-hidden">
                <input type="submit" id="submitbutton"/>
              </div>
            </form>
            <p v-if="shop.text_customer_data_important" class="has-text-info has-text-weight-bold">{{ shop.text_customer_data_important }}</p>
            <hr>
            <div v-show="orderSum" class="level is-mobile">
              <div class="level-item is-narrow level-left">
                <span class="is-invoice-text">Subtotal</span>
              </div>
              <div class="level-item is-bottom-dotted"></div>
              <div class="level-item is-narrow level-right">
                <span class="has-text-weight-bold">${{ orderSum | formatNumber }}</span>
              </div>
            </div>
            <div v-show="orderSum" class="level is-mobile">
              <div class="level-item is-narrow level-left">
                <span class="is-invoice-text">Envío</span>
              </div>
              <div class="level-item is-bottom-dotted"></div>
              <div class="level-item is-narrow level-right">
                <span v-show="customer.shipping.cost" class="has-text-weight-bold"> ${{ customer.shipping.cost | formatNumber }}</span>
                <span v-show="!customer.shipping.cost" class="has-text-weight-bold has-text-success">Sin cargo</span>
              </div>
            </div>
            <p class="has-text-success is-size-7 is-vpadded"><span v-show="shop.payment_methods.includes('takeaway') && shop.type !== 'services' && shop.scope !== 'country'">Se cobrará un adicional de ${{ customer.shipping.cost | formatNumber }} en caso de que prefieras que te lo envíen. </span>El costo de envío se calcula en base a la distancia computada entre comprador y vendedor ({{ customer.shipping.distance}}km).</p>
            <hr>
            <div v-show="orderSum" class="level is-mobile">
              <div class="level-item is-narrow level-left">
                <span class="is-invoice-text has-text-weight-bold">Total</span>
              </div>
              <div class="level-item is-bottom-dotted"></div>
              <div class="level-item is-narrow level-right">
                <span class="is-size-5 has-text-weight-bold">${{ orderSum + customer.shipping.cost | formatNumber }}</span>
              </div>
            </div>
          </div>
          <div class="column">
            <div id="map" class="is-box-rounded" />
          </div>
        </div>
      </card-component>
      <div class="is-hidden-mobile">
        <div class="buttons is-flex-center">
          <b-button type="is-small is-grey is-link" icon-left="backspace" @click="goBack()">
            <span class="is-size-6 is-line-height1">Volver a la tienda</span>
          </b-button>
          <b-button v-show="orderSum" type="is-small is-info is-link" icon-left="checkbox-multiple-marked-outline" @click="orderBoxModal()">
            <span class="is-size-6 is-line-height1">Revisar la orden</span>
          </b-button>
          <b-button v-show="orderSum" type="is-small is-link is-success" icon-left="shopping" @click="paySelectionModal()">
            <span class="is-size-6 is-line-height1">Finalizar compra</span>
          </b-button>
          <b-button v-show="!orderSum" type="is-small is-link is-success" icon-left="shopping" @click="askForQuote()">
            <span class="is-size-6 is-line-height1">Solicitar cotización</span>
          </b-button>
        </div>
      </div>
      <div class="is-hidden-tablet">
        <nav class="level is-mobile is-centered">
          <div class="level-item">
            <button v-show="orderSum" class="button is-small is-grey is-link" icon-left="" @click="goBack()">
              <b-icon icon="backspace"/>
            </button>
          </div>
          <div class="level-item">
            <button v-show="orderSum" class="button is-small is-info is-link" icon-left="" @click="orderBoxModal()">
              <b-icon icon="checkbox-multiple-marked-outline"/>
            </button>
          </div>
          <div class="level-item">
            <button v-show="orderSum" class="button is-small is-success is-link" icon-left="" @click="paySelectionModal()">
              <b-icon icon="shopping"/>
            </button>
          </div>
          <div v-show="!orderSum" class="level-item">
            <button class="button is-small is-success is-link" icon-left="" @click="askForQuote()">
              <b-icon icon="shopping"/>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import HeaderComponent from '../components/HeaderComponent'
import CardComponent from '@/components/CardComponent'
import OrderBox from '@/components/OrderBox'
import PaySelectionBox from '@/components/PaySelectionBox'
import PlaySound from '@/components/PlaySound'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'pay_form',
  components: {
    CardComponent,
    HeaderComponent,
    PaySelectionBox,
    OrderBox
  },
  data () {
    return {
      data: {},
      order: [],
      customer: {
        shipping: {
          cost: 0
        },
        geo: {}
      },
      map: null,
      marker: null,
      center: [0, 0],
      calcShipping: false,
      isQuote: false,
      isOrderBoxActive: false,
      isPayModalActive: false,
      payMode: 'simulate',
      orderTotal: 0,
      orderSum: 0,
      orderSize: 0,
      defaultBounds: false
    }
  },
  created () {
    const existingOrder = JSON.parse(localStorage.getItem('order'))
    const existingCustomer = JSON.parse(localStorage.getItem('customer'))
    if (this.shop.items) {
      this.data = this.shop.items
    }
    if (existingCustomer) {
      this.customer = existingCustomer
    } else {
      if (this.shop.type === 'products' && this.shop.cost_delivery_base) {
        this.customer.shipping.cost = this.shop.cost_delivery_base
      }
    }
    if (existingOrder) {
      this.order = existingOrder
    }
    this.orderSum = this.getOrderSum()
    if (!this.orderSum && this.shop.min_price) {
      this.$router.push('/')
    } else {
      this.updateOrder()
      this.$store.dispatch('footerBarStateToggle', false)
    }
  },
  mounted () {
    if (this.$refs.autofocus) {
      this.$refs.autofocus.focus()
    }
    this.initAutocomplete('address')
    if (this.shop.type === 'products') {
      this.calculateShipping()
    }
    if (this.customer.geo.lat && this.customer.geo.lng) {
      this.center = [this.customer.geo.lng, this.customer.geo.lat]
      this.initMap()
    } else {
      this.askLocation().then(center => {
        this.center = center
        this.initMap()
      })
    }
  },
  computed: {
    minSelected () {
      const total = this.getOrderTotal()
      const min = this.shop ? this.shop.min_price || 0 : 0
      return total && total >= min
    },
    ...mapState([
      'shop'
    ])
  },
  methods: {
    askLocation () {
      return new Promise((resolve, reject) => {
        let center = [0, 0]
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            center = [
              pos.coords.longitude,
              pos.coords.latitude
            ]
            resolve(center)
          })
        } else {
          resolve(center)
        }
      })
    },
    initMap (center) {
      mapboxgl.accessToken = this.$root.mp.accessToken
      this.map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: this.center, // starting position [lng, lat]
        zoom: 15 // starting zoom
      })
      this.updateMapCoordinates()
    },
    updateMapCoordinates () {
      if (this.marker) {
        this.marker.remove()
      }
      this.marker = new mapboxgl.Marker()
        .setLngLat(this.center)
        .addTo(this.map)
      this.map.flyTo({
        center: this.center
      })
    },
    getOrderTotal () {
      return this.order.reduce((acc, e) => acc + parseInt(e.count * e.price), 0)
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
    },
    goBack () {
      this.$router.push('/')
    },
    orderBoxModal () {
      this.isOrderBoxActive = true
    },
    orderBoxCancel () {
      this.isOrderBoxActive = false
    },
    paySelectionModal () {
      this.isPayModalActive = true
    },
    payBoxSelect (mode) {
      this.isPayModalActive = false
      this.onReady(mode)
    },
    payBoxCancel () {
      this.isPayModalActive = false
    },
    askForQuote () {
      this.isQuote = true
      this.onReady(false)
    },
    onReady (mode) {
      if (mode) {
        this.payMode = mode
        this.$store.dispatch('event', { tag: 'click', value: `payment_${mode}` })
      }
      document.getElementById('submitbutton').click()
    },
    getOrderSum () {
      return this.order.filter(e => e.active).reduce((acc, e) => acc + parseInt(e.count * e.price), 0)
    },
    getOrderItems () {
      return this.order.reduce((acc, e) => acc + e.count, 0)
    },
    onlyNumeric () {
      if (this.customer.phone) {
        this.customer.phone = this.customer.phone.replace(/[^0-9]/g, '').replace(/^0+/, '')
      }
    },
    updateCustomer () {
      localStorage.setItem('customer', JSON.stringify(this.customer))
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
    updateOrder () {
      /* needed for map to work */
      this.order = JSON.parse(JSON.stringify(this.order))
      const spanTotal = document.querySelector('.order-total')
      this.orderSize = this.getOrderItems()
      if (spanTotal) {
        spanTotal.classList.remove(this.priceAnim)
      }
      let orderTotal = this.getOrderTotal()
      let orderSum = this.getOrderSum()
      setTimeout(() => {
        if (spanTotal && this.orderTotal !== orderTotal) {
          spanTotal.classList.add(this.priceAnim)
        }
        this.orderTotal = orderTotal
        this.orderSum = orderSum
        this.updateItemsCount()
        this.$store.dispatch('order', this.order)
      }, 0)
    },
    initAutocomplete (id) {
      let t = this
      let acObject = {
        types: ['geocode'],
        componentRestrictions: {
          country: (this.shop.country_iso || 'ar')
        }
      }

      if (this.shop.scope === 'custom' && this.shop.delivery_bounds) {
        let bounds = this.defaultBounds
        let shopBounds = this.shop.delivery_bounds
        var latLngBounds = false
        if (shopBounds && Object.keys(shopBounds).length && shopBounds.features.length) {
          bounds = this.shop.delivery_bounds.features[0].geometry.coordinates[0]
        }

        if (shopBounds) {
          latLngBounds = new window.google.maps.LatLngBounds()
          bounds.forEach((e, i) => {
            latLngBounds.extend(new window.google.maps.LatLng(e[1], e[0]))
          })
        }

        if (latLngBounds) {
          acObject.bounds = latLngBounds
          acObject.strictBounds = true
        }
      }

      var autocomplete = new window.google.maps.places.Autocomplete(document.getElementById(id), acObject)
      window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
        var place = autocomplete.getPlace()
        // let ac = place.address_components
        // let city = ac[0]['short_name']
        t.customer.address = place.formatted_address
        t.customer.geo = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        t.center = [t.customer.geo.lng, t.customer.geo.lat]
        if (t.shop.type === 'products') {
          t.calculateShipping()
        }
        t.updateMapCoordinates()
      })
    },
    calculateShipping () {
      if (this.shop.scope === 'country' && Object.keys(this.customer.geo).length) {
        this.calcShipping = true
        axios.post(`/shops/sales/calc_shipping/${this.shop._id}`, { destination: this.customer.geo }).then(res => {
          this.calcShipping = false
          if (res.data.status === 'success') {
            if (res.data.cost) {
              this.$set(this.customer.shipping, 'cost', parseInt(res.data.cost))
              this.$set(this.customer.shipping, 'distance', parseInt(res.data.distanceKm))
              this.updateCustomer()
            }
          } else {
            this.$buefy.toast.open({
              message: res.data.message,
              type: 'is-danger',
              duration: 10000
            })
          }
        })
      }
    },
    checkout () {
      if (!this.minSelected && this.shop.min_price) {
        PlaySound('error.wav', 0.25)
        this.$buefy.toast.open({
          message: `La compra mímima es de ${this.shop.min_price} ARS`,
          queue: false,
          duration: 5000
        })
      } else {
        this.isOrderBoxActive = false
        this.isPayModalActive = false
        this.paySelectionModal()
      }
    },
    submit () {
      if (!Object.keys(this.customer.geo).length) {
        /* user didnt select address properly using google places */
        this.$buefy.toast.open({
          message: `Falta tu ubicación, por favor elegí una opción de la lista en el campo <b>Dirección</b>...`,
          queue: true,
          duration: 10000
        })
        return document.getElementById('address').focus()
      }

      let message = `Generando orden de compra, por favor espere...`
      let url = `/shops/payments/${this.shop._id}`

      if (this.isQuote) {
        message = `Generando solicitud de cotización, por favor espere...`
        url = `/shops/quotes/create/${this.shop._id}`
      }

      this.$buefy.toast.open({
        message: message,
        queue: false,
        duration: 3000
      })
      this.customer.email = this.customer.email.trim()
      /* save customer data for future orders */
      localStorage.setItem('customer', JSON.stringify(this.customer))
      /* register payment */
      axios.post(url, {
        paymode: this.payMode,
        total: this.orderSum,
        count: this.orderSize,
        customer: this.customer,
        order: this.order
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
              this.shop.items.map(e => {
                e.count = 0
                return e
              })
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
