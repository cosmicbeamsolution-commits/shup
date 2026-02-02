<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="flask-plus-outline" size="is-large"/>
      Filtros
      <router-link slot="right" to="/filters/new" class="button">
        Nuevo filtro
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'filters'" :data-url="'/filters'"/>
      </card-component>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TableComponent from '@/components/TableComponent'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Filters',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    TitleBar,
    CardComponent,
    TableComponent
  },
  computed: {
    titleStack () {
      return [
        'Admin',
        'Filtros'
      ]
    }
  }
}
</script>
