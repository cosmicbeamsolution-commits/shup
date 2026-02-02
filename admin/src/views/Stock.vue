<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="checkbox-multiple-marked-outline" size="is-large"/>
      Stock
      <router-link slot="right" to="/stock/new" class="button">
        Nueva Categoría
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'stock'" :data-children="'products'" :data-url="'/stock'"/>
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
  name: 'Stock',
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
        'Stock'
      ]
    }
  }
}
</script>
