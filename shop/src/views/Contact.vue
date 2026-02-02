<template>
  <div>
    <section-background>
      <div class="content is-bottom-padded">
        <div class="columns is-centered">
          <div class="column is-6">
            <h1 class="has-text-centered has-text-white has-text-shadow">Ponete en contacto con {{ basic.shop.shop }}</h1>
            <p class="has-text-centered has-text-white has-text-weight-bold has-text-shadow has-line-height" v-html="basic.shop.contact_text"></p>
          </div>
        </div>
      </div>
    </section-background>
    <div class="column has-padding-extra-bottom animated fadeIn delay">
      <card-component :is-float="true" :is-narrow="true" :is-centered="true">
        <form class="form is-margin-top" @submit.prevent="submit">
          <b-field>
            <b-input v-model="data.name" placeholder="Tu Nombre" required />
          </b-field>
          <b-field>
            <b-input v-model="data.company" placeholder="Tu Empresa" />
          </b-field>
          <b-field>
            <b-input v-model="data.email" type="email" placeholder="Tu Email" required />
          </b-field>
          <b-field>
            <input class="input" v-model="data.phone" type="text" placeholder="Tu Teléfono o Celular" @keyup="onlyNumeric" required />
          </b-field>
          <b-field>
            <b-input v-model="data.website" placeholder="Tu Sitio Web" />
          </b-field>
          <hr>
          <b-field>
            <textarea class="textarea is-rows-condensed" v-model="data.comments" placeholder="Tu pregunta o comentario..." required />
          </b-field>
          <div class="columns is-vcentered has-text-centered">
            <div class="column">
              <button type="submit" class="button is-success" :class="{ 'is-loading' : isLoading }">
                <span>Enviar solicitud</span>
              </button>
            </div>
          </div>
        </form>
      </card-component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import SectionBackground from '../components/SectionBackground'
import CardComponent from '@/components/CardComponent'

export default {
  name: 'contact',
  components: {
    CardComponent,
    SectionBackground
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  created () {
    this.$root.isLoading = false
  },
  methods: {
    onlyNumeric () {
      this.customer.phone = this.customer.phone.replace(/[^0-9]/g, '')
    },
    submit () {
      this.data.origen = 'app'
      this.isLoading = true
      axios.post('/contact/' + this.basic.shop._id, this.data).then((res) => {
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
