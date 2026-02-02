<template>
  <div>
    <header-component/>
    <div class="content is-bottom-extra-extra-padded animated fadeIn delay">
      <card-component :is-float="true" :is-narrow="true">
        <div v-show="payment_status === 'exito'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue recibido</h4>
            <p>Se envió un correo a tu cuenta.</p>
          </div>
          <router-link to="/gracias" class="button is-success">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'error'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue rechazado</h4>
            <p>Intentalo de nuevo con otra cuenta / tarjeta.</p>
          </div>
          <router-link to="/datos" class="button is-success">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'pendiente'" class="content has-text-centered is-marginless">
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
import HeaderComponent from '../components/HeaderComponent'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'payment_status',
  components: {
    CardComponent,
    HeaderComponent
  },
  mounted () {
    this.payment_status = this.$route.params.status
    this.$store.dispatch('event', { tag: 'click', value: `payment_${this.payment_status}` })
    if (this.payment_status === 'exito') {
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
