<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="headset" size="is-medium"/> Tickets
      <router-link slot="right" to="/tickets/new" class="button ">
        Nuevo Ticket
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component
          :route-name="'tickets'"
          :data-children="'conversation'"
          :data-add="true"
          :data-remove="false"
          :data-url="'/tickets/search?shop=' + this.shop._id"/>
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
  name: 'Tickets',
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
