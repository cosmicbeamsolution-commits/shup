<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="rocket" size="is-medium"/>
      <span> Planes</span>
      <router-link slot="right" to="/" class="button ">
        Escritorio
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component :is-float="true" :is-narrow="true" :is-centered="true">
        <h5>Recibiendo datos de mercadopago</h5>
        <p>Por favor espere...</p>
      </card-component>
    </section>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
export default {
  name: 'pay_action',
  components: {
    CardComponent
  },
  data () {
    return {
      preference: JSON.parse(localStorage.getItem('preference')) || {}
    }
  },
  mounted () {
    if (!this.preference.init_point) {
      this.$buefy.toast.open({
        message: `Hubo un error al inciar el pago`,
        type: 'is-danger',
        queue: true
      })
      setTimeout(() => {
        this.$router.push('/')
      }, 6000)
    } else {
      this.startMPFlow()
      this.$store.dispatch('event', 'payment_started')
    }
  },
  methods: {
    startMPFlow () {
      window.location.href = this.preference.init_point
      /* let script = document.createElement('script')
      script.setAttribute('src', 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js')
      script.setAttribute('data-preference-id', this.preference.id)
      window.sandbox_init_point = this.preference.init_point
      window.init_point = this.preference.init_point
      document.getElementById('form').appendChild(script)
      setTimeout(() => {
        document.querySelector('.mercadopago-button').click()
      }, 6000) */
    }
  }
}
</script>

<style>
  iframe {
    height: 100%;
    overflow-x: hidden;
  }

  .form.mercadopago {
    opacity: 1!important;
  }

  .mercadopago-button {
    opacity: 0;
  }
</style>
