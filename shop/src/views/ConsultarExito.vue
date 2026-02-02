<template>
  <div class="app-view">
    <section-background :is-rolled="true" />
    <card-component :is-float="true" :is-narrow="true">
      <div class="content has-text-centered is-marginless">
        <div class="is-spaced">
          <h3>¡Solicitud enviada!</h3>
          <p class="has-text-light">Revisá tu email, pronto recibirás las mejores opciones para tu evento.</p>
        </div>
        <router-link to="/" class="button is-danger  is-outlined">Entendido</router-link>
      </div>
    </card-component>
    <div class="container">
      <div class="columns has-text-centered">
        <div class="column">
          <div class="">
            <a @click="goBack" class="button is-text">Volver</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionBackground from '@/components/SectionBackground'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'consultar_exito',
  components: {
    CardComponent,
    SectionBackground
  },
  created () {
    this.$root.isLoading = false
  },
  methods: {
    goBack () {
      history.go(-2)
    }
  }
}
</script>
