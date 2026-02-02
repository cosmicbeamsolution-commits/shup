<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div v-if="Object.keys(dataItem).length" class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title">
          <div class="level">
            <div class="level-item level-left">
              <span class="tag is-primary is-large has-text-weight-bold">#{{ dataItem.id }}</span>
            </div>
            <div class="level-item">
              <span class="tag is-danger is-large has-text-weight-bold">{{ dataItem.delivery_code || '?'  }}</span>
            </div>
            <div class="level-item level-right">
              <span class="tag is-light is-large has-text-weight-bold has-text-grey is-uppercase">{{ dataItem.created | adjustShortTZ }}</span>
            </div>
          </div>
        </div>
      </header>
      <section class="modal-card-body">
        <notification v-show="dataItem.cancelled" class="is-info">
          <div>
            <span>Esta venta está cancelada</span>
          </div>
        </notification>
        <b-field label="Código de entrega" message="Establece la zona y propridad de entrega. Ej: C1, B2, ...">
          <b-input placeholder="C1" ref="delivery_code" v-model="dataItem.delivery_code" @keyup="onlyUpperCase" autofocus />
        </b-field>
        <div id="marker"></div>
      </section>
      <footer class="modal-card-foot is-flex-end">
        <button class="button " type="button" @click="cancel">Cerrar</button>
        <button v-show="!dataItem.cancelled" class="button is-success" type="button" @click="confirm">Actualizar</button>
        <button v-show="dataItem.cancelled" class="button is-info" type="button" @click="unconfirm">Restaurar venta</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import Notification from '@/components/Notification'
import mapboxgl from 'mapbox-gl'
export default {
  name: 'SaleDeliveryBox',
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
      isModalActive: false
    }
  },
  computed: {
    order () {
      return this.$root.groupBy(this.dataItem.order, 'name')
    }
  },
  methods: {
    onlyUpperCase () {
      this.dataItem.delivery_code = this.dataItem.delivery_code.toUpperCase()
    },
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('update', {
        item: this.dataItem,
        update: {
          delivery_code: this.dataItem.delivery_code
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
    isActive (newValue) {
      this.isModalActive = newValue
    },
    isModalActive (newValue) {
      if (!newValue) {
        this.cancel()
      } else {
        setTimeout(() => {
          this.$refs.delivery_code.focus()
        }, 100)
        setTimeout(() => {
          this.drawMap()
        }, 250)
      }
    }
  }
}
</script>

<style>
  #marker {
    width: 100%;
    height: 400px;
  }
</style>
