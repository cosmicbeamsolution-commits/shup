<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section v-show="basic.loaded" class="section is-main-section is-body-centered">
      <div v-if="loading" class="has-text-centered is-vpadded-x3 content">
        <img src="/img/art/password.svg" width="320" />
      </div>
      <div v-else class="columns is-centered">
        <div class="column is-8-desktop has-text-left">
          <div class="columns">
            <div class="column">
              <card-component title="Iniciar sesión" svg-icon="iso">
                <form @submit.prevent="submit">
                  <b-field label="ID de tienda o Email">
                    <b-field>
                      <b-input icon="shopping" type="text" v-model="form.emailorid" placeholder="Email ó ID de la tienda" required />
                    </b-field>
                  </b-field>
                  <b-field label="Contraseña" message="Revisa las mayúsculas">
                    <b-field>
                      <b-input icon="lock" type="password" v-model="form.password" placeholder="********" name="password" required />
                    </b-field>
                  </b-field>
                  <hr>
                  <div class="buttons is-flex-end">
                    <b-button native-type="submit" type="is-primary" class="is-fullwidth" :loading="loading">Iniciar sesión</b-button>
                  </div>
                </form>
              </card-component>
              <div class="buttons is-flex-center">
                <router-link to="/forgotpassword" class="button is-light is-small ">
                  <span>Olvidé la contraseña</span>
                </router-link>
                <a href="https://geotiendas.com/crea-tu-tienda" class="button is-success is-outlined is-small">
                  <span>Creá tu tienda ahora</span>
                </a>
              </div>
            </div>
            <div class="column">
              <div class="is-vpadded content">
                <blockquote>Gracias por utilizar nuestra plataforma. Ingresa con el <b>nombre de tu tienda</b> o <b>email</b>. El nombre de tu tienda es el que figura en la URL pública de tu tienda (ej: <b>tienda</b>.geotiendas.com) </blockquote>
                <div class="has-text-centered is-vpadded is-hidden-mobile">
                  <img src="/img/art/team-success.svg" width="320" />
                </div>
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
  name: 'login',
  components: {
    TitleBar,
    CardComponent
  },
  computed: {
    titleStack () {
      return [
        'geotiendas',
        'Iniciar sesión'
      ]
    },
    ...mapState([
      'basic'
    ])
  },
  methods: {
    submit () {
      this.loading = true
      this.$store.commit('footerBarStateVisible', false)
      this.$store.dispatch('login', this.form).then(res => {
        this.$store.dispatch('loaded', false)
        let message = `${res.shop.first_name}, qué bueno tenerte de nuevo por acá!`
        let redirect = '/'
        if (!res.shop.wizard_complete) {
          message = `Por favor completá el asistente para comenzar`
          redirect = '/comenzar'
        }
        this.$buefy.snackbar.open({
          message: message,
          queue: false
        })
        this.$store.commit('footerBarStateVisible', true)
        // this.loading = false
        this.$router.push(redirect).catch((err) => {
          throw new Error(`Problem handling something: ${err}.`)
        })
      }).catch(err => {
        this.loading = false
        this.$store.dispatch('loaded', true)
        this.$store.commit('footerBarStateVisible', true)
        if (err.response) {
          if (err.response.status === 404) {
            this.$buefy.snackbar.open({
              message: `El name de usuario ${this.form.emailorid} no existe`,
              type: 'is-danger',
              queue: false
            })
          } else if (err.response.status === 401) {
            let t = this
            this.$buefy.snackbar.open({
              type: 'is-danger',
              actionText: '¿Olvidaste tu contraseña?',
              duration: 8000,
              cancelText: 'Cerrar',
              message: `La contraseña es incorrecta`,
              onAction: () => {
                t.$router.push('/forgotpassword')
              },
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
        emailorid: null,
        password: null
      }
    }
  }
}
</script>
