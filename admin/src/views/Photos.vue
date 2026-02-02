<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="camera-image" size="is-large"/>
      Fotos
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <div class="columns is-multiline">
          <div class="column is-2" v-for="(item, index) in data" :key="index">
            <a :href="`${item}`" :title="`${item}`" target="_blank">
              <div class="is-background-image" :style="`background-image: url('${item}')`" />
            </a>
          </div>
        </div>
      </card-component>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Photos',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    TitleBar,
    CardComponent
  },
  data () {
    return {
      data: {}
    }
  },
  created: function () {
    axios.get('/upload/list').then(res => {
      this.data = res.data
    })
  },
  computed: {
    titleStack () {
      return [
        'Admin',
        'Fotos'
      ]
    }
  }
}
</script>
