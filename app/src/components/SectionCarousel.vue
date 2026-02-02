<template>
  <div class="section-carousel-container">
    <section class="is-fit-section" v-if="dataGallery">
      <b-carousel
          :indicator="false"
          :interval="5000"
          :arrow="false"
          :animated="'slide'"
          :pause-hover="false"
          :pause-info="false"
          @change="info($event)">
        <b-carousel-item v-for="(item, i) in dataGallery" :key="i">
          <section class="hero is-medium is-carousel-background" :style="`background-image:url('${item.url}');`">
            <div class="hero-body has-text-centered">
              <h1 class="title"></h1>
            </div>
            <div v-if="dataSnack[i]" class="is-carousel-snack is-hidden-mobile">
              <div class="columns is-mobile content">
                <div class="column has-text-right">
                  <h6 class="has-text-white has-text-right" v-html="'Proveedor recomendado'"/>
                  <span class="has-text-white" v-html="dataSnack[i].empresa"/>
                </div>
                <div class="column is-narrow">
                  <div class="card-avatar glow" :style="`background-image: url('${dataSnack[i].avatar}')`"/>
                </div>
              </div>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </section>
    <section v-else class="is-fit-section">
      <b-carousel
        :arrow="false"
        :indicator="false">
        <b-carousel-item>
          <section class="hero is-medium is-carousel-background">
            <div class="hero-body has-text-centered">
              <h1 class="title"></h1>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </section>
    <section class="section is-fit-section is-carousel-section">
      <slot/>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    dataGallery: {
      type: Array,
      default: () => []
    },
    dataSnack: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapState([
      'section'
    ])
  },
  created: function () {
    // console.log(this.dataGallery)
  },
  methods: {
    info (value) {
      this.$emit('carouselChange', value)
    }
  }
}
</script>
