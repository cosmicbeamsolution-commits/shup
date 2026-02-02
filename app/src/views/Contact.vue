<template>
  <section class="hero is-top">
    <div class="content">
      <card-component :is-float="true" :is-centered="true">
        <form class="form is-margin-top" @submit.prevent="submit">
          <h2>Contacto</h2>
          <p>Rellená el siguiente formulario. Te responderemos lo mas pronto que podamos</p>
          <div class="columns">
            <div class="column">
              <b-field label="Tu nombre completo">
                <b-input v-model="data.name" ref="autofocus" placeholder="Juan Manuel Rodríguez" required />
              </b-field>
            </div>
            <div class="column">
              <b-field label="Tu teléfono">
                <input class="input is-rounded" v-model="data.phone" type="text" placeholder="1154903559" @keyup="onlyNumeric" required />
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Tu email">
                <b-input v-model="data.email" type="email" placeholder="juanmanuel@gmail.com" required />
              </b-field>
            </div>
            <div class="column">
              <b-field label="Tu sitio web" message="Opcional">
                <b-input v-model="data.website" placeholder="https://facebook.com/deliciasdelsur" />
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Tu tienda" message="Opcional">
                <b-input v-model="data.shop" placeholder="Delicity" />
              </b-field>
            </div>
            <div class="column"></div>
          </div>
          <hr>
          <div class="columns">
            <div class="column">
              <b-field label="Tu pregunta o comentario">
                <textarea class="textarea is-rows-condensed" v-model="data.comments" placeholder="Ingresá tu pregunta o comentario..." required />
              </b-field>
            </div>
          </div>
          <div class="buttons is-flex-center">
            <b-button native-type="submit" type="is-success is-small is-link is-info" icon-left="email" :loading="isLoading">
              <span class="is-size-6"> Enviar solicitud </span>
            </b-button>
          </div>
        </form>
      </card-component>
      <div class="buttons is-flex-center">
        <b-button type="is-light is-rounded" icon-left="backspace" @click="goBack()">
          <span class="">Volver</span>
        </b-button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import CardComponent from '@/components/CardComponent'

export default {
  name: 'contact',
  components: {
    CardComponent
  },
  computed: {
    ...mapState([
      'page'
    ])
  },
  created () {
    this.$nextTick(() => {
      this.$refs.autofocus.focus()
    })
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    onlyNumeric () {
      this.customer.phone = this.customer.phone.replace(/[^0-9]/g, '')
    },
    submit () {
      this.data.origen = 'app'
      this.isLoading = true
      axios.post('/contact', this.data).then((res) => {
        this.isLoading = false
        if (res.data.status === 'success') {
          this.$router.push('/contacto-enviado')
        }
      }).catch(err => {
        this.isLoading = false
        this.$buefy.snackbar.open({
          message: `Algo sucedió que no se pudo enviar el formulario. Por favor, intentá nuevamente en unos instantes. Error: ${err}`,
          type: 'is-danger',
          queue: false,
          duration: 60000
        })
      })
    }
  },
  data () {
    return {
      isLoading: false,
      data: {}
    }
  }
}
</script>
