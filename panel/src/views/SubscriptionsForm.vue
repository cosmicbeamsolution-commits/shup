<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="certificate" size="is-medium"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button ">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component :title="formCardTitle" icon="certificate" class="tile is-child">
        <form>
          <b-field label="Pagado" horizontal>
            <b-switch v-model="form.payment_complete" disabled></b-switch>
          </b-field>
          <hr>
          <b-field label="Concepto" horizontal>
            <b-input v-model="form.subject" disabled />
          </b-field>
          <b-field label="Monto" horizontal>
            <b-input v-model="form.total" disabled />
          </b-field>
          <b-field label="Periodo" horizontal>
            <b-input v-model="form.period" disabled />
          </b-field>
          <b-field label="Creado" horizontal>
            <b-input v-model="form.created" disabled />
          </b-field>
          <b-field label="Expira" horizontal>
            <b-input v-model="form.expires" disabled />
          </b-field>
          <hr>
          <b-field horizontal>
            <b-button type="is-primary" @click="submit">Volver</b-button>
          </b-field>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'SubscriptionsForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar
  },
  props: {
    id: {
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      form: this.getClearFormObject(),
      createdReadable: null,
      isProfileExists: false
    }
  },
  computed: {
    callAction () {
      return {
        link: '/suscripciones',
        icon: 'certificate',
        title: 'Suscripciones'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Suscripción'
      }

      return [
        'Gestor',
        'Suscripciones',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear cuenta'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'cuenta.new' }
        return '/suscripciones'
      } else {
        return '/suscripciones'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Suscripciones'
      } else {
        return 'Suscripciones'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Suscripción'
      } else {
        return 'Suscripción'
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getClearFormObject () {
      return {
        id: null,
        name: null,
        email: null
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/subscriptions/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.form.total += this.form.currency
              } else {
                this.$buefy.toast.open({
                  message: `Esta suscripción no existe`,
                  type: 'is-danger',
                  queue: false
                })
              }
            })
            .catch(e => {
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        }
      }
    },
    input (v) {
      this.createdReadable = moment(v).format('MMM D, Y').toString()
    },
    submit () {
      this.$router.push('/suscripciones')
    }
  },
  watch: {
    id (newValue) {
      this.isProfileExists = false

      if (!newValue) {
        this.form = this.getClearFormObject()
      } else {
        this.getData()
      }
    }
  }
}
</script>
