<template>
  <div class="gallery-provider" :class="{ 'is-extended': dataExtended }" v-if="dataGallery">
    <b-carousel
        :indicator="false"
        :interval="5000"
        :arrow="true"
        :autoplay="false"
        :animated="'slide'"
        :pause-hover="false"
        :pause-info="false">
      <b-carousel-item v-for="(item, i) in dataVideos" :key="`v-${i}`">
        <div class="is-background">
          <vue-plyr>
            <video :src="item">
              <source :src="item" type="getVideoMime(item)" size="720">
            </video>
          </vue-plyr>
        </div>
      </b-carousel-item>
      <b-carousel-item v-for="(item, i) in dataGallery" :key="`i-${i}`">
        <div class="is-background" :style="`background-image:url('${item}')`"/>
      </b-carousel-item>
    </b-carousel>
  </div>
</template>

<script>
export default {
  name: 'GalleryProvider',
  props: {
    dataGallery: {
      type: Array,
      default: () => []
    },
    dataVideos: {
      type: Array,
      default: () => []
    },
    dataExtended: null
  },
  methods: {
    getVideoMime: function (name) {
      const ext = name.split('.').pop()
      if (ext === '.ogv') {
        return 'video/ogg'
      } else if (ext === '.mp4') {
        return 'video/mp4'
      } else if (ext === '.wmv') {
        return 'video/x-ms-wmv'
      } else if (ext === '.3gp') {
        return 'video/3gpp'
      } else if (ext === '.ts') {
        return 'video/MP2T'
      } else if (ext === '.m3u8') {
        return 'application/x-mpegURL'
      } else if (ext === '.flv') {
        return 'video/x-flv'
      } else if (ext === '.mov') {
        return 'video/quicktime'
      } else if (ext === '.avi') {
        return 'video/x-msvideo'
      } else {
        return 'video/ogg'
      }
    },
    headerIconClick () {
      this.$emit('header-icon-click')
    }
  }
}
</script>
