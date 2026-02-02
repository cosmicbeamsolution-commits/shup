<template>
  <div>
    <nav-bar/>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <!--b-icon icon="clipboard-text-multiple-outline" size="is-large"/-->
      <b-icon icon="checkbox-blank-circle" size="is-large" :style="`color: ${form.hexcolor}`"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="tile is-child">
        <form @submit.prevent="submit">
          <b-field label="Activo" horizontal>
            <b-switch v-model="form.active"></b-switch>
          </b-field>
          <hr>
          <b-field label="Nombre" message="Nombre de la categoría" horizontal>
            <b-input placeholder="Fotografía" v-model="form.name" required />
          </b-field>
          <b-field label="Descripción" message="Descripción de la categoría" horizontal>
            <b-input placeholder="2 tostadas vegetarianas. (cherrys, dátiles, ciruelas, nueces)" v-model="form.text" />
          </b-field>
          <b-field label="Color" message="Color hexadecimal" horizontal>
            <v-swatches v-model="form.hexcolor" swatches="text-advanced" show-fallback></v-swatches>
          </b-field>
          <hr>
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
      <hr>
      <card-component class="has-table has-mobile-sort-spaced" title="Productos" icon="food">
        <table-component :route-name="'stock'" :route-method="'products'" :data-pid="$route.params.id" :data-url="'/stock/' + $route.params.id + '/products'" />
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
import TableComponent from '@/components/TableComponent'
import CardComponent from '@/components/CardComponent'
import FilePicker from '@/components/FilePicker'
import ModalBox from '@/components/ModalBox'
import VSwatches from 'vue-swatches'
export default {
  name: 'RubrosForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    TitleBar,
    TableComponent,
    FilePicker,
    ModalBox,
    VSwatches
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
        icon: 'food',
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
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Nueva Categoría'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'substock.edit', id: this.$route.params.id, sid: 'new' }
        return '/stock/' + this.$route.params.id + '/new'
      } else {
        return '/stock'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Nuevo Producto'
      } else {
        return 'Productos'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Categoría'
      } else {
        return 'Nueva Categoría'
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
        products: [],
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

      setTimeout(() => {
        this.isLoading = false
        if (this.$route.params.id !== 'new') {
          axios
            .post('/stock/' + this.$route.params.id, this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Rubro actualizada',
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
                  message: 'Rubro agregada',
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
