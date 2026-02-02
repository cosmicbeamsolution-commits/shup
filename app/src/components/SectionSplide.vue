<template>
  <div>
    <splide :options="options">
      <splide-slide v-for="(item, index) in page.galeria" :key="index">
        <div @click="showLightBox(index)" class="splide-image" :style="`background-image: url(${item.src})`"></div>
      </splide-slide>
    </splide>
    <Tinybox
      :images="page.galeria"
      :index="lightBoxIndex"
      @change="onChange"
      @prev="onPrevious"
      @next="onNext"
      @close="onClose"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import Tinybox from 'vue-tinybox'
export default {
  components: {
    Splide,
    SplideSlide,
    Tinybox
  },
  data () {
    return {
      lightBoxIndex: null,
      options: {
        rewind: true,
        autoWidth: true,
        height: 125
      }
    }
  },
  computed: {
    ...mapState([
      'page'
    ])
  },
  created: function () {
    // console.log(this.dataGallery)
  },
  methods: {
    handleHide () {
      this.lightBoxVisible = false
    },
    showLightBox (index) {
      this.lightBoxIndex = index
    },
    onChange (index) {
      console.log(`onChange ${index}`)
      this.lightBoxIndex = index
    },
    onPrevious (index) {
      console.log(`onPrev ${index}`)
      this.lightBoxIndex = index
    },
    onNext (index) {
      console.log(`onNext ${index}`)
      this.lightBoxIndex = index
    },
    onClose (index) {
      this.lightBoxIndex = null
    },
    info (value) {
      this.$emit('carouselChange', value)
    }
  }
}
</script>
