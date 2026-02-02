<template>
  <div>
    <section class="hero is-top">
      <div class="content">
        <card-component :is-float="true" :is-centered="true">
          <h2 class="has-text-weight-bold">Probá nuestro gestor</h2>
          <p>Probá nuestro gestor con una cuenta de invitado <a class="has-text-info" href="https://gestor.geotiendas.com">ingresando</a> al Gestor para usuarios de Geotiendas
          <div class="field">
<pre>Tienda: <b>demo</b>
Contraseña: <b>demo</b>
</pre>
          </div>
          <p>Te damos libre acceso a nuestra plataforma para que la pruebes, si estás satisfecho con la calidad y prestación de la cuenta demo siempre podés <a class="has-text-info" @click="goCreateAccount()">crear tu propia cuenta</a>.</p>
        </card-component>
      </div>
    </section>
    <section class="hero section is-demo">
      <div class="container">
        <div class="columns is-vcentered is-centered is-vexpanded">
          <div class="demo-screen-container">
            <div class="demo-screen is-hidden-touch">
              <div>
                <img :src="`${basic.landing.panelDesktop}`"/>
              </div>
            </div>
            <div class="demo-screen is-hidden-desktop">
              <div>
                <img :src="`${basic.landing.panelMobile}`"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="buttons is-flex-center">
      <b-button icon-left="backspace" @click="goHome()">
        <span class="">Volver</span>
      </b-button>
      <a href="https://gestor.geotiendas.com" target="_blank" class="button is-success">
        <span class="">Ingresar como invitado</span>
      </a>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'shop_created',
  components: {
    CardComponent
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    goCreateAccount () {
      this.$router.push('/crea-tu-tienda')
    }
  }
}
</script>
