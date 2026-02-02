<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="account-star" size="is-medium"/>
      Cuentas
      <router-link slot="right" to="/accounts/new" class="button">
        Crear nueva cuenta
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'admins'" :data-actions="false" :data-url="'/admins'"/>
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
  name: 'Accounts',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    TableComponent
  }
}
</script>
