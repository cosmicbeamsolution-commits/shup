<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="square-edit-outline" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <card-component class="tile is-child">
          <form @submit.prevent="submit">
            <b-field label="Activo" horizontal>
              <b-switch v-model="form.active"></b-switch>
            </b-field>
            <hr>
            <b-field label="Header" horizontal>
              <b-switch v-model="form.header"></b-switch>
            </b-field>
            <hr>
            <b-field label="Footer" horizontal>
              <b-switch v-model="form.footer"></b-switch>
            </b-field>
            <hr>
            <b-field label="Título" message="Título de la página" horizontal>
              <b-input placeholder="Términos y condiciones" v-model="form.name" ref="autofocus" />
            </b-field>
            <b-field label="URL" message="URL: Comienza con barra, sin espacios, tildes ni símbolos." horizontal>
              <b-input placeholder="terminos" v-model="form.slug" />
            </b-field>
            <vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="form.content"> </vue-editor>
            <hr>
            <b-field label="Fondo" horizontal>
              <b-field label="">
                <file-picker @fileUploaded="handleFileUploaded"/>
              </b-field>
              <b-field label="">
                <div v-show="form.photo" class="photo-box">
                  <button class="button is-large is-text" type="button" @click.prevent="trashModal(form.photo)">
                    <b-icon class="has-text-danger" icon="close" size="is-small"/>
                  </button>
                  <div class="photo-div" :style="`background-image: url(${form.photo}); background-position: ${form.photoPosition}; background-repeat: ${form.photoRepeat}; background-size: ${form.photoSize}; ${form.photoFilter}`"></div>
                </div>
              </b-field>
            </b-field>
            <b-field v-show="form.photo" grouped>
              <b-field label="Repetición">
                <b-select v-model="form.photoRepeat">
                  <option v-for="(item, index) in photoRepeat" :key="index" :value="item.value">
                    {{ item.name }}
                  </option>
                </b-select>
              </b-field>
              <b-field label="Tamaño">
                <b-select v-model="form.photoSize">
                  <option v-for="(item, index) in photoSize" :key="index" :value="item.value">
                    {{ item.name }}
                  </option>
                </b-select>
              </b-field>
              <b-field label="Posición">
                <b-select v-model="form.photoPosition">
                  <option v-for="(item, index) in photoPosition" :key="index" :value="item.value">
                    {{ item.name }}
                  </option>
                </b-select>
              </b-field>
              <b-field label="Filtro">
                <b-select v-model="form.photoFilter">
                  <option v-for="(item, index) in filters" :key="index" :value="item.filter">
                    {{ item.name }}
                  </option>
                </b-select>
              </b-field>
            </b-field>
            <hr>
            <b-field label="Galería" horizontal>
              <b-field label="">
                <file-picker-multiple @filesUploaded="handleFilesUploaded"/>
              </b-field>
            </b-field>
            <b-field v-show="form.gallery && Object.keys(form.gallery).length" label="">
              <b-field label="">
                <gallery-component @fileDeleted="handleFileDeleted" :data-gallery="form.gallery" :data-filters="filters" :data-extra="true"/>
              </b-field>
            </b-field>
            <!--hr>
            <b-field label="Mensaje especial" horizontal>
              <b-switch v-model="form.especial"></b-switch>
              <div class="notification is-info">
                <span>Si el modo <em>mensaje especial</em> está activado se mostrará esta entrada con un lightbox a la primera carga de la aplicación. Recordá que no está bueno invadir el espacio del usuario sin motivo válido. Usá este modo solo para para información muy importante!</span>
              </div>
            </b-field-->
            <hr>
            <b-field horizontal>
              <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
            </b-field>
          </form>
        </card-component>
      </tiles>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import GalleryComponent from '@/components/GalleryComponent'
import FilePickerMultiple from '@/components/FilePickerMultiple'
import FilePicker from '@/components/FilePicker'
import ModalBox from '@/components/ModalBox'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'PagesForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    GalleryComponent,
    Tiles,
    ModalBox,
    HeroBar,
    TitleBar,
    FilePicker,
    FilePickerMultiple,
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
      isModalActive: false,
      filters: [],
      photoRepeat: [{
        name: 'No repetir',
        value: 'no-repeat'
      }, {
        name: 'Repetir',
        value: 'repeat'
      }, {
        name: 'Ninguno',
        value: null
      }],
      photoSize: [{
        name: 'Contener',
        value: 'contain'
      }, {
        name: 'Cubrir',
        value: 'cover'
      }, {
        name: 'Ninguno',
        value: null
      }],
      photoPosition: [{
        name: 'Centro',
        value: 'center'
      }, {
        name: 'Abajo',
        value: 'bottom'
      }, {
        name: 'Arriba',
        value: 'top'
      }, {
        name: 'Centro Centro',
        value: 'center center'
      }, {
        name: 'Centro Abajo',
        value: 'center left'
      }, {
        name: 'Centro Derecha',
        value: 'center right'
      }, {
        name: 'Abajo Derecha',
        value: 'bottom right'
      }, {
        name: 'Abajo izquierda',
        value: 'bottom left'
      }, {
        name: 'Ninguno',
        value: null
      }],
      isLoading: false,
      htmlForEditor: '',
      form: this.getClearFormObject(),
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
        link: '/pages',
        icon: 'square-edit-outline',
        title: 'Páginas'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nueva Página'
      }

      return [
        'Admin',
        'Páginas',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Página'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'pages.new' }
        return '/pages'
      } else {
        return '/pages'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Páginas'
      } else {
        return 'Páginas'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Página'
      } else {
        return 'Nueva Página'
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
    handleFilesUploaded (data) {
      if (!this.form.gallery) {
        this.form.gallery = []
      }
      data.map(e => {
        this.form.gallery.push({
          src: e
        })
      })
      this.$set(this.form, 'gallery', this.form.gallery)
      axios
        .post(['pages', this.$route.params.id, 'gallery'].join('/'), this.form.gallery)
        .then(r => {
          this.$buefy.toast.open({
            message: `Se guardaron ${data.length} imagen(es) en la galería`,
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            message: `Error: ${err.message}`,
            type: 'is-danger'
          })
        })
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
    handleFileDeleted (data) {
      this.form.gallery = this.form.gallery.filter(e => e.src !== data[0])
    },
    getClearFormObject () {
      return {
        _id: null,
        name: null,
        slug: null,
        active: true,
        gallery: [],
        photoRepeat: null,
        photoFilter: null,
        photoSize: null,
        photoPosition: null,
        photo: null,
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/pages/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
              } else {
                this.$router.push({ name: 'pages.new' })
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
          this.form.name = 'Nueva Página'
          this.form.created = new Date()
          axios
            .put('/pages', this.form)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.$route.params.id = item._id
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
        let filters = res.data
        filters.push({
          name: 'Ninguno',
          filter: ''
        })
        this.filters = filters
      })
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
    submit () {
      this.isLoading = true

      setTimeout(() => {
        this.isLoading = false
        if (this.$route.params.id !== 'new') {
          axios
            .post('/pages/' + this.$route.params.id, this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Página actualizada',
                  queue: false
                })
                // this.$router.push({ name: 'pages' })
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
            .put('/pages', this.form)
            .then(res => {
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Página agregada',
                  queue: false
                })
                this.$router.push({ name: 'pages' })
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
