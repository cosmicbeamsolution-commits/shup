<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="email-check-outline" size="is-medium"/>
      Newsletter
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'newsletter'" :data-url="'/newsletter'"/>
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
  name: 'Newsletter',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    TableComponent
  }
}
</script>
