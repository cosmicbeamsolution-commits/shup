<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-5">
          <card-component title="Nueva contraseña" svg-icon="iso">
            <form @submit.prevent="submit">
              <b-field label="Nueva contraseña">
                <b-field>
                  <b-input icon="lock" type="password" v-model="form.password" placeholder="Ingresá tu nueva contraseña" required />
                </b-field>
              </b-field>
              <hr>
              <div class="buttons is-flex-end">
                <b-button native-type="submit" type="is-primary" class="is-fullwidth" :loading="sending">Establecer nueva contraseña</b-button>
              </div>
            </form>
          </card-component>
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
  name: 'resetpassword',
  components: {
    TitleBar,
    CardComponent
  },
  computed: {
    titleStack () {
      return [
        'geotiendas',
        'Nueva contraseña'
      ]
    }
  },
  created () {
    if (this.$route.params.code) {
      this.form.code = this.$route.params.code
    } else {
      this.$buefy.toast.open({
        message: 'Código de verificación no obtenido',
        type: 'is-danger'
      })
    }
  },
  methods: {
    submit () {
      this.sending = true
      axios.post(['panel', 'update_password'].join('/'), this.form).then(res => {
        this.sending = false
        this.$buefy.toast.open({
          message: 'Ahora podés iniciar sesión con tu nueva contraseña.',
          type: 'is-success'
        })
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      }).catch(err => {
        this.sending = false
        if (err.response.status === 404) {
          this.$buefy.toast.open({
            message: `Esta cuenta no solicitó ninguna nueva contraseña contraseña.`,
            type: 'is-danger'
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
        code: null,
        password: null
      }
    }
  }
}
</script>
