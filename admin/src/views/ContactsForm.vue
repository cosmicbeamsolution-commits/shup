<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="email" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component v-if="isProfileExists" class="tile is-child">
        <b-field label="Datos personales"  horizontal>
          <b-field label="Nombre">
            <b-input :value="form.name" custom-class="is-static" readonly/>
          </b-field>
          <b-field label="Email">
            <b-input :value="form.email" custom-class="is-static" readonly/>
          </b-field>
          <b-field label="Telefono">
            <b-input :value="form.phone" custom-class="is-static" readonly/>
          </b-field>
        </b-field>
        <hr>
        <b-field label="Datos de la empresa" horizontal>
          <b-field label="Empresa">
            <b-input :value="form.company" custom-class="is-static" readonly/>
          </b-field>
          <b-field v-show="form.website" label="Website">
            <b-input :value="form.website" custom-class="is-static" readonly/>
          </b-field>
        </b-field>
        <hr>
        <b-field label="Datos adicionales" horizontal>
          <b-field v-show="form.comments" label="Mensaje">
            <p>{{form.comments}}</p>
          </b-field>
          <b-field label="Creado">
            <b-input :value="form.created | fromNow" custom-class="is-static" readonly/>
          </b-field>
        </b-field>
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
// import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
// import FilePicker from '@/components/FilePicker'
// import Notification from '@/components/Notification'

export default {
  name: 'ContactsForm',
  components: {
    NavBar,
    AsideMenu,
    // FilePicker,
    CardComponent,
    // Tiles,
    HeroBar,
    TitleBar
    // Notification
  },
  props: {
    id: {
      default: null
    }
  },
  data () {
    return {
      section: null,
      isLoading: false,
      form: this.getClearFormObject(),
      createdReadable: null,
      isProfileExists: false
    }
  },
  computed: {
    callAction () {
      return {
        link: '/contacts',
        icon: 'view-list',
        title: 'Consultas'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nuevo Consulta'
      }

      return [
        'Admin',
        'Consultas',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Consultas'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'consulta.new' }
        return '/contacts'
      } else {
        return '/contacts'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Consultas'
      } else {
        return 'Consultas'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Consultas'
      } else {
        return 'Consultas'
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        email: null,
        phone: null,
        company: null,
        website: null,
        comments: null,
        created: null
      }
    },
    getData () {
      if (this.$route.params.id) {
        axios
          .get(['contacts', this.$route.params.id].join('/'))
          .then(r => {
            const item = r.data

            if (item) {
              this.isProfileExists = true
              this.form = item
            } else {
              // this.$router.push({ name: 'consulta.new' })
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
    },
    input (v) {
      this.createdReadable = moment(v).format('MMM D, Y').toString()
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
