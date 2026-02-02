<template>
  <section class="hero is-top">
    <div class="content">
      <card-component :is-float="true" :is-centered="true">
        <h3>Gracias por tu mensaje</h3>
        <p>Pronto recibirás novedades de geotiendas. Revisá tu email.</p>
        <div class="buttons is-flex-center">
          <router-link to="/" class="button is-danger is-rounded is-outlined">Entendido</router-link>
        </div>
      </card-component>
      <div class="buttons is-flex-center">
        <b-button type="is-light is-small" icon-left="backspace" @click="goBack()" rounded>
          <span>Volver</span>
        </b-button>
      </div>
    </div>
  </section>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'contact_sent',
  components: {
    CardComponent
  },
  methods: {
    goBack () {
      this.$router.push('/')
    }
  },
  created () {
    this.$root.isLoading = false
  }
}
</script>
