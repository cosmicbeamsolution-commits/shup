<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title title">Detalles de tu orden</p>
      </header>
      <section class="modal-card-body">
        <table class="table is-striped is-fullwidth">
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th></th>
          </tr>
          <tr>
            <td>
              <span>CAJA*YACABRÓN</span>
            </td>
            <td>
              <span class="has-text-dark">${{ shop.min_price }}</span>
            </td>
          </tr>
          <tr v-for="(item, index) in dataItem" :key="index">
            <td>
              <span :class="{ 'has-text-light': !item.active }">{{ item.name }}</span>
            </td>
            <td>
              <span v-if="!item.active && !item.promo" class="has-text-light">CAJA*YACABRON</span>
              <span v-if="item.promo" class="has-text-light">PROMO*YACABRON</span>
              <span v-if="item.active && !item.promo" class="has-text-dark">${{ item.price }}</span>
            </td>
            <td class="is-actions-cell">
              <!--span v-if="item.active" @click="remove(index)">
                <b-icon icon="trash-can" type="is-danger" size="is-small"/>
              </span-->
            </td>
          </tr>
          <tr>
            <td>
              <span>Envío</span>
            </td>
            <td>
              <span class="has-text-dark">${{ shop.delivery_cost }}</span>
            </td>
          </tr>
        </table>
      </section>
      <footer class="modal-card-foot is-flex-end">
        <button class="button is-info is-outlined" type="button" @click="cancel">Seguir con la compra</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrderBox',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Array,
      default: () => []
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
    ...mapState([
      'shop'
    ])
  },
  methods: {
    remove (index) {
      this.$emit('remove-from-cart', index)
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  watch: {
    isActive (newValue) {
      this.isModalActive = newValue
    },
    isModalActive (newValue) {
      if (!newValue) {
        this.cancel()
      }
    }
  }
}
</script>
