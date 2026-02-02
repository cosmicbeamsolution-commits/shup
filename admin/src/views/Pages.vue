<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="square-edit-outline" size="is-medium"/>
      Páginas
      <router-link slot="right" to="/pages/new" class="button">
        Nueva página
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'pages'" :data-url="'/pages'"/>
      </card-component>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TableComponent from '@/components/TableComponent'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Pages',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    TableComponent
  }
}
</script>
