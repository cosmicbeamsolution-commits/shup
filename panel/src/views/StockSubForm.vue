<template>
  <div>
    <nav-bar/>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="tray" size="is-medium"/>
      {{ heroTitle }}
      <div class="buttons" slot="right">
        <router-link to="/catalogo" class="button">
          <b-icon icon="tray-full"/>
          <span>Catálogo</span>
        </router-link>
        <router-link :to="heroRouterLinkTo" class="button">
          <b-icon icon="tray"/>
          <span>{{ heroRouterLinkLabel }}</span>
        </router-link>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <notification class="is-info">
        <div>
          <span>Estás editando un ítem de catálogo en <strong v-html="form.item"></strong></span>
        </div>
      </notification>
      <tiles>
        <card-component :title="formCardTitle" icon="textbox" class="tile is-child">
          <form @submit.prevent="submit">
            <div class="columns">
              <div class="column">
                <b-field label="Nombre" message="Nombre del ítem" horizontal>
                  <b-input placeholder="Tostada vegetariana" v-model="form.name" required />
                </b-field>
                <b-field label="Descripción" message="Descripción del ítem" horizontal>
                  <textarea class="textarea" placeholder="2 tostadas vegetarianas. (cherrys, dátiles, ciruelas, nueces)" v-model="form.text" />
                </b-field>
                <b-field v-show="shop.type === 'services'" label="¿Se requiere cotización previa para este servicio?">
                  <div class="column">
                    <div class="buttons has-addons is-flex-center">
                      <button type="button" class="button is-light" :class="{ 'is-success': !form.quotable }" @click="form.quotable = false">Precio fijo</button>
                      <button type="button" class="button  is-light" :class="{ 'is-success': form.quotable }" @click="form.quotable = true">Cotizable</button>
                    </div>
                  </div>
                </b-field>
                <b-field v-show="!form.quotable" :label="`Precio (${shop.currency})`" message="Precio final IVA incluído" horizontal>
                  <b-numberinput v-model="form.price" controls-position="compact" controls-rounded></b-numberinput>
                </b-field>
                <b-field v-show="!form.quotable" label="Disponible" message="Cantidad de productos disponibles para esta oferta" horizontal>
                  <b-numberinput v-model="form.stock" controls-position="compact" controls-rounded></b-numberinput>
                </b-field>
              </div>
              <div class="column">
               <b-field label="Visible" message="Establecé la visibilidad de este ítem" horizontal>
                  <b-switch v-model="form.active"></b-switch>
                </b-field>
                <b-field label="Destacado" message="Querés destacar este ítem?" horizontal>
                  <b-switch v-model="form.featured"></b-switch>
                </b-field>
                <b-field label="Imagen" horizontal>
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
              </div>
            </div>
            <hr>
            <div class="buttons is-flex-end">
              <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
            </div>
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
import { mapState } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import Notification from '@/components/Notification'
import FilePicker from '@/components/FilePicker'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'StockSubForm',
  components: {
    NavBar,
    AsideMenu,
    ModalBox,
    FilePicker,
    CardComponent,
    Tiles,
    HeroBar,
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
    ...mapState([
      'shop'
    ]),
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject
      }

      return null
    },
    callAction () {
      return {
        link: '/catalogo',
        icon: 'account-badge',
        title: 'Catálogo'
      }
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Ítem'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'substock.new' }
        return '/catalogo/' + this.$route.params.id
      } else {
        return '/catalogo/' + this.$route.params.id
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return this.form.item
      } else {
        return this.form.item
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Ítem'
      } else {
        return 'Nuevo Ítem'
      }
    }
  },
  created () {
    this.getData()
    if (!this.form.photo) {
      this.form.photo = `${this.$store.state.endpoint}/img/logo.jpg`
    }
  },
  methods: {
    handleFileUploaded (files) {
      this.$set(this.form, 'photo', files[0])
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        item: null,
        price: 0,
        available: 1,
        quotable: false,
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
            .get(['stock', this.$route.params.id, 'items', this.$route.params.sid].join('/'))
            .then(res => {
              let item = res.data.items
              if (item) {
                if (!item.available) {
                  item.available = 1
                }
                if (!item.quotable) {
                  item.quotable = false
                }
                this.isProfileExists = true
                this.form = item
                this.form.item = res.data.name
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
                this.form.item = item.name
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
      delete this.form.item
      if (this.form.quotable) {
        this.form.price = 0
      }
      if (!this.form.photo) {
        this.form.photo = `${this.$store.state.endpoint}/img/logo.jpg`
      }
      setTimeout(() => {
        this.isLoading = false
        if (!this.form.price_history) {
          this.form.price_history = []
        }
        if (!this.form.stock_history) {
          this.form.stock_history = []
        }
        this.form.price_history.push({ created: new Date(), price: this.form.price })
        if (this.$route.params.sid !== 'new') {
          axios
            .post(['stock', this.$route.params.id, 'items', this.$route.params.sid].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: '✔️ Ítem actualizado',
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
            .put(['stock', this.$route.params.id, 'items'].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Ítem agregado',
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
