<template>
  <div>
    <modal-share
      :is-active="isShareActive"
      :data-item="shop"
      :data-type="'shop'"
      @cancel="shareCancel"/>
    <div class="is-header-component">
      <div class="background" :style="`background-image:url('${shop.background}')`">
        <router-link to="/">
          <div class="logo" :style="`background-image:url('${shop.logo}')`"/>
        </router-link>
      </div>
      <div class="columns column is-account-info">
        <div class="column text content is-hidden-mobile">
          <h1 class="is-size-2 is-font-bold has-text-color has-text-weight-light">{{ shop.shop }}</h1>
          <p class="description has-text-color">{{ shop.text }}</p>
        </div>
        <div class="column text content is-hidden-tablet">
          <h1 class="is-size-2 is-font-bold has-text-color has-text-centered">{{ shop.shop }}</h1>
          <p class="has-text-color has-text-centered">{{ shop.text }}</p>
        </div>
        <div v-show="details" class="column is-share-icons animated fadeIn delay">
          <b-field grouped group-multiline>
            <!--p v-show="shop.about" class="control">
              <router-link to="/info" @click="$socket.emit('event', { tag: 'click', value: 'info' })" :title="`Conocé más acerca de ${shop.shop}`">
                <b-icon icon="information"/>
              </router-link>
            </p-->
            <p class="control">
              <router-link to="/geo" @click="this.$store.dispatch('event', { tag: 'click', value: 'geo'})" :title="`Conocé dónde ofrece ${shop.shop}`">
                <span class="icon">
                  <i class="mdi mdi-selection-marker mdi-24px has-text-color"></i>
                </span>
              </router-link>
            </p>
            <span class="extra" v-if="shop.extra && shop.extra.social">
              <p v-for="(item, index) in shop.extra.social" :key="index" class="control">
                <a :href="item.url" :title="`Seguinos en ${item.icon}`" @click="store.dispatch('event', { tag: 'click', value: item.icon })" target="_blank">
                  <span class="icon">
                    <i :class="`mdi mdi-${item.icon} mdi-24px has-text-color`"></i>
                  </span>
                </a>
              </p>
            </span>
            <p class="control">
              <a @click.prevent="shareModal" :title="`Compartí ${shop.shop} en tus redes sociales`">
                <span class="icon">
                  <i class="mdi mdi-share-variant mdi-24px has-text-color"></i>
                </span>
              </a>
            </p>
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ModalShare from '@/components/ModalShare'
export default {
  name: 'HeaderComponent',
  components: {
    ModalShare
  },
  props: {
    details: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      'shop'
    ])
  },
  data () {
    return {
      isShareActive: false
    }
  },
  methods: {
    shareModal () {
      this.$store.dispatch('event', { tag: 'click', value: 'share' })
      this.isShareActive = true
    },
    shareCancel () {
      this.isShareActive = false
    }
  }
}
</script>
