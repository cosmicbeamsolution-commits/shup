<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="account-star" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button ">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <notification v-show="$route.params.id === 'new'" class="is-info">
        <div>
          <span>Se enviará un email con datos de acceso al cuenta.</span>
        </div>
      </notification>
      <card-component :title="formCardTitle" icon="account-star" class="tile is-child">
        <form @submit.prevent="submit">
          <b-field v-show="$route.params.id !== 'new'" label="ID" horizontal>
            <b-input v-model="form._id" custom-class="is-static" readonly />
          </b-field>
          <hr>
          <b-field label="Visible" horizontal>
            <b-switch v-model="form.active"></b-switch>
          </b-field>
          <hr>
          <b-field label="Nombre" horizontal>
            <b-input placeholder="e.g. John Doe" v-model="form.name" required />
          </b-field>
          <b-field label="Email" horizontal>
            <b-input placeholder="user@gmail.com" v-model="form.email" required />
          </b-field>
          <hr>
          <b-field horizontal>
            <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
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
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
import Notification from '@/components/Notification'

export default {
  name: 'AccountsForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    TitleBar,
    Notification
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
        link: '/accounts',
        icon: 'account-star',
        title: 'Cuentas'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nueva cuenta'
      }

      return [
        'Gestor',
        'Cuentas',
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
        return '/accounts'
      } else {
        return '/accounts'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Cuentas'
      } else {
        return 'Cuentas'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar cuenta'
      } else {
        return 'Nuevo cuenta'
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
            .get('/accounts/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
              } else {
                this.$router.push({ name: 'accounts.new' })
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
      this.isLoading = true
      setTimeout(() => {
        if (this.$route.params.id !== 'new') {
          axios
            .post('/accounts/' + this.$route.params.id, this.form)
            .then(res => {
              this.isLoading = false
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Cuenta actualizada',
                  queue: false
                })
                this.$router.push({ name: 'accounts' })
              }
            })
            .catch(e => {
              this.isLoading = false
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        } else {
          axios
            .post('/admin/create_account', this.form)
            .then(res => {
              this.isLoading = false
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Cuenta agregada. Se envió un email con datos de acceso.',
                  queue: false
                })
                this.$router.push({ name: 'accounts' })
              }
            })
            .catch(e => {
              this.isLoading = false
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        }
      }, 500)
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
