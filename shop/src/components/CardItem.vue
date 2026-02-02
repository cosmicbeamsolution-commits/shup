<template>
  <div>
    <div class="card is-item">
      <div
        :id="`click_mod_${dataIndex}`"
        @click.prevent="itemClick"
        class="card-content hoverable is-clickable">
        <div v-show="dataVista === 'grid'">
          <div class="card-background-image" :style="`background-image: url('${dataItem.photo}')`" :class="shop.item_layout">
            <span class="column tag is-large is-capitalized">{{ dataItem.pname.substring(0, 2) }}</span>
          </div>
          <div class="columns is-mobile is-marginless">
            <div class="column content">
              <h4 class="is-font-black is-marginless has-text-weight-light">
                <span class="is-size-6">{{ dataItem.name }} </span>
                <a @click.prevent="shareModal" :title="`Compartí ${dataItem.name} en tus redes sociales`">
                  <span class="mdi mdi-share-variant is-size-5 has-text-success"/>
                </a>
              </h4>
              <!--span class="has-text-grey">{{ dataItem.text }}</span-->
            </div>
          </div>
          <div class="columns is-vcentered is-mobile">
            <div class="column has-text-right">
              <span v-show="dataItem.price" class="has-text-weight-bold has-text-color has-text-weight-bold">${{ dataItem.price }}</span>
            </div>
            <div class="column is-narrow">
              <a v-show="!dataItem.quotable">
                <div class="card-button" :class="{ 'has-item': dataCount }">
                  <span class="icon is-card-icon">
                    <svg-icon class="has-theme-color" v-show="!dataCount" icon="bag"/>
                    <h4 class="has-theme-color" v-show="dataCount">{{ dataCount }}</h4>
                  </span>
                </div>
              </a>
              <a v-show="dataItem.quotable">
                <b-icon icon="comment-outline" class="has-text-color"/>
              </a>
            </div>
          </div>
        </div>
        <div v-show="dataVista === 'table'" class="is-card-table">
          <div class="columns is-mobile">
            <div class="column is-narrow is-paddingless-right">
              <div class="card-background-image" :style="`background-image: url('${dataItem.photo}')`">
                <span class="column tag is-large is-capitalized">{{ dataItem.pname.substring(0, 2) }}</span>
              </div>
            </div>
            <div class="column is-relative">
              <div class="columns">
                <div class="column content">
                  <h4 class="is-font-black has-text-weight-light is-size-6">{{ dataItem.name }}</h4>
                  <!--span class="has-text-grey is-line-height1">{{ dataItem.text }}</span-->
                </div>
              </div>
              <div class="columns is-mobile is-space-between">
                <div class="column is-narrow">
                  <span v-show="dataItem.price" class="has-text-weight-bold has-text-color">${{ dataItem.price }}</span>
                </div>
                <div class="column is-narrow">
                  <a v-show="!dataItem.quotable" class="card-button" :class="{ 'has-item': dataCount }">
                    <span class="icon">
                      <svg-icon v-show="!dataCount" icon="bag"/>
                      <h4 class="has-theme-color" v-show="dataCount">{{ dataCount }}</h4>
                    </span>
                  </a>
                  <a v-show="dataItem.quotable">
                    <b-icon icon="comment-outline" class="has-text-color"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'CardItem',
  components: {
    SvgIcon
  },
  data () {
    return {
      lastCount: 0,
      isShareActive: false,
      isItemActive: false
    }
  },
  computed: {
    ...mapState([
      'shop'
    ])
  },
  props: {
    dataItem: {
      type: Object,
      default: () => {}
    },
    dataCount: {
      type: Number,
      default: () => 0
    },
    dataIndex: {
      type: Number,
      default: () => 0
    },
    dataLength: {
      type: Number,
      default: () => 0
    },
    dataVista: {
      type: String,
      default: () => 'grid'
    },
    dataShareActive: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    setCount (count) {
      this.dataItem.count = count
      this.$emit('update-cart', this.dataItem)
    },
    shareModal () {
      this.isShareActive = true
      this.$emit('data-item', this.dataItem, this.dataIndex, this.dataLength)
      this.$emit('share-modal', this.dataItem)
    },
    itemClick () {
      if (this.dataItem.quotable) {
        this.setCount(this.lastCount ? 0 : 1)
      } else {
        if (!this.dataShareActive) {
          this.$store.dispatch('event', { tag: 'click', value: 'item_item' })
          this.$emit('data-item', this.dataItem, this.dataIndex, this.dataLength)
        }
      }
    }
  }
}
</script>
