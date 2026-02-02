<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="rocket" size="is-medium"/>
      <span> Planes</span>
      <!--router-link slot="right" to="/" class="button ">
        Escritorio
      </router-link-->
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <div v-show="payment_status === 'exito'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue recibido</h4>
            <p>Se envió un correo a tu cuenta.</p>
          </div>
          <router-link to="/gracias" class="button is-success ">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'error'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago fue rechazado</h4>
            <p>Intentalo de nuevo con otra cuenta / tarjeta.</p>
          </div>
          <router-link to="/datos" class="button is-success ">Continuar</router-link>
        </div>
        <div v-show="payment_status === 'pendiente'" class="content has-text-centered is-marginless">
          <div class="is-spaced">
            <h4>Tu pago está pendiente de aprobación</h4>
            <p>Tu pago todavía no fue acreditado. Cuando esto suceda te notificaremos.</p>
          </div>
          <router-link to="/gracias" class="button is-success ">Continuar</router-link>
        </div>
      </card-component>
    </section>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'payment_status',
  components: {
    CardComponent
  },
  mounted () {
    this.payment_status = this.$route.params.status
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
