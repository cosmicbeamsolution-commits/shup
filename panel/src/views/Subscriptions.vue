<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="certificate" size="is-medium"/>
      Suscripciones
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'subscriptions'" :data-url="'/subscriptions/search?shop=' + this.shop._id" :data-remove="false" data-empty-div=".subscriptions-empty"/>
        <div class="subscriptions-empty is-hidden is-padded animated fadeIn delay">
          <div class="has-text-centered content">
            <img src="/img/art/tech-advise.svg" width="320" />
            <h3>No tenés suscripciones activas</h3>
            <p>Cuando hayas contratado nuestro servicios tus suscripciones aparecerán acá.</p>
            <div class="buttons is-centered">
              <router-link to="/planes" class="button is-success">Crear mi primera suscripción</router-link>
            </div>
          </div>
        </div>
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
  name: 'Subscriptions',
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
