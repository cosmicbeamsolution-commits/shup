<template>
  <div>
    <nav-bar/>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="food" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <notification class="is-info">
        <div>
          <span>Estás editando un producto en <strong v-html="form.product"></strong></span>
        </div>
      </notification>
      <tiles>
        <card-component :title="formCardTitle" icon="textbox" class="tile is-child">
          <form @submit.prevent="submit">
            <b-field label="Activo" horizontal>
              <b-switch v-model="form.active"></b-switch>
            </b-field>
            <hr>
            <b-field label="Destacado" horizontal>
              <b-switch v-model="form.featured"></b-switch>
            </b-field>
            <hr>
            <!--b-field label="ID" horizontal>
              <b-input v-model="form._id" custom-class="is-static" readonly />
            </b-field-->
            <b-field label="Nombre" message="Nombre del product" horizontal>
              <b-input placeholder="Enslada otomana" v-model="form.name" required />
            </b-field>
            <b-field label="Descripción" message="Descripción del product" horizontal>
              <b-input placeholder="Cherry, dátiles, ciruelas, nueces" v-model="form.text" />
            </b-field>
            <b-field label="Precio" message="Precio final IVA incluído" horizontal>
              <b-numberinput v-model="form.price" controls-position="compact" controls-rounded></b-numberinput>
            </b-field>
            <b-field label="Foto" horizontal>
              <b-field label="">
                <file-picker @fileUploaded="handleFileUploaded"/>
              </b-field>
              <b-field label="">
                <div v-show="form.photo" class="box photo-box has-text-right">
                  <button class="button is-large is-text" type="button" @click.prevent="trashModal(form.photo)">
                    <b-icon class="has-text-danger" icon="close" size="is-small"/>
                  </button>
                  <img :src="form.photo" :style="form.filtro" />
                </div>
              </b-field>
            </b-field>
            <hr>
            <b-field horizontal>
              <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
            </b-field>
          </form>
        </card-component>
        <!--card-component class="has-table has-mobile-sort-spaced" title="Subcategorías" icon="account-multiple">
          <table-component :route-name="'proveedor'" :data-url="'/stock/' + this.$route.params.id + '/sub'"/>
        </card-component-->
      </tiles>
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
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
// import FilePicker from '@/components/FilePicker'
// import UserAvatar from '@/components/UserAvatar'
import Notification from '@/components/Notification'
import FilePicker from '@/components/FilePicker'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'StockSubForm',
  components: {
    NavBar,
    AsideMenu,
    // UserAvatar,
    // FilePicker,
    ModalBox,
    FilePicker,
    CardComponent,
    Tiles,
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
    callAction () {
      return {
        link: '/stock',
        icon: 'account-badge',
        title: 'Categorías'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nuevo Producto'
      }

      return [
        'Admin',
        'Categorías',
        this.form.product,
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Producto'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'substock.new' }
        return '/stock/' + this.$route.params.id
      } else {
        return '/stock/' + this.$route.params.id
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return this.form.product
      } else {
        return this.form.product
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Producto'
      } else {
        return 'Nuevo Producto'
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleFileUploaded (files) {
      this.$set(this.form, 'photo', files[0])
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        product: null,
        active: true,
        created: new Date()
      }
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
    getData () {
      if (this.$route.params.sid) {
        if (this.$route.params.sid !== 'new') {
          axios
            .get(['stock', this.$route.params.id, 'products', this.$route.params.sid].join('/'))
            .then(res => {
              let item = res.data.products
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.form.product = res.data.name
              } else {
                this.$router.push({ name: 'substock.new' })
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
            .get(['stock', this.$route.params.id].join('/'))
            .then(res => {
              let item = res.data
              this.isProfileExists = false
              if (item) {
                this.form.product = item.name
              } else {
                this.$router.push({ name: 'substock.new' })
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
      delete this.form.product
      setTimeout(() => {
        this.isLoading = false
        if (this.$route.params.sid !== 'new') {
          axios
            .post(['stock', this.$route.params.id, 'products', this.$route.params.sid].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Producto actualizado',
                  queue: false
                })
                this.$router.push({ name: 'stock.edit', id: this.$route.params.id })
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
            .put(['stock', this.$route.params.id, 'products'].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Producto agregado',
                  queue: false
                })
                this.$router.push({ name: 'stock.edit', id: this.$route.params.id })
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
