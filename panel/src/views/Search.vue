<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="database-search" size="is-medium"/>
      Buscar
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" :title="parent.name" icon="tray-full" v-for="(parent, i) in data" :key="i">
        <div class="column">
          <router-link v-for="(item, index) in parent.items" :key="index" :to="`/catalogo/${parent._id}/${item._id}`" :title="`${item._id}`" class="button is-fullwidth is-flex-left is-text">
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </card-component>
      <div v-if="!Object.keys(data).length" class="notification is-warning">
        <span>No hay resultados para <strong>{{ this.$route.params.query }}</strong></span>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'

export default {
  name: 'Search',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    getIcon (name) {
      let ref = document.querySelector(`a[href="/dump/${name}"] i`)
      if (ref) {
        return document.querySelector(`a[href="/dump/${name}"] i`).classList.toString()
      }
      return ''
    }
  },
  created: function () {
    axios.post('/panel/searchall', { query: this.$route.params.query }).then(res => {
      document.getElementById('query').value = this.$route.params.query
      this.data = res.data
    })
  }
}
</script>
