<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="image-auto-adjust" size="is-medium"/>
      <span> Ajustes</span>
      <!--router-link slot="right" to="/" class="button ">
        Escritorio
      </router-link-->
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <form @submit.prevent="submit">
          <div class="tabs is-centered is-boxed">
            <ul>
              <li :class="{ 'is-active': tab === 'status' }">
                <a @click="tab = 'status'">
                  <span>Estado</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'social' }">
                <a @click="tab = 'social'">
                  <span>Redes</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'scheme' }">
                <a @click="tab = 'scheme'">
                  <span>Diseño</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'domain' }">
                <a @click="tab = 'domain'">
                  <span>Dominio</span>
                </a>
              </li>
            </ul>
          </div>
          <div v-show="tab === 'status'">
            <div class="columns">
              <div class="column content">
                <label class="label">Establecé el estado de tu tienda</label>
                <p>Si todavía no estás seguro sobre si publicar tu catálogo podés desactivar la tienda hasta que estés seguro.</p>
                <hr>
                <b-field label="Tienda no disponible" message="Activá esta opción para deshabilitar temporalmente tu geotienda">
                  <b-switch v-model="offline"></b-switch>
                </b-field>
                <p><a href="https://geotiendas.com/guia/estado" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de estado de la tienda</a></p>
              </div>
            </div>
          </div>
          <div v-show="tab === 'scheme'">
            <div class="columns">
              <div class="column content">
                <label class="label">Ajustes estéticos de tu tienda</label>
                <p>Configurá los colores y la tipografía para que tu tienda se vea como tu marca lo necesita.</p>
                <hr>
                <b-field label="Esquema" horizontal grouped>
                  <b-field label="Color texto">
                    <v-swatches v-model="form.textcolor" swatches="text-advanced" show-fallback></v-swatches>
                  </b-field>
                  <b-field label="Color fondo">
                    <v-swatches v-model="form.themecolor" swatches="text-advanced" show-fallback></v-swatches>
                  </b-field>
                </b-field>
                <b-field label="Tipografía" horizontal grouped>
                  <b-field label="">
                    <b-select placeholder="Tipografía" v-model="form.themefont">
                      <option v-for="(item, index) in fontsAvailable" :key="index" :value="item">
                        {{ item.distro }}
                      </option>
                    </b-select>
                  </b-field>
                </b-field>
                <b-field>
                  <b-button type="is-danger" @click="colorSchemeDefaults">Reestablecer Diseño</b-button>
                </b-field>
                <p> <a href="https://geotiendas.com/guia/esquema" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de ajustes estéticos</a></p>
              </div>
            </div>
          </div>
          <div v-show="tab === 'social'">
            <div class="columns">
              <div class="column content">
                <label class="label">Linkeá tu tienda a tus redes sociales</label>
                <p>Enlazá con tus vías de contacto para obtener una respuesta más directa de tus clientes. </p>
                <hr>
                <b-field v-for="(item, index) in social" :key="index" class="column is-marginless is-paddingless" grouped>
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
                <p><a href="https://geotiendas.com/guia/redes" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de redes sociales</a></p>
              </div>
            </div>
          </div>
          <div v-show="tab === 'domain'">
            <div class="columns">
              <div class="column content">
                <label class="label">Personalizá el dominio de tu tienda</label>
                <p>Para que tu tienda se vea en tu dominio es necesario que actualices los DNS de tu dominio para que apunte a geotiendas.</p>
                <hr>
                <b-field :type="{ 'is-success': this.domain }" expanded>
                  <b-input type="text" v-model="domain" placeholder="Escribe tu dominio ej: dominio.com.ar" icon-right="close-circle" icon-right-clickable @icon-right-click="clearDomain"/>
                </b-field>
                <p><a href="https://geotiendas.com/guia/dominio" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de dominio personalizado</a></p>
              </div>
            </div>
          </div>
          <hr>
          <div class="buttons is-flex-end">
            <b-button native-type="submit" type="is-primary" :loading="saving">Guardar</b-button>
          </div>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
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
      tab: 'status',
      saving: false,
      offline: false,
      domain: null,
      fontsAvailable: [{
        name: 'raleway',
        distro: 'Raleway Regular'
      }, {
        name: 'raleway',
        distro: 'Raleway Light'
      }, {
        name: 'raleway',
        distro: 'Raleway Medium'
      }, {
        name: 'raleway',
        distro: 'Raleway SemiBold'
      }, {
        name: 'raleway',
        distro: 'Raleway Bold'
      }, {
        name: 'raleway',
        distro: 'Raleway ExtraBold'
      }, {
        name: 'raleway',
        distro: 'Raleway Black'
      }, {
        name: 'avenir',
        distro: 'Avenir Light'
      }, {
        name: 'avenir',
        distro: 'Avenir Roman'
      }, {
        name: 'avenir',
        distro: 'Avenir Heavy'
      }, {
        name: 'avenir',
        distro: 'Avenir Medium'
      }, {
        name: 'avenir',
        distro: 'Avenir Black'
      }, {
        name: 'graphik',
        distro: 'Graphik Regular'
      }, {
        name: 'graphik',
        distro: 'Graphik Medium'
      }, {
        name: 'graphik',
        distro: 'Graphik SemiBold'
      }, {
        name: 'graphik',
        distro: 'Graphik Bold'
      }, {
        name: 'helvatica',
        distro: 'Helvetica Neue Ultra light'
      }, {
        name: 'helvatica',
        distro: 'Helvetica Neue light'
      }, {
        name: 'helvatica',
        distro: 'Helvetica Neue Medium'
      }, {
        name: 'helvatica',
        distro: 'Helvetica Neue Heavy'
      }, {
        name: 'dosis',
        distro: 'Dosis Light'
      }, {
        name: 'dosis',
        distro: 'Dosis Regular'
      }, {
        name: 'dosis',
        distro: 'Dosis Medium'
      }, {
        name: 'dosis',
        distro: 'Dosis SemiBold'
      }, {
        name: 'dosis',
        distro: 'Dosis Bold'
      }],
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
      form: {
        textcolor: '#262222',
        themecolor: '#ffffff'
      }
    }
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  created () {
    if (this.shop && this.shop.extra) {
      this.form = this.shop.extra
      this.domain = this.shop.domain
      this.offline = this.shop.offline
      if (this.shop.extra.social) {
        this.social.map(e => {
          const item = this.shop.extra.social.filter(i => i.icon === e.icon)
          if (item[0]) {
            e.url = item[0].url
            e.showText = item[0].showText
            e.text = item[0].text
          }
          return e
        })
      }
    }
  },
  methods: {
    clearDomain () {
      this.domain = null
    },
    colorSchemeDefaults () {
      this.form.textcolor = '#262222'
      this.form.themecolor = '#ffffff'
      this.form.themefont = {
        name: 'raleway',
        distro: 'Raleway SemiBold'
      }
    },
    submit () {
      this.saving = true
      if (this.domain) {
        this.domain = this.domain.split('://').reverse()[0].split('/')[0]
      }
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
      this.saving = true
      this.$store.dispatch('update', {
        offline: this.offline,
        domain: this.domain,
        extra: this.form
      }).then(res => {
        this.$store.dispatch('event', { tag: 'theme', value: this.form })
        if (this.form.themecolor) {
          document.documentElement.style.setProperty('--themecolor', this.form.themecolor)
        }
        if (this.form.textcolor) {
          document.documentElement.style.setProperty('--textcolor', this.form.textcolor)
        }
        this.saving = false
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
