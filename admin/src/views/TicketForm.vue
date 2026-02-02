<template>
  <div>
    <nav-bar/>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="headset" size="is-medium"/>
      {{ heroTitle }}
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="tile is-child">
        <form @submit.prevent="submit">
          <b-field label="Abierto" horizontal>
            <b-switch v-model="form.open"></b-switch>
          </b-field>
          <b-button v-show="!form.open" type="is-success" :loading="saving" @click="close">Declarar como resuelto</b-button>
          <hr>
          <b-field label="Área de gestión">
            <b-select placeholder="Cateogría" v-model="form.department" :disabled="$route.params.id !== 'new'" required>
              <option v-for="(item, index) in departments" :key="index" :value="item">
                {{ item }}
              </option>
            </b-select>
          </b-field>
          <hr>
          <b-field label="¿Cuál es el problema?" message="Descripción breve del reclamo">
            <b-input placeholder="No puedo subir una foto" v-model="form.name" :disabled="$route.params.id !== 'new'" required />
          </b-field>
          <b-field label="Describí de qué se trata tu reclamo">
            <textarea class="textarea is-rows-condensed" v-model="form.text" :disabled="$route.params.id !== 'new'" placeholder="Cuando voy a catálogo no puedo subir fotos, me dice que el tamaño no es correcto" required />
          </b-field>
          <hr>
          <b-field label="Adjunto" horizontal>
            <b-field v-show="$route.params.id === 'new'" label="">
              <file-picker @fileUploaded="handleFileUploaded"/>
            </b-field>
            <b-field label="">
              <div v-show="form.photo" class="box photo-box has-text-right">
                <button class="button is-large is-text" type="button" @click.prevent="trashModal(form.photo)">
                  <b-icon class="has-text-danger" icon="close" size="is-small"/>
                </button>
                <img :src="form.photo" />
              </div>
            </b-field>
          </b-field>
          <hr>
          <card-component class="has-table has-mobile-sort-spaced" title="Conversación" icon="account">
            <div v-for="(item, index) in form.conversation" :key="index">
              <div class="column">
                <div class="column" :class="{ 'has-text-right': !item.staff }">
                  <div v-if="!item.staff" class="columns is-vcentered">
                    <div class="column is-narrow">
                      <div class="is-photo " :style="`background-image:url(${item.photo})`"/>
                    </div>
                    <div class="column is-narrow is-paddingless-left">
                      <h6 class="is-flex subtitle">{{ item.name }} </h6>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column">
                      <span class="is-size-7 has-text-grey"><b-icon size="is-small" icon="clock"/> {{ item.created | fromNow }}</span>
                      <p>{{ item.text }}</p>
                      <div v-if="item.attachment" class="is-photo is-large" :style="`background-image:url(${item.attachment})`"/>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
            </div>
          </card-component>
          <hr>
          <b-field label="Tu respuesta">
            <textarea class="textarea is-rows-condensed" v-model="response" placeholder="Escribí tu respuesta acá" required />
          </b-field>
          <b-field label="Adjunto" horizontal>
            <b-field label="">
              <file-picker @fileUploaded="handleConversationFileUploaded"/>
            </b-field>
            <b-field label="">
              <div v-show="conversationPhoto" class="box photo-box has-text-right">
                <div class="is-photo is-large" :style="`background-image:url(${conversationPhoto})`"/>
              </div>
            </b-field>
          </b-field>
          <hr>
          <div class="buttons is-flex-end">
            <b-button type="is-primary" :loading="saving" native-type="submit">Contestar</b-button>
          </div>
        </form>
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
import CardComponent from '@/components/CardComponent'
import FilePicker from '@/components/FilePicker'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'ticket',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar,
    FilePicker,
    ModalBox
  },
  props: {
    id: {
      default: null
    }
  },
  data () {
    return {
      departments: [
        'General',
        'Ventas',
        'Dominios',
        'Departamento Técnico'
      ],
      response: null,
      conversationPhoto: null,
      isModalActive: false,
      saving: false,
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
        link: '/tickets',
        icon: 'headset',
        title: 'Ticket'
      }
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Nuevo ticket'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'subtickets.edit', id: this.$route.params.id, sid: 'new' }
        return '/tickets/' + this.$route.params.id + '/new'
      } else {
        return '/tickets'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Nuevo Ticket'
      } else {
        return 'Tickets'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar ticket'
      } else {
        return 'Nuevo ticket'
      }
    },
    ...mapState([
      'basic',
      'auth'
    ])
  },
  created () {
    this.getData()
  },
  methods: {
    close () {
      this.saving = true
      axios.post(`/tickets/${this.$route.params.id}`, { open: false }).then(res => {
        if (res.data) {
          this.$buefy.snackbar.open({
            message: 'Ticket cerrado',
            queue: false
          })
          this.$router.push({ name: 'tickets' })
        }
      }).catch(e => {
        this.$buefy.toast.open({
          message: `Error: ${e.message}`,
          type: 'is-danger',
          queue: false
        })
      })
    },
    handleFileUploaded (files) {
      this.$set(this.form, 'photo', files[0])
    },
    handleConversationFileUploaded (files) {
      this.conversationPhoto = files[0]
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.saving = true
      this.isModalActive = false
      axios
        .post(['upload', 'delete'].join('/'), {
          files: [this.trashObject]
        }).then(res => {
          this.saving = false
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
        conversation: [],
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/tickets/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
              } else {
                this.$router.push({ name: 'tickets.new' })
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
      this.saving = true
      this.form.conversation.push({
        staff: true,
        name: [this.auth.user.first_name, this.auth.user.last_name].join(' '),
        photo: this.auth.user.photo,
        attachment: this.conversationPhoto,
        text: this.response,
        created: moment().format()
      })
      this.saving = false
      axios.post('/tickets/' + this.$route.params.id, {
        conversation: this.form.conversation,
        answered: true
      }).then(res => {
        if (res.data) {
          this.$buefy.snackbar.open({
            message: 'Ticket contestado',
            queue: false
          })
          this.$router.push({ name: 'tickets' })
        }
      }).catch(e => {
        this.$buefy.toast.open({
          message: `Error: ${e.message}`,
          type: 'is-danger',
          queue: false
        })
      })
    }
  }
}
</script>
