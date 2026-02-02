<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="credit-card-multiple-outline" size="is-large"/>
      Pagos
      <router-link slot="right" to="/pagos/new" class="button">
        Nuevo pago
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Pagos" icon="credit-card-multiple-outline">
        <table-component :route-name="'pagos'" :data-url="'/pagos'"/>
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
  name: 'Payments',
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
        'Pagos'
      ]
    }
  }
}
</script>
