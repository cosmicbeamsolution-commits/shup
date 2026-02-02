<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      Tables
      <router-link slot="right" to="/" class="button ">
        Dashboard
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Clients" icon="account-multiple">
        <table-component data-url="/data-sources/clients.json" :checkable="true"/>
      </card-component>

      <hr>

      <notification class="is-info">
        <div>
          <b-icon icon="buffer" custom-size="default"/>
          <b>Tightly wrapped</b> &mdash; table header becomes card header
        </div>
      </notification>

      <card-component class="has-table has-mobile-sort-spaced">
        <table-component data-url="/data-sources/clients.json" :checkable="true"/>
      </card-component>

      <hr>

      <notification class="is-info">
        <div>
          <b-icon icon="buffer" custom-size="default"/>
          <b>Empty table.</b> When there's nothing to show
        </div>
      </notification>

      <card-component class="has-table">
        <table-component/>
      </card-component>
    </section>
  </div>

</template>

<script>
import Table from '@/components/Table'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Tables',
  components: { HeroBar, TitleBar, CardComponent, Table },
  computed: {
    titleStack () {
      return [
        'Gestor',
        'Tables'
      ]
    }
  }
}
</script>
