<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="circle-edit-outline" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component :title="formCardTitle" icon="circle-edit-outline" class="tile is-child">
        <form @submit.prevent="submit">
          <b-field label="Activo" horizontal>
            <b-switch v-model="form.active"></b-switch>
          </b-field>
          <b-field label="Categoría" message="Nombre de Categoría principal" horizontal>
            <b-input placeholder="Actualidad" v-model="form.name" required />
          </b-field>
          <b-field label="URL" message="URL: sin barra, espacios, tildes ni símbolos." horizontal>
            <b-input placeholder="terminos" v-model="form.slug" required />
          </b-field>
          <b-field label="" message="" horizontal>
            <a :href="'https://yacabron.com/blog/' + form.slug" target="_blank"><span v-html="'https://yacabron.com/blog/' + form.slug"/></a>
          </b-field>
          <b-field label="Descripción" message="Describí brevemente la categoría de blog" horizontal>
            <textarea placeholder="Descripción de categoría" class="textarea" v-model="form.text" />
          </b-field>
          <hr>
          <b-field label="Fondo" horizontal>
            <b-field label="">
              <file-picker @fileUploaded="handleFileUploaded"/>
            </b-field>
            <b-field label="">
              <div v-show="form.photo" class="box">
                <img :src="form.photo" :style="form.filtro" />
              </div>
            </b-field>
          </b-field>
          <b-field v-show="form.photo" horizontal>
            <b-field label="Filtro">
            </b-field>
            <b-field label="" horizontal>
              <b-select placeholder="Elegí un filtro para realzar tu foto" v-model="form.filtro">
                <option value="">Ninguno</option>
                <option v-for="(filtro, index) in filters" :key="index" :value="filtro.filter">
                  {{ filtro.name }}
                </option>
              </b-select>
            </b-field>
          </b-field>
          <hr>
          <b-field horizontal>
            <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
          </b-field>
        </form>
      </card-component>
      <hr>
      <card-component class="has-table has-mobile-sort-spaced" title="Entradas" icon="circle-edit-outline">
        <table-component :route-name="'blog'" :route-method="'entries'" :data-pid="$route.params.id" :data-url="'/blog/' + $route.params.id + '/entries'" />
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
export default {
  name: 'BlogForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    TitleBar,
    FilePicker,
    TableComponent
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
      filters: [],
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
        link: '/blog',
        icon: 'circle-edit-outline',
        title: 'Blog'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nueva Categoría'
      }

      return [
        'Admin',
        'Blog',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Categoría'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'subblog.edit', id: this.$route.params.id, sid: 'new' }
        return '/blog/' + this.$route.params.id + '/new'
      } else {
        return '/blog'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Nueva Entrada'
      } else {
        return 'Blog'
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
      this.form.photo = files[0]
    },
    handleImageAdded (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('files', file)
      axios({
        url: '/upload/multi',
        method: 'POST',
        data: formData
      }).then(result => {
        Editor.insertEmbed(cursorLocation, 'image', result.data[0])
        resetUploader()
      }).catch(err => {
        console.log(err)
      })
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        slug: null,
        active: true,
        entries: [],
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/blog/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
              } else {
                this.$router.push({ name: 'blog.new' })
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
      axios.get('/filters').then(res => {
        this.filters = res.data
      })
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
            .post('/blog/' + this.$route.params.id, this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Cateogría actualizada',
                  queue: false
                })
                this.$router.push({ name: 'blog' })
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
            .put('/blog', this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Categoría agregada',
                  queue: false
                })
                this.$router.push({ name: 'blog' })
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
