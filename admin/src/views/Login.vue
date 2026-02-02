<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section v-show="basic.loaded" class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-8-desktop has-text-left">
          <div class="columns">
            <div class="column">
              <div class="is-vpadded content">
                <blockquote>Gracias por utilizar nuestra plataforma. Ingresa con tu <b>email</b>.</blockquote>
                <div class="has-text-centered is-vpadded is-hidden-mobile">
                  <img src="/img/art/team.svg" width="320" />
                </div>
              </div>
            </div>
            <div class="column">
              <card-component title="Iniciar sesión" svg-icon="iso">
                <form @submit.prevent="submit">
                  <b-field label="Email">
                    <b-field>
                      <b-input icon="email" type="email" v-model="form.email" placeholder="E-mail" name="email" required />
                    </b-field>
                  </b-field>
                  <b-field label="Contraseña" message="Revisa las mayúsculas">
                    <b-field>
                      <b-input icon="lock" type="password" v-model="form.password" placeholder="********" name="password" required />
                    </b-field>
                  </b-field>
                  <hr>
                  <div class="buttons is-flex-end">
                    <div class="control">
                      <b-button native-type="submit" type="is-primary" :loading="loading">Iniciar sesión</b-button>
                    </div>
                  </div>
                </form>
              </card-component>
              <div class="buttons is-flex-center">
                <b-button type="is-light is-small" icon-left="textbox-password" @click="forgotPassword()">
                  <span>Olvidé la contraseña</span>
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
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
        'Iniciar sesión'
      ]
    },
    ...mapState([
      'basic'
    ])
  },
  methods: {
    forgotPassword () {
      this.$router.push('/forgotpassword')
    },
    submit () {
      this.loading = true
      this.$store.dispatch('login', this.form).then(res => {
        this.$store.dispatch('loaded', false)
        this.$buefy.snackbar.open({
          message: `${res.data.user.first_name}, qué bueno tenerte de nuevo por acá!`,
          type: 'is-success'
        })
        this.$router.push('/')
      }).catch(err => {
        this.loading = false
        this.$store.dispatch('loaded', true)
        if (err.response) {
          if (err.response.status === 404) {
            this.$buefy.snackbar.open({
              message: `El name de usuario ${this.form.email} no existe`,
              type: 'is-danger',
              queue: false
            })
          } else if (err.response.status === 401) {
            this.$buefy.snackbar.open({
              message: `La constraseña es incorrecta`,
              queue: false
            })
          }
        }
      })
    }
  },
  data () {
    return {
      loading: false,
      form: {
        email: null,
        password: null
      }
    }
  }
}
</script>
