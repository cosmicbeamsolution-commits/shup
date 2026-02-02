<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <hero-bar>
      <b-icon icon="circle-edit-outline" size="is-large"/>
      <span> Blog</span>
      <router-link slot="right" to="/blog/new" class="button ">
        Nueva Categoría
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <table-component :route-name="'blog'" :data-children="'entries'" :data-url="'/blog'"/>
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
  name: 'Blog',
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
        'Gestor',
        'Blog'
      ]
    }
  }
}
</script>
