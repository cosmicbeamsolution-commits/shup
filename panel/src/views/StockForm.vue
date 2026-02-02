<template>
  <div>
    <nav-bar/>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObjectName"
      @confirm="trashConfirm"
      @cancel="trashCancel"/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="tray-full" size="is-medium"/>
      {{ heroTitle }}
      <div class="buttons" slot="right">
        <router-link to="/catalogo" class="button ">
          <b-icon icon="tray-full"/>
          <span>Catálogo</span>
        </router-link>
        <router-link :to="heroRouterLinkTo" class="button ">
          <b-icon icon="tray"/>
          <span>{{ heroRouterLinkLabel }}</span>
        </router-link>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="tile is-child">
        <form @submit.prevent="submit">
          <b-field label="Visible" horizontal>
            <b-switch v-model="form.active"></b-switch>
          </b-field>
          <hr>
          <b-field label="Nombre" message="Nombre de la categoría" horizontal>
            <b-input placeholder="Ensaladas" v-model="form.name" required />
          </b-field>
          <b-field label="Descripción" message="Descripción de la categoría" horizontal>
            <b-input placeholder="Ensaladas exclusivas con productos orgánicos" v-model="form.text" />
          </b-field>
          <hr>
          <div class="buttons is-flex-end">
            <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
          </div>
        </form>
      </card-component>
      <hr>
      <card-component class="has-table has-mobile-sort-spaced" title="Ítems" icon="tray-full">
        <table-component :route-name="'stock'" :route-method="'items'" :data-pid="$route.params.id" :data-url="'/stock/' + $route.params.id + '/items'" data-empty-div=".stock-empty" />
        <div class="stock-empty is-hidden is-padded animated fadeIn delay">
          <div class="has-text-centered content">
            <img src="/img/art/tech-advise.svg" width="320" />
            <h3>Creá al menos un ítem para publicar esta categoría</h3>
            <p>Puede ser un producto o un servicio, si ofrecés servicios específicos podés establecer tu ítem como cotizable y así podrás obtener información de tu cliente para fijar el precio.</p>
            <div class="buttons is-centered">
              <router-link to="/catalogo/new" class="button is-success">Crear ítem en esta categoría</router-link>
            </div>
          </div>
        </div>
      </card-component>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import TableComponent from '@/components/TableComponent'
import CardComponent from '@/components/CardComponent'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'CategoríasForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    TableComponent,
    ModalBox
  },
  props: {
    id: {
      default: null
    }
  },
  data () {
    return {
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      isModalActive: false,
      isLoading: false,
      htmlForEditor: '',
      form: this.getClearFormObject(),
      createdReadable: null,
      isProfileExists: false
    }
  },
  computed: {
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject
      }

      return null
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Nueva Categoría'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Nuevo Ítem'
      } else {
        return 'Items'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'substock.edit', id: this.$route.params.id, sid: 'new' }
        return '/catalogo/' + this.$route.params.id + '/new'
      } else {
        return '/catalogo'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Categoría'
      } else {
        return 'Nueva Categoría'
      }
    },
    ...mapState([
      'basic',
      'shop'
    ])
  },
  created () {
    this.getData()
  },
  methods: {
    handleFileUploaded (files) {
      this.$set(this.form, 'photo', files[0])
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      axios
        .post(['upload', 'delete'].join('/'), {
          files: [this.trashObject]
        }).then(res => {
          this.isLoading = false
          this.form.photo = null
        })
    },
    trashCancel () {
      this.isModalActive = false
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        active: true,
        items: [],
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/stock/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
              } else {
                this.$router.push({ name: 'stock.new' })
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
      this.form.shop = this.shop._id
      setTimeout(() => {
        this.isLoading = false
        if (this.$route.params.id !== 'new') {
          axios
            .post('/stock/' + this.$route.params.id, this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Catálogo actualizado',
                  queue: false
                })
                this.$router.push({ name: 'stock' })
              }
            })
            .catch(e => {
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        } else {
          axios
            .put('/stock', this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Categoría agregada',
                  queue: false
                })
                this.$router.push({ name: 'stock' })
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
