<template>
  <div>
    <modal-share
      :is-active="isShareActive"
      :data-item="shop"
      :data-type="'shop'"
      @cancel="shareCancel"/>
    <section class="section is-paddingless is-header-component">
      <div class="background" :style="`background-image:url('${shop.background}')`"/>
      <div class="columns is-marginless is-account-info">
        <div class="column is-3 has-text-right">
          <router-link to="/" class="logo">
            <div :style="`background-image:url('${shop.logo}')`"/>
          </router-link>
        </div>
        <div class="column has-text-left content is-marginless text">
          <h1 class="is-marginless has-text-weight-bold">{{ shop.shop }}</h1>
          <p class="description has-text-weight-semibold">{{ shop.text }}</p>
          <div v-show="details">
            <p class="has-text-light has-text-weight-semibold is-marginless">
              <b-icon v-show="shop.scope === 'country'" class="is-fixed-icon" icon="map-marker-circle" title="Envíos a todo el país"/>
              <b-icon v-show="shop.scope === 'custom'" class="is-fixed-icon" icon="select-marker" title="Envíos locales"/>
              <span> {{ shop.address }}</span>
            </p>
          </div>
        </div>
        <div class="column social has-text-right animated fadeIn delay">
          <b-field v-show="details" grouped group-multiline position="is-centered">
            <p v-show="shop.about" class="control">
              <a @click.prevent="shareModal" :title="`Compartí ${shop.shop} en tus redes sociales`">
                <b-icon icon="share"/>
              </a>
            </p>
            <p v-show="shop.about" class="control">
              <router-link to="/info" @click="store.dispatch('event', { tag: 'click', value: 'info'})" :title="`Conocé más acerca de ${shop.shop}`">
                <b-icon icon="information-variant"/>
              </router-link>
            </p>
            <span class="extra" v-if="shop.extra && shop.extra.social">
              <p v-for="(item, index) in shop.extra.social" :key="index" class="control">
                <a :href="item.url" :title="`Seguinos en ${item.icon}`" @click="$socket.emit('event', { tag: 'click', value: item.icon })" target="_blank">
                  <b-icon :icon="item.icon"/>
                </a>
              </p>
            </span>
          </b-field>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ModalShare from '@/components/ModalShare'
export default {
  name: 'SectionHeader',
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
      this.$socket.emit('event', { tag: 'click', value: 'share', device: this.$store.state.device })
      this.isShareActive = true
    },
    shareCancel () {
      this.isShareActive = false
    }
  }
}
</script>
