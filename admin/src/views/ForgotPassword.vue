<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section v-show="basic.loaded" class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-5">
          <card-component title="Recuperar constraseña" icon="textbox-password">
            <form @submit.prevent="submit">
              <b-field  label="Email">
                <b-input icon="email" type="email" v-model="form.email" placeholder="E-mail" name="email" required />
              </b-field>
              <hr>
              <div class="buttons is-flex-end">
                <div class="control">
                  <b-button native-type="submit" type="is-primary">Recuperar contraseña</b-button>
                </div>
              </div>
            </form>
          </card-component>
          <div class="buttons is-flex-center">
            <b-button type="is-light is-small" icon-left="account-circle" @click="startSession()">
              <span>Iniciar sesión</span>
            </b-button>
          </div>
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
  computed: {
    titleStack () {
      return [
        'Admin geotiendas',
        'Recuperar contraseña'
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
        .post(['admin', 'restore_password'].join('/'), this.form).then(res => {
          this.$store.dispatch('loaded', true)
          this.$buefy.toast.open({
            message: 'Se envió un correo a tu cuenta con instrucciones',
            type: 'is-success',
            queue: false,
            duration: 100000
          })
        }).catch(err => {
          this.$store.dispatch('loaded', true)
          if (err.response.status === 404) {
            this.$buefy.toast.open({
              message: `No hay ninguna cuenta <strong>${this.form.email}</strong>`,
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
        email: null,
        password: null
      }
    }
  }
}
</script>
