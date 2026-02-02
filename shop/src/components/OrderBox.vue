<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title title">Tu compra en {{ shop.shop }}</p>
      </header>
      <section class="modal-card-body is-vexpanded">
        <div v-for="(item, index) in sortedOrder" :key="index">
          <div class="columns is-vcentered is-centered is-marginless">
            <div class="column is-narrow is-paddingless-bottom">
              <figure class="image is-128x128 is-height-auto">
                <img :src="item.photo">
              </figure>
            </div>
            <div class="column">
              <span class="has-text-dark has-text-weight-bold">{{ item.name }}</span>
              <p class="has-text-dark is-size-7">{{ item.text | wordsplice }}</p>
              <span class="has-text-success has-text-weight-bold" :class="{ 'is-invisible': item.count <= 1 }">${{ item.price }}</span>
            </div>
            <div class="column">
              <b-field position="">
                <b-numberinput
                  v-model="item.count"
                  min="0"
                  max="99"
                  type="is-info"
                  size="is-small"
                  @input="updateCount(item)"
                  @change="updateCount(item)"
                  controls-position="compact"
                  controls-rounded></b-numberinput>
              </b-field>
            </div>
            <div class="column is-2">
              <div class="has-text-centered is-inline-block is-subtotal">
                <span class="has-text-black is-size-6 has-text-weight-bold">${{ parseInt(item.count * item.price) }}</span>
                <div @click.prevent="remove(item)" class="icon is-size-4 has-text-light is-clickable">
                  <span class="mdi mdi-trash-can" icon="trash-can"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="!sortedOrder.length">
          <span class="has-text-black">Parece que no hay nada por aquí. Agrega ítems a tu carrito para continuar.</span>
        </div>
      </section>
      <footer class="modal-card-foot is-flex-end">
        <!--button class="button is-grey" type="button" @click="cancel">Volver a la tienda</button-->
        <b-button type="is-small is-link" class="is-size-6" icon-left="backspace" @click="cancel">
          <span class="is-size-6 is-line-height1">Volver a la tienda</span>
        </b-button>
        <b-button v-show="dataOrderTotal" type="is-size-6 is-small is-link is-success" icon-left="shopping" @click="checkout">Comprar</b-button>
        <b-button v-show="!dataOrderTotal && sortedOrder.length" type="is-size-6 is-small is-link is-success" icon-left="shopping" @click="checkout">Cotizar</b-button>
        <div v-show="dataOrderTotal" class="button has-background-white is-small is-link">
          <!--span class="is-size-5 has-text-success">Total </span-->
          <span class="is-size-6 has-text-success has-text-dark has-text-weight-bold"> ${{ dataOrderTotal }}</span>
        </div>
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
    dataOrder: {
      type: Array,
      default: () => []
    },
    dataOrderTotal: {
      type: Number,
      default: () => 0
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
    sortedOrder () {
      return this.dataOrder.slice().sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
    },
    ...mapState([
      'shop'
    ])
  },
  methods: {
    remove (item) {
      this.$emit('remove-from-cart', item)
    },
    cancel () {
      this.$emit('cancel')
    },
    checkout () {
      this.$emit('checkout')
    },
    updateCount (item) {
      this.$emit('update-cart', item)
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
