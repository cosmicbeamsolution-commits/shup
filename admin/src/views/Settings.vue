<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="image-auto-adjust" size="is-medium"/>
      Ajustes
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <form @submit.prevent="submit">
          <div class="tabs is-centered is-boxed">
            <ul>
              <li :class="{ 'is-active': tab === 'main' }">
                <a @click="tab = 'main'">
                  <span class="has-text-weight-semibold">General</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'social' }">
                <a @click="tab = 'social'">
                  <span class="has-text-weight-semibold">Redes</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'bank' }">
                <a @click="tab = 'bank'">
                  <span class="has-text-weight-semibold">Datos bancarios</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'legal' }">
                <a @click="tab = 'legal'">
                  <span class="has-text-weight-semibold">Términos</span>
                </a>
              </li>
            </ul>
          </div>
          <div v-show="tab === 'main'">
            <div class="columns">
              <div class="column">
                <b-field label="Aplicación en Mantenimiento">
                  <b-switch v-model="form.offline"></b-switch>
                </b-field>
                <b-field label="Email">
                  <b-input icon="email" type="email" v-model="form.email" placeholder="E-mail"/>
                </b-field>
                <b-field label="Teléfono">
                  <b-input icon="phone" type="phone" v-model="form.phone" placeholder="011 5777 3322"/>
                </b-field>
                <hr>
                <b-field label="Color principal">
                  <v-swatches v-model="form.themecolor" swatches="text-advanced" show-fallback></v-swatches>
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'social'" class="content">
            <div class="columns">
              <div class="column">
                <b-field v-for="(item, index) in social" :key="index" class="column is-paddingless is-marginless" grouped>
                  <b-field>
                    <b-icon :icon="item.icon" size="is-medium" :class="`is-icon-${item.icon}`" />
                  </b-field>
                  <b-field expanded>
                    <b-input type="text" v-model="item.url" :placeholder="`Cuenta ${item.icon}`"/>
                  </b-field>
                  <b-field v-show="item.showText" expanded>
                    <b-input type="text" v-model="item.text" :placeholder="`Texto ${item.icon}`"/>
                  </b-field>
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'bank'">
            <div class="columns">
              <div class="column">
                <b-field label="Entidad">
                  <b-input placeholder="Banco Santander" v-model="form.bank_entity" />
                </b-field>
                <b-field label="Titular de la cuenta">
                  <b-input placeholder="Juan Manuel Rodríguez" v-model="form.bank_owner" />
                </b-field>
                <b-field label="CBU">
                  <b-input placeholder="0720168088000036018733" v-model="form.bank_cbu" />
                </b-field>
              </div>
              <div class="column">
                <b-field label="Alias">
                  <b-input placeholder="JUAN.MANUEL.RODTRIGUEZ" v-model="form.bank_alias" />
                </b-field>
                <b-field label="Número de la cuenta">
                  <b-input placeholder="000-360187/3" v-model="form.bank_account" />
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'legal'" class="content">
            <div class="columns">
              <div class="column">
                <b-field>
                  <textarea class="textarea" v-model="form.terms" rows="20" placeholder="Términos y condiciones"></textarea>
                </b-field>
              </div>
            </div>
          </div>
          <hr>
          <div class="buttons is-flex-end">
            <b-button type="is-primary" :loading="loading" native-type="submit">Guardar</b-button>
          </div>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import VSwatches from 'vue-swatches'
export default {
  name: 'Settings',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    VSwatches
  },
  data () {
    return {
      tab: 'main',
      loading: false,
      form: {},
      feature: {
        title: '',
        text: '',
        icon: ''
      },
      social: [{
        icon: 'whatsapp',
        showText: true,
        text: '',
        url: null
      }, {
        icon: 'facebook',
        url: null
      }, {
        icon: 'instagram',
        url: null
      }, {
        icon: 'youtube',
        url: null
      }, {
        icon: 'medium',
        url: null
      }, {
        icon: 'twitter',
        url: null
      }, {
        icon: 'twitch',
        url: null
      }],
      payment_methods: []
    }
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  created () {
    this.$store.dispatch('loaded', false)
    axios.get('/settings/5f9300d791a60a67b54a013b').then(res => {
      if (res.data) {
        this.form = res.data
        if (res.data.payment_methods) {
          this.payment_methods = res.data.payment_methods
        }
        if (res.data.social) {
          this.social.map(e => {
            const item = res.data.social.filter(i => i.icon === e.icon)
            if (item[0]) {
              e.url = item[0].url
              e.showText = item[0].showText
              e.text = item[0].text
            }
            return e
          })
        }
      }
      this.$store.dispatch('loaded', true)
    })
  },
  methods: {
    submit () {
      this.loading = true
      this.form.social = this.social.filter(e => e.url).map(e => {
        let str = e.url.split(' ').join('').split('/').reverse()[0].split('?')[0]
        let text = ''
        if (e.text) {
          text = `?text=${encodeURIComponent(e.text)}`
        }
        if (e.icon === 'whatsapp') {
          e.url = `https://wa.me/${str}${text}`
        } else if (e.icon === 'facebook') {
          e.url = `https://facebook.com/${str}${text}`
        } else if (e.icon === 'instagram') {
          e.url = `https://instagram.com/${str}${text}`
        } else if (e.icon === 'youtube') {
          e.url = `https://youtube.com/${str}${text}`
        } else if (e.icon === 'medium') {
          e.url = `https://medium.com/${str}${text}`
        } else if (e.icon === 'twitter') {
          e.url = `https://twitter.com/${str}${text}`
        } else if (e.icon === 'vimeo') {
          e.url = `https://vimeo.com/${str}${text}`
        } else if (e.icon === 'twitch') {
          e.url = `https://twitch.com/${str}${text}`
        }
        return e
      })
      axios.post('/settings/5f9300d791a60a67b54a013b', this.form).then(res => {
        this.loading = false
        this.$buefy.toast.open({
          message: `Ajustes actualizados`,
          type: 'is-success',
          queue: false
        })
      })
    }
  }
}
</script>
