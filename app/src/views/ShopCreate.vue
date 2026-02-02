<template>
  <div class="animated fadeIn">
    <section class="hero is-top">
      <div class="content">
        <card-component :is-float="true" :is-centered="true">
          <div v-show="!allowedCountries.includes(form.country_iso)">
            <h2>
              <b-icon type="is-danger" size="is-medium" icon="map-marker-remove-variant"/> <span class="has-text-danger">Aún no disponible en {{ form.country }}</span>
            </h2>
            <p>Lamentamos informarte que todavía no tenemos presencia en {{ form.country }}. A través de nuestros servidores detectamos el origen geográfico de las solicitudes de tiendas. De esta manera solo permitimos que los solicitantes de países habilitados peudan registarse. Mantente informado a través de nuestro blog acerca de las últimas novedades para saber cuando llegaremos a tu país. Disculpas por las molestias ocasionadas.</p>
            <div class="column has-text-centered">
              <img :src="`${$store.state.endpoint}/img/flags/${form.country_iso}.svg`" width="160"/>
            </div>
          </div>
          <div v-show="allowedCountries.includes(form.country_iso)">
            <h2 class="has-text-weight-bold">
              Creá tu tienda
            </h2>
            <p>Completá este breve formulario y te enviaremos un correo con un enlace para que empieces a cargar y configurar tu tienda sin necesidad de iniciar sesión.</p>
            <form class="form is-margin-top" @submit.prevent="submit">
              <div class="columns">
                <div class="column">
                  <b-notification :type="'is-' + shopNameStatus.status + ' is-light'" aria-close-label="Close notification" v-show="shopNameStatus.message">
                    <span class="has-text-weight-bold" v-html="shopNameStatus.message"></span>
                  </b-notification>
                  <div class="control">
                    <b-field label="Nombre de tu marca" expanded>
                      <div class="control" :class="{ 'is-loading': checkingStatus }">
                        <input v-model="form.shop" ref="autofocus" type="text" class="input" placeholder="Delicity" @keyup="checkShopTitle" :disabled="isLoading" required />
                      </div>
                    </b-field>
                  </div>
                  <div class="control">
                    <b-field label="Tu email" expanded>
                      <b-input v-model="form.email" type="email" placeholder="juanmanuel@gmail.com" :disabled="isLoading" required />
                    </b-field>
                  </div>
                  <div class="control">
                    <b-field label="Creá tu contraseña" message="Creá una nueva contraseña exclusiva para geotiendas" expanded>
                      <b-input v-model="form.password" type="password" placeholder="********" :disabled="isLoading" password-reveal></b-input>
                    </b-field>
                  </div>
                </div>
                <div class="column is-hidden-mobile">
                  <div class="has-text-centered is-vpadded">
                    <img src="/img/art/team.svg" width="320"/>
                  </div>
                </div>
              </div>
              <div class="buttons is-flex-center">
                <b-button native-type="submit" type="is-info" :loading="isLoading">
                  <span v-show="!form.shop.length" class="has-text-weight-bold"> Crear mi tienda</span>
                  <span v-show="form.shop.length" class="has-text-weight-bold"> Crear tienda <i>{{ form.shop }}</i></span>
                </b-button>
              </div>
            </form>
          </div>
        </card-component>
        <div class="buttons is-flex-center">
          <b-button icon-left="backspace" @click="goBack()">
            <span class="">Volver</span>
          </b-button>
          <a :href="$store.state.panel" class="button" target="_blank">
            <span class="has-text-weight-bold">Ya tengo una tienda</span>
          </a>
          <a :href="$store.state.panel + '/olvide-contrasena'" class="button" target="_blank">
            <span class="has-text-weight-bold">Olvidé mi contraseña</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'shop_create',
  components: {
    CardComponent
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  data () {
    return {
      form: {
        shop: '',
        country_iso: '',
        country: ''
      },
      allowedCountries: ['es-AR'],
      clock: 0,
      isLoading: false,
      shopLoading: false,
      checkingStatus: false,
      shopNameStatus: {},
      lastId: null,
      shopNameVars: {
        min: 3,
        max: 16
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.$refs.autofocus.focus()
    })
    if (this.basic.locale) {
      this.form.country_iso = this.basic.locale.country_iso
      this.form.country = this.basic.locale.country
    }
    if (this.$route.params.name) {
      this.form.shop = this.$route.params.name
      this.checkShopTitle()
    }
  },
  methods: {
    checkShopTitle () {
      if (this.clock) {
        clearInterval(this.clock)
      }
      this.clock = setTimeout(() => {
        this.form.id = this.form.shop.normalize('NFKD').replace(/[^\w]|_/g, '').toLowerCase()
        this.checkshopNameStatus()
      }, 1000)
    },
    checkshopNameStatus () {
      if (this.lastId !== this.form.id) {
        this.shopNameStatus = {}
        this.checkingStatus = true
        this.lastId = this.form.id
        if (this.form.id.length < this.shopNameVars.min || this.form.id.length > this.shopNameVars.max) {
          this.shopNameStatus = {
            status: 'danger',
            message: `El nombre de la geotienda debe tener al menos ${this.shopNameVars.min} y máximo ${this.shopNameVars.max} caracteres. ${this.form.id} contiene ${this.form.id.length}`
          }
          this.checkingStatus = false
        } else {
          axios.post('/shops/checkname', { id: this.form.id }).then(res => {
            this.shopNameStatus = res.data
            this.checkingStatus = false
          })
        }
      }
    },
    submit () {
      if (!this.allowedCountries.includes(this.form.country_iso)) {
        return this.$buefy.toast.open({
          message: `Lamentablemente todavía no tenemos presencia en tu país ${this.form.country}. Tal vez dentro de poco, mantente informado acerca de nuestras novedades.`,
          duration: 15000
        })
      }
      if (this.shopNameStatus.status !== 'success') {
        this.shopNameStatus = {}
        return this.$buefy.toast.open({
          message: `Revisá el usuario de la tienda y volvé a intentar`
        })
      }
      this.isLoading = true
      axios.post(`/shops/create`, this.form).then(res => {
        if (res.data.status === 'success') {
          // window.fbq('trackCustom', 'shopCreated', this.form)
          localStorage.setItem('shop', JSON.stringify(this.form))
          this.$router.push('/tienda-creada')
        } else {
          this.isLoading = false
          let parts = res.data.message.split('. ')
          parts.forEach(e => {
            this.$buefy.toast.open({
              message: e
            })
          })
        }
      }).catch(err => {
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Hubo un error al crear la geotienda. Por favor, intentá nuevamente en unos instantes. Error: ${err}`
        })
      })
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>
