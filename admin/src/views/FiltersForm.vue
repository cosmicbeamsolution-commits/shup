<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="flask-plus-outline" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <card-component :title="formCardTitle" icon="flask-plus-outline" class="tile is-child">
          <form @submit.prevent="submit">
            <b-field label="Activo" horizontal>
              <b-switch v-model="form.active"></b-switch>
            </b-field>
            <hr>
            <b-field label="Título" message="Título del filtro" horizontal>
              <b-input placeholder="Blanco y negro" v-model="form.name" ref="autofocus" />
            </b-field>
            <hr>
            <b-field label="">
              <b-field label="" >
                <file-picker @fileUploaded="handleFileUploaded"/>
              </b-field>
            </b-field>
            <div class="columns">
              <div class="column">
                <b-field v-for="(filter, index) in filterList" :key="index">
                  <b-field v-if="filter.type === '%'" :label="filter.title" horizontal>
                    <b-slider @input="updateFilters" v-model="form[filter.name]" :min="0" :max="200"></b-slider>
                  </b-field>
                  <b-field v-if="filter.type === 'px'" :label="filter.title" horizontal>
                    <b-slider @input="updateFilters" v-model="form[filter.name]" :min="0" :max="10" ticks></b-slider>
                  </b-field>
                  <b-field v-if="filter.type === ''" :label="filter.title" horizontal>
                    <b-slider @input="updateFilters" v-model="form[filter.name]" :step="0.1" :min="0" :max="1"></b-slider>
                  </b-field>
                  <b-field v-if="filter.type === 'deg'" :label="filter.title" horizontal>
                    <b-slider @input="updateFilters" v-model="form[filter.name]" :min="0" :max="359"></b-slider>
                  </b-field>
                </b-field>
              </div>
              <div class="column">
                <div class="box">
                  <img v-show="form.photo" :src="form.photo" :style="form.filter" />
                  <img v-show="!form.photo" src="/img/placeholder/filters.jpeg" :style="form.filter" />
                </div>
              </div>
            </div>
            <hr>
            <b-field horizontal>
              <b-field grouped>
                <div class="control">
                  <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
                </div>
                <div class="control">
                  <b-button type="is-primary is-outlined" @click="reset">Resetear</b-button>
                </div>
              </b-field>
            </b-field>
          </form>
        </card-component>
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
import FilePicker from '@/components/FilePicker'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'FiltersForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    Tiles,
    HeroBar,
    FilePicker,
    TitleBar
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
      filterList: [
        {
          name: 'blur',
          title: 'Difuminado',
          type: 'px'
        },
        {
          name: 'brightness',
          title: 'Brillo',
          type: '%'
        },
        {
          name: 'contrast',
          title: 'Contraste',
          type: '%'
        },
        {
          name: 'grayscale',
          title: 'Escala grises',
          type: '%'
        },
        {
          name: 'hue-rotate',
          title: 'Hue',
          type: 'deg'
        },
        {
          name: 'invert',
          title: 'Invertir',
          type: '%'
        },
        {
          name: 'opacity',
          title: 'Opacidad',
          type: '%'
        },
        {
          name: 'saturate',
          title: 'Saturado',
          type: '%'
        },
        {
          name: 'sepia',
          title: 'Sepia',
          type: '%'
        }
      ],
      isLoading: false,
      htmlForEditor: '',
      form: this.getClearFormObject(),
      createdReadable: null,
      isProfileExists: false
    }
  },
  computed: {
    callAction () {
      return {
        link: '/filters',
        icon: 'flask-plus-outline',
        title: 'Filtros'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nuevo Filtro'
      }

      return [
        'Admin',
        'Filtros',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Filtro'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'filters.new' }
        return '/filters'
      } else {
        return '/filters'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Filtros'
      } else {
        return 'Filtros'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Filtro'
      } else {
        return 'Nueva Filtro'
      }
    }
  },
  created () {
    this.getData()
    setTimeout(() => {
      this.$refs.autofocus.focus()
    }, 1000)
  },
  methods: {
    reset: function () {
      this.filterList.map(e => {
        this.form[e.name] = 0
      })
    },
    updateFilters: function () {
      let cssfilter = []
      for (var i in this.form) {
        if (this.form[i]) {
          var type = this.filterList.filter(e => {
            if (e.name === i) {
              return e.type
            }
          })
          if (type.length) {
            let op = type[0].type
            cssfilter.push(i + '(' + this.form[i] + op + ')')
          }
        }
      }
      this.form.filter = 'filter: ' + cssfilter.join(' ')
    },
    handleFileUploaded: function (files) {
      this.form.photo = files[0]
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        filter: null,
        photo: null,
        active: true,
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/filters/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.form.created_date = new Date(item.created)
                this.createdReadable = moment(new Date(item.created)).format('MMM D, Y').toString()
              } else {
                this.$router.push({ name: 'filters.new' })
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
            .post('/filters/' + this.$route.params.id, this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Filtro actualizada',
                  queue: false
                })
                this.$router.push({ name: 'filters' })
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
            .put('/filters', this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Filtro agregado',
                  queue: false
                })
                this.$router.push({ name: 'filters' })
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
