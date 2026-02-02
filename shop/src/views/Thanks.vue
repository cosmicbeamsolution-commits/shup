<template>
  <div>
    <header-component/>
    <div class="content is-bottom-extra-extra-padded animated fadeIn">
      <card-component :is-float="true" :is-centered="true" class="is-white">
        <h5>Gracias por tu compra en {{ shop.shop }}</h5>
        <hr>
        <div v-html="shop.payment_text"/>
        <p>Revisá tu email para mas detalles de tu compra.</p>
        <hr>
        <div class="has-text-centered">
          <router-link to="/">
            <button type="button" class="button is-small is-link is-size-6">Volver a la tienda</button>
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
  name: 'thanks',
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
