<template>
  <div>
    <header-component/>
    <div class="content is-bottom-extra-extra-padded animated fadeIn">
      <card-component :is-float="true" :is-centered="true" class="is-white">
        <h5 class="has-text-weight-bold">Acerca de {{ shop.shop }}</h5>
        <hr>
        <div v-html="shop.about"/>
        <hr>
        <div class="has-text-centered">
          <router-link to="/">
            <b-button type="is-info">Volver a la tienda</b-button>
          </router-link>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import HeaderComponent from '../components/HeaderComponent'
export default {
  name: 'info',
  components: {
    CardComponent,
    HeaderComponent
  },
  computed: {
    ...mapState([
      'shop'
    ])
  },
  methods: {
    goBack () {
      history.go(-2)
    }
  },
  created () {
    this.$root.isLoading = false
  }
}
</script>
