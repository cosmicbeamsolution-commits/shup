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
      <notification v-show="$route.params.sid" class="is-info">
        <div>
          <span>Estás editando una entrada en <strong v-html="cat"></strong></span>
        </div>
      </notification>
      <card-component :title="formCardTitle" icon="circle-edit-outline" class="tile is-child">
        <form @submit.prevent="submit">
          <b-field label="Activo" horizontal>
            <b-switch v-model="form.active"></b-switch>
          </b-field>
          <hr>
          <!--b-field label="ID" horizontal>
            <b-input v-model="form._id" custom-class="is-static" readonly />
          </b-field-->
          <b-field label="Nombre" message="Nombre de la entrada" horizontal>
            <b-input placeholder="Así empezó nuestro proyecto" v-model="form.name" required />
          </b-field>
          <b-field label="URL" message="URL: sin barra, espacios, tildes ni símbolos." horizontal>
            <b-input placeholder="/asi-empezo" v-model="form.slug" required />
          </b-field>
          <b-field label="" horizontal>
            <a :href="'https://yacabron.com/blog' + cat_slug + '/' + form.slug" target="_blank"><span v-html="'https://yacabron.com/blog/' + cat_slug + '/' + form.slug"/></a>
          </b-field>
          <b-field label="Descripción" message="Describí brevemente la entrada de blog" horizontal>
            <textarea placeholder="Descripción de la entrada" class="textarea" v-model="form.text" />
          </b-field>
          <vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="form.content"> </vue-editor>
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
import FilePicker from '@/components/FilePicker'
import { VueEditor } from 'vue2-editor'
import Notification from '@/components/Notification'
export default {
  name: 'BlogSubForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    TitleBar,
    Notification,
    FilePicker,
    VueEditor
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
      cat: null,
      cat_slug: null,
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
        lastCrumb = 'Nueva Localidad'
      }

      return [
        'Admin',
        'Blog',
        this.cat,
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Nueva Entrada'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'subblog.new' }
        return '/blog/' + this.$route.params.id
      } else {
        return '/blog/' + this.$route.params.id
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return this.cat
      } else {
        return this.cat
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Entrada'
      } else {
        return 'Nueva Entrada'
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleFileUploaded: function (files) {
      this.form.photo = files[0]
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
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
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.sid) {
        if (this.$route.params.sid !== 'new') {
          axios
            .get(['blog', this.$route.params.id, 'entries', this.$route.params.sid].join('/'))
            .then(res => {
              let item = res.data.entries
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.cat = res.data.name
                this.cat_slug = res.data.slug
              } else {
                this.$router.push({ name: 'subblog.new' })
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
            .get(['blog', this.$route.params.id].join('/'))
            .then(res => {
              let item = res.data
              this.isProfileExists = false
              if (item) {
                this.cat = item.name
                this.cat_slug = item.slug
              } else {
                this.$router.push({ name: 'subblog.new' })
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
        if (this.$route.params.sid !== 'new') {
          axios
            .post(['blog', this.$route.params.id, 'entries', this.$route.params.sid].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Entrada actualizada',
                  queue: false
                })
                this.$router.push({ name: 'blog.edit', id: this.$route.params.id })
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
            .put(['blog', this.$route.params.id, 'entries'].join('/'), this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Entrada agregada',
                  queue: false
                })
                this.$router.push({ name: 'blog.edit', id: this.$route.params.id })
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
