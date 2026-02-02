<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-5">
          <card-component title="Olvidé la contraseña" svg-icon="iso">
            <form @submit.prevent="submit">
              <b-field label="Email">
                <b-field>
                  <b-input icon="shopping" type="text" v-model="form.email" placeholder="Email ó ID de la tienda" name="email" required />
                </b-field>
              </b-field>
              <hr>
              <div class="buttons is-flex-end">
                <b-button native-type="submit" type="is-success" class="is-fullwidth" :loading="sending">Solicitar nueva contraseña</b-button>
              </div>
            </form>
          </card-component>
          <div class="buttons is-flex-center">
            <router-link to="/login" class="button is-light is-small ">
              <span>Iniciar sesión</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'forgotpassword',
  components: {
    TitleBar,
    CardComponent
  },
  computed: {
    titleStack () {
      return [
        'geotiendas',
        'Olvidé la contraseña'
      ]
    }
  },
  methods: {
    submit () {
      if (this.form.email === 'demo' || this.form.email === 'overlemonsoft@gmail.com') {
        return this.$buefy.toast.open({
          message: `Esta cuenta no puede recuperar contraseña`,
          type: 'is-danger',
          duration: 5000
        })
      }
      this.sending = true
      axios.post(['panel', 'restore_password'].join('/'), this.form).then(res => {
        this.sending = false
        this.$buefy.toast.open({
          message: res.data.message,
          type: `is-${res.data.status}`
        })
      }).catch(err => {
        this.sending = false
        if (err.response.status === 404) {
          this.$buefy.toast.open({
            message: `No hay ninguna cuenta <strong>${this.form.email}</strong>`,
            type: 'is-warning'
          })
        } else {
          this.$buefy.toast.open({
            message: 'Hubo problemas. Intentá nuevamente en unos minutos.',
            type: 'is-danger'
          })
        }
      })
    }
  },
  data () {
    return {
      sending: false,
      form: {
        email: null,
        password: null
      }
    }
  }
}
</script>
