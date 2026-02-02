<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="image-auto-adjust" size="is-medium"/>
      <span> Ajustes</span>
      <router-link slot="right" to="/" class="button">
        Escritorio
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <form @submit.prevent="submit">
          <b-field label="Datos básicos" horizontal>
            <b-field label="Aplicación en Mantenimiento">
              <b-switch v-model="form.offline"></b-switch>
            </b-field>
          </b-field>
          <b-field horizontal>
            <b-field label="Email">
              <b-input icon="email" type="email" v-model="form.email" placeholder="E-mail"/>
            </b-field>
          </b-field>
          <b-field horizontal>
            <b-field label="Teléfono">
              <b-input icon="phone" type="phone" v-model="form.phone" placeholder="011 5777 3322"/>
            </b-field>
          </b-field>
          <hr>
          <b-field label="Tema" horizontal>
            <b-field label="Color principal">
              <v-swatches v-model="form.themecolor" swatches="text-advanced" show-fallback></v-swatches>
            </b-field>
          </b-field>
          <hr>
          <b-field label="Redes sociales" horizontal grouped>
            <div class="control">
              <b-field v-for="(item, index) in social" :key="index" class="column" grouped>
                <b-field>
                  <b-icon :icon="item.icon" size="is-medium" :class="`is-icon-${item.icon}`" />
                </b-field>
                <b-field expanded>
                  <b-input type="text" v-model="item.url" :placeholder="`URL ${item.icon}`"/>
                </b-field>
                <b-field v-show="item.showText" expanded>
                  <b-input type="text" v-model="item.text" :placeholder="`Texto ${item.icon}`"/>
                </b-field>
              </b-field>
            </div>
          </b-field>
          <hr>
          <b-field horizontal>
            <b-field grouped>
              <div class="control">
                <b-button native-type="submit" type="is-primary" :loading="isLoading">Guardar</b-button>
              </div>
            </b-field>
          </b-field>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import mapValues from 'lodash/mapValues'
import HeroBar from '@/components/HeroBar'
import VSwatches from 'vue-swatches'
export default {
  name: 'Application',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    VSwatches
  },
  data () {
    return {
      isLoading: false,
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
      form: {}
    }
  },
  created: function () {
    this.isLoading = true
    axios
      .get('/application/5e51b6a1fd6e0852066abe97')
      .then(res => {
        this.isLoading = false
        let item = res.data
        if (item) {
          this.form = item
        }
        if (item.social) {
          this.social = item.social
        }
      })
      .catch(e => {
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error: ${e.message}`,
          type: 'is-danger',
          queue: false
        })
      })
  },
  methods: {
    submit () {
      this.isLoading = true
      this.form.social = this.social.map(e => {
        if (!e.url || e.url.indexOf('http') > -1) {
          return e
        }
        let str = e.url.split(' ').join('')
        if (e.icon === 'whatsapp') {
          e.url = `https://wa.me/${str}`
        } else if (e.icon === 'facebook') {
          e.url = `https://facebook.com/${str}`
        } else if (e.icon === 'instagram') {
          e.url = `https://instagram.com/${str}`
        } else if (e.icon === 'youtube') {
          e.url = `https://youtube.com/${str}`
        } else if (e.icon === 'medium') {
          e.url = `https://medium.com/${str}`
        } else if (e.icon === 'twitter') {
          e.url = `https://twitter.com/${str}`
        } else if (e.icon === 'vimeo') {
          e.url = `https://vimeo.com/${str}`
        } else if (e.icon === 'twitch') {
          e.url = `https://twitch.com/${str}`
        }
        return e
      })
      axios
        .post('/application/5e51b6a1fd6e0852066abe97', this.form)
        .then(res => {
          this.isLoading = false
          let item = res.data
          if (item) {
            document.documentElement.style.setProperty('--themecolor', this.form.themecolor)
            this.$buefy.toast.open({
              message: `La configuración fue actualizada`,
              type: 'is-success',
              queue: false
            })
            // this.$router.push({ name: 'home' })
          }
        })
        .catch(e => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger',
            queue: false
          })
        })
    },
    reset () {
      this.form = mapValues(this.form, item => {
        if (item && typeof item === 'object') {
          return []
        }
        return null
      })

      this.$buefy.snackbar.open({
        message: 'Reset successfully',
        queue: false
      })
    }
  }
}
</script>
