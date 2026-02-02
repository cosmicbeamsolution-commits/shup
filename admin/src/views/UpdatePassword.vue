<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section v-show="basic.loaded" class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-5">
          <card-component title="Guardar constraseña" icon="textbox-password">
            <form @submit.prevent="submit">
              <b-field>
                <b-input icon="password" type="email" v-model="form.password" placeholder="Ingresá tu nueva contraseña" required />
              </b-field>
              <hr>
              <div class="buttons is-flex-end">
                <div class="control">
                  <b-button native-type="submit" type="is-primary">Guardar contraseña</b-button>
                </div>
              </div>
            </form>
          </card-component>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import CardComponent from '@/components/CardComponent'
import mapValues from 'lodash/mapValues'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'Login',
  components: {
    TitleBar,
    CardComponent
  },
  created () {
    if (this.$route.params.code) {
      this.form.code = this.$route.params.code
    } else {
      this.$buefy.toast.open({
        message: 'Código de verificación no obtenido',
        type: 'is-danger',
        queue: false,
        duration: 10000
      })
    }
  },
  computed: {
    titleStack () {
      return [
        'Admin geotiendas',
        'Actualizar contraseña'
      ]
    },
    ...mapState([
      'basic'
    ])
  },
  methods: {
    startSession () {
      this.$router.push('/login')
    },
    submit () {
      this.$store.dispatch('loaded', false)
      axios
        .post(['admin', 'update_password'].join('/'), this.form).then(res => {
          this.$store.dispatch('loaded', true)
          this.$buefy.toast.open({
            message: 'Ahora podés iniciar sesión con tu nueva contraseña.',
            type: 'is-success',
            queue: false,
            duration: 10000
          })
        }).catch(err => {
          this.$store.dispatch('loaded', true)
          if (err.response.status === 404) {
            this.$buefy.toast.open({
              message: `Esta cuenta no solicitó ninguna ayuda con la contraseña.`,
              type: 'is-warning',
              queue: false,
              duration: 10000
            })
          } else {
            this.$buefy.toast.open({
              message: 'Hubo problemas. Intentá nuevamente en unos minutos.',
              type: 'is-danger',
              queue: false,
              duration: 10000
            })
          }
        })
    },
    reset () {
      this.form = mapValues(this.form, item => {
        if (item && typeof item === 'object') {
          return []
        }
        return null
      })

      this.$buefy.snackbar.open({
        message: 'Se resteó el formulario',
        queue: false
      })
    }
  },
  data () {
    return {
      form: {
        code: null,
        password: null
      }
    }
  }
}
</script>
