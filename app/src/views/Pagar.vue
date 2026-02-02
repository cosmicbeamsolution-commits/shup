<template>
  <div>
    <section-background>
      <div class="content">
        <div class="columns is-centered">
          <div class="column is-4">
            <h1 class="is-special-title has-text-centered has-text-white">Pagar</h1>
          </div>
        </div>
      </div>
    </section-background>
    <div class="column has-padding-bottom">
      <card-component :is-float="true" :is-narrow="true" :is-centered="true">
        <h5>Recibiendo datos de mercadopago</h5>
        <p>Por favor espere...</p>
        <div class="form mercadopago">
          <div class="input-data has-text-centered">
            <form action="https://api.yacabron.com/procesar-pago" method="POST" id="form"/>
          </div>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import SectionBackground from '../components/SectionBackground'
export default {
  name: 'pagar',
  components: {
    CardComponent,
    SectionBackground
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
      this.$store.dispatch('etag', 'payment_started')
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
