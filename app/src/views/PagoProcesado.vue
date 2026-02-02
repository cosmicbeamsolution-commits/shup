<template>
  <div>
    <section-background>
      <div class="content">
        <div class="columns is-centered">
          <div class="column is-4">
            <h1 class="is-special-title has-text-centered has-text-white">Resultado del pago</h1>
          </div>
        </div>
      </div>
    </section-background>
    <div class="column has-padding-bottom">
      <card-component :is-float="true" :is-narrow="true">
        <div v-show="payment_status === 'success'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue recibido</h4>
            <p>Se envió un correo a tu cuenta.</p>
          </div>
          <router-link to="/gracias" class="button is-success">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'failure'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue rechazado</h4>
            <p>Intentalo de nuevo con otra cuenta / tarjeta.</p>
          </div>
          <router-link to="/datos" class="button is-success">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'pending'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago está pendiente de aprobación</h4>
            <p>Tu pago todavía no fue acreditado. Cuando esto suceda te notificaremos.</p>
          </div>
          <router-link to="/gracias" class="button is-success">Continuar</router-link>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import SectionBackground from '../components/SectionBackground'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'pago_procesado',
  components: {
    CardComponent,
    SectionBackground
  },
  mounted () {
    this.payment_status = this.$route.params.status
    if (this.payment_status === 'success') {
      localStorage.removeItem('order')
    }
  },
  data () {
    return {
      payment_status: ''
    }
  }
}
</script>
