<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="email" size="is-medium"/>
      Consultas
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'contacts'" :data-url="'/contacts/search?shop=' + this.shop._id"/>
      </card-component>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TableComponent from '@/components/TableComponent'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Contacts',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    TableComponent
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  }
}
</script>
