<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head is-hidden-mobile has-text-centered">
        <!--p class="modal-card-title title">{{ dataItem.name }}</p-->
      </header>
      <section class="modal-card-body">
        <div class="columns is-vcentered is-center">
          <div class="column">
            <div class="card-item">
              <div class="card-prev is-expandable animated fadeIn delay">
                <a id="btnPrev" v-show="dataIndex" @click="prev" class="button is-large is-disc is-white">
                  <b-icon size="is-large" icon="chevron-left"/>
                </a>
              </div>
              <div class="card-next is-expandable animated fadeIn delay">
                <a id="btnNext" v-show="dataIndex < dataLength - 1" @click="next" class="button is-large is-disc is-white">
                  <b-icon size="is-large" icon="chevron-right"/>
                </a>
              </div>
              <div class="card-content">
                <div class="content has-text-centered">
                  <div class="columns is-vcentered is-centered">
                    <div class="column">
                      <div class="card-background-image is-portrait" :style="`background-image: url('${dataItem.photo}')`"/>
                    </div>
                    <div class="column">
                      <div class="columns is-vcentered is-spaced">
                        <div class="column has-text-left">
                          <div class="is-card-text is-vpadded has-text-dark">
                            <h3 class="is-marginless">{{ dataItem.name }}</h3>
                            <p class="is-size-7">{{ dataItem.text | wordsplice }}</p>
                            <span class="has-text-success is-hidden-mobile has-text-weight-bold is-size-5 min-height-1">
                              <span v-show="count !== 1">${{ dataItem.price }}
                              </span>
                            </span>
                          </div>
                          <b-field position="is-center product">
                            <b-numberinput
                              v-model="count"
                              min="0"
                              max="99"
                              type="is-info"
                              @input="updateCount"
                              @change="updateCount"
                              controls-position="compact"
                              controls-rounded></b-numberinput>
                          </b-field>
                        </div>
                        <div class="column is-3">
                          <div class="has-text-centered is-inline-block is-subtotal">
                            <div>
                              <span v-show="count" class="has-text-black is-size-5 has-text-weight-bold">${{ parseInt(count * dataItem.price) }}</span>
                            </div>
                            <div class="icon is-size-4 has-text-light is-clickable">
                              <span v-show="count" class="mdi mdi-trash-can" @click="remove(dataItem)" icon="trash-can"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-flex-end">
        <div class="is-hidden-mobile">
          <a @click="cancel" class="button is-small is-link is-light">
            <span class="is-size-6">Volver a la tienda</span>
          </a>
          <a v-if="dataOrderLength > 1" @click="orderBoxModal" class="button is-small is-link is-info">
            <span class="is-size-6">Revisar orden</span>
          </a>
          <button v-if="dataOrderLength" class="button is-size-6 is-small is-link is-success" type="button" @click="checkout">Comprar</button>
        </div>
        <div class="is-hidden-tablet container">
          <nav class="level is-mobile">
            <div class="level-item">
              <a @click="cancel" class="button is-light">
                <b-icon icon="close-box-multiple"/>
              </a>
            </div>
            <div class="level-item">
              <a v-if="dataOrderLength > 1" @click="orderBoxModal" class="button  is-info">
                <b-icon icon="clipboard-list-outline"/>
              </a>
            </div>
            <div class="level-item">
              <button v-if="dataOrderLength" class="button is-success" type="button" @click="checkout">
                <svg-icon class="has-stroke-white" icon="bag"/>
              </button>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'ModalItem',
  components: {
    SvgIcon
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
    dataIndex: {
      type: Number,
      default: () => 0
    },
    dataLength: {
      type: Number,
      default: () => 0
    },
    dataType: {
      type: String,
      default: 'shop'
    },
    dataOrderLength: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      count: 0,
      shareURL: null,
      localURL: null,
      isModalActive: false
    }
  },
  created () {
    document.onkeydown = e => {
      e = e || window.event
      if (e.keyCode === 38) {
        // up arrow
      } else if (e.keyCode === 40) {
        // down arrow
      } else if (e.keyCode === 37) {
        document.getElementById('btnPrev').click()
        // left arrow
      } else if (e.keyCode === 39) {
        document.getElementById('btnNext').click()
        // right arrow
      }
    }
    /* this.shareURL = `${this.$store.state.shareapi}/stock/${this.dataItem.pid}`
    this.localURL = location.origin */
  },
  methods: {
    remove (item) {
      this.count = 0
      this.updateCount()
      this.$emit('remove-from-cart', item)
    },
    cancel () {
      this.$emit('cancel')
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    },
    checkout () {
      this.$emit('checkout')
    },
    updateCount () {
      this.$emit('update-count', this.count <= 99 ? this.count : 99)
    },
    orderBoxModal () {
      this.$emit('orderbox-modal')
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
        this.count = this.dataItem.count
        if (!this.count) {
          this.count = 1
          this.updateCount()
        }
      }
    }
  }
}
</script>
