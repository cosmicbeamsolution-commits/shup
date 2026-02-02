<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div v-if="Object.keys(dataItem).length" class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title">
          <div class="level">
            <div class="level-item level-left">
              <span class="tag is-primary  is-large has-text-weight-bold">#{{ dataItem.id }}</span>
            </div>
            <!--div class="level-item">
              <span class="tag is-danger is-large has-text-weight-bold">{{ dataItem.delivery_code || '?' }}</span>
            </div-->
            <div class="level-item level-right">
              <span class="tag is-light is-large  has-text-weight-bold has-text-grey is-uppercase">{{ dataItem.created | adjustShortTZ }}</span>
            </div>
          </div>
        </div>
      </header>
      <section class="modal-card-body has-fixed-height">
        <notification v-show="dataItem.cancelled" class="is-info">
          <div>
            <span>Esta venta está cancelada</span>
          </div>
        </notification>
        <div class="tabs is-centered is-boxed">
          <ul>
            <li :class="{ 'is-active': tab === 'order' }">
              <a @click="tab = 'order'">
                <b-icon icon="cash-usd" size="is-large"/>
                <!--span>Orden</span-->
              </a>
            </li>
            <li :class="{ 'is-active': tab === 'customer' }">
              <a @click="tab = 'customer'">
                <b-icon icon="account" size="is-large"/>
                <!--span>Cliente</span-->
              </a>
            </li>
            <li :class="{ 'is-active': tab === 'map' }">
              <a @click="tab = 'map'">
                <b-icon icon="map-marker-multiple-outline" size="is-large"/>
                <!--span>Mapa</span-->
              </a>
            </li>
          </ul>
        </div>
        <div v-show="tab === 'order'" class="content">
          <table class="table is-striped is-fullwidth">
            <tr v-for="(item, index) in orderItems" :key="index">
              <td>
                <span class="has-text-weight-bold" :style="{ color: item[0].color }">{{ index }}</span>
              </td>
              <td class="has-text-right">
                <span class="has-text-weight-bold">{{ item.length }}</span>
              </td>
            </tr>
            <tr class="has-top-border">
              <td colspan="2">
                <b-icon v-if="dataItem.pay_with_cash" icon="cash" type="is-success"/>
                <b-icon v-else icon="credit-card" type="is-info"/>
                <span v-if="dataItem.pay_with_cash" class="has-text-success"> Envío a domicilio</span>
                <span v-else class="has-text-info"> Online</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <b-icon icon="truck-check-outline" type="is-grey"/>
                <span> ${{ dataItem.delivery_cost }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <b-icon icon="coin" type="is-grey"/>
                <span> ${{ dataItem.total }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <b-icon icon="eye" type="is-grey"/>
                <span> Visto por cliente {{ dataItem.public_record_seen }} veces</span>
              </td>
            </tr>
          </table>
        </div>
        <div v-show="tab === 'customer'">
          <table class="table is-striped is-fullwidth">
            <tr>
              <td width="1%">
                <b-icon icon="account" type="is-grey"/>
              </td>
              <td>
                <p>{{ dataItem.customer.fullname }}</p>
              </td>
            </tr>
            <tr>
              <td width="1%">
                <b-icon icon="email-edit-outline" type="is-grey"/>
              </td>
              <td>
                <p>{{ dataItem.customer.email }}</p>
              </td>
            </tr>
            <tr>
              <td width="1%">
                <b-icon icon="phone" type="is-grey"/>
              </td>
              <td>
                <p>{{ dataItem.customer.phone }}</p>
              </td>
            </tr>
            <tr>
              <td width="1%">
                <b-icon icon="map-marker" type="is-grey"/>
              </td>
              <td>
                <p>{{ dataItem.customer.address }}</p>
              </td>
            </tr>
            <tr>
              <td width="1%">
                <b-icon icon="comment-check-outline" type="is-grey"/>
              </td>
              <td>
                <p>{{ dataItem.customer.comments }}</p>
              </td>
            </tr>
          </table>
        </div>
        <div v-show="tab === 'map'">
          <div id="marker"></div>
        </div>
      </section>
      <footer class="modal-card-foot is-flex-end">
        <!--button class="button is-success" type="button" @click="print">Comandar</button-->
        <button v-show="!dataItem.cancelled" class="button is-danger " type="button" @click="confirm">Cancelar venta</button>
        <button v-show="dataItem.cancelled" class="button is-info " type="button" @click="unconfirm">Restaurar venta</button>
        <button class="button " type="button" @click="cancel">Cerrar</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import Notification from '@/components/Notification'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'SaleBox',
  components: {
    Notification
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: () => {}
    },
    trashObjectName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      tab: 'order',
      isModalActive: false,
      mapLoaded: false
    }
  },
  computed: {
    orderItems () {
      return this.$root.groupBy(this.dataItem.order, 'name')
    }
  },
  methods: {
    print () {
      window.open('/sales/print/' + this.dataItem._id, this.dataItem._id, `height=${window.screen.availHeight},width=800`)
    },
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('update', {
        item: this.dataItem,
        update: {
          cancelled: true,
          payment_complete: false
        }
      })
    },
    unconfirm () {
      this.$emit('update', {
        item: this.dataItem,
        update: {
          cancelled: false
        }
      })
    },
    drawMap () {
      mapboxgl.accessToken = this.$root.accessToken
      let coordinates = [this.dataItem.customer.geo.lng, this.dataItem.customer.geo.lat]
      var map = new mapboxgl.Map({
        container: 'marker',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        // interactive: false,
        zoom: 14
      })
      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
      this.mapLoaded = true
    }
  },
  watch: {
    tab (newValue) {
      if (newValue === 'map' && !this.mapLoaded) {
        setTimeout(() => {
          this.drawMap()
        }, 250)
      }
    },
    isActive (newValue) {
      this.isModalActive = newValue
    },
    isModalActive (newValue) {
      if (!newValue) {
        this.mapLoaded = false
        this.cancel()
      } else {
        if (this.tab === 'map' && !this.mapLoaded) {
          setTimeout(() => {
            this.drawMap()
          }, 250)
        }
      }
    }
  }
}
</script>

<style>
  .modal-card-body.has-fixed-height {
    min-height: 400px;
  }
  #marker {
    width: 100%;
    height: 300px;
  }
</style>
