<template>
  <div class="animated fadeInRightBig">
    <section class="hero is-top">
      <div class="content">
        <card-component :is-float="true" :is-centered="true">
          <h2 class="has-text-weight-bold has-text-success">
            <span class="icon">
              <b-icon icon="check"/>
            </span>
            Tienda creada con éxito
          </h2>
          <div class="has-text-centered">
            <img src="/img/art/team_success.svg" width="400"/>
          </div>
          <h4 class="has-text-centered" v-if="shop && shop.shop">¡Bienvenido a geotiendas {{ shop.shop }}!</h4>
          <p>Revisá tu email <span class="has-text-success">{{ shop.email }}</span> y encontrarás el enlace para empezar a configurar tu tienda y cargar tu catálogo sin iniciar sesión. También te detallamos tus datos de ingreso y la url de tu tienda.</p>
          <p>Muchas gracias por ser parte de geotiendas.com</p>
        </card-component>
        <div class="buttons is-flex-center">
          <b-button icon-left="backspace" @click="goHome()">
            <span class="">Volver a inicio</span>
          </b-button>
          <a class="button is-success" href="https://gestor.geotiendas.com" target="_blank">
            <span class="">Iniciar sesión</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'shop_created',
  components: {
    CardComponent
  },
  data () {
    return {
      shop: null
    }
  },
  created () {
    let shop = localStorage.getItem('shop')
    if (shop) {
      this.shop = JSON.parse(shop)
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
