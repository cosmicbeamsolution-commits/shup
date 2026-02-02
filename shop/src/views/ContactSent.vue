<template>
  <div>
    <header-component/>
    <div class="column is-bottom-extra-extra-padded animated fadeIn delay">
      <card-component :is-float="true" :is-narrow="true" :is-centered="true">
        <h5>Recibiendo datos de mercadopago</h5>
        <p>Por favor espere...</p>
        <div class="form mercadopago">
          <div class="input-data has-text-centered">
            <form action="https://pagos.geotiendas.com/procesar" method="POST" id="form"/>
          </div>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeaderComponent from '../components/HeaderComponent'
export default {
  name: 'contact_sent',
  components: {
    CardComponent,
    HeaderComponent
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
