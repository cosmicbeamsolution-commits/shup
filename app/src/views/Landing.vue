<template>
  <div class="animated fadeIn delay">
    <section class="hero section is-top">
      <div class="container is-vexpanded">
        <div class="columns">
          <div class="column is-7">
            <div class="is-hidden-mobile">
              <div class="v-field">
                <h1 class="is-size-huge has-text-weight-normal">{{ basic.landing.mainTitle }}</h1>
              </div>
              <div class="v-field">
                <p class="has-text-weight-bold has-line-height has-text-grey has-max-width is-size-5">{{ basic.landing.mainText }}</p>
              </div>
            </div>
            <div class="is-hidden-tablet content">
              <h1 class="has-text-weight-normal is-size-2">{{ basic.landing.mainTitle }}</h1>
              <div class="v-field">
                <p class="has-text-weight-bold has-line-height has-text-grey">{{ basic.landing.mainText }}</p>
              </div>
            </div>
            <div class="columns is-hidden-mobile">
              <div class="column">
                <form @submit.prevent="submitCreateShop">
                  <b-field class="is-flex-center" grouped>
                    <div class="control">
                      <b-input v-model="shopname" placeholder="Nombre de tu tienda" required/>
                    </div>
                    <div class="control">
                      <button type="submit" class="button is-info" @click="submitCreateShop()">
                        <span>Crear tienda</span>
                        <svg-icon icon="shop"/>
                      </button>
                    </div>
                  </b-field>
                </form>
              </div>
            </div>
            <div class="columns is-hidden-tablet">
              <div class="column">
                <form @submit.prevent="submitCreateShop">
                  <div class="columns is-mobile">
                    <div class="column">
                      <b-input v-model="shopname" placeholder="Nombre de tu tienda" required/>
                    </div>
                    <div class="column is-narrow">
                      <button type="submit" class="button is-info" @click="submitCreateShop()">
                        <span>Crear</span>
                        <svg-icon icon="shop"/>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div v-show="basic.landing.mainFigure" class="column is-hidden-mobile">
            <div class="is-figure is-large" :style="`background-image: url(${basic.landing.mainFigure})`"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section is-demo">
      <div class="container">
        <div class="columns is-vcentered is-centered is-vexpanded">
          <div class="demo-screen-container">
            <div class="demo-screen is-hidden-touch">
              <div>
                <img :src="`${basic.landing.demoDesktop}`"/>
              </div>
            </div>
            <div class="demo-screen is-hidden-desktop">
              <div>
                <img :src="`${basic.landing.demoMobile}`"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section">
      <div class="container">
        <div class="columns is-vcentered is-centered is-vexpanded">
          <div v-show="basic.landing.secondaryFigure" class="column is-7 is-hidden-mobile">
            <div class="is-figure is-large" :style="`background-image: url(${basic.landing.secondaryFigure})`"></div>
          </div>
          <div class="column content is-hidden-touch">
            <h1 class="has-text-weight-bold is-size-1">{{ basic.landing.secondaryTitle }}</h1>
            <p class="has-text-weight-medium has-text-grey is-size-5">{{ basic.landing.secondaryText }}</p>
          </div>
          <div class="column content is-hidden-desktop">
            <h1 class="has-text-weight-bold">{{ basic.landing.secondaryTitle }}</h1>
            <p class="has-text-weight-medium has-text-grey">{{ basic.landing.secondaryText }}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section">
      <div class="container">
        <div class="columns is-vcentered is-centered is-vexpanded">
          <div class="column content is-offset-1 is-hidden-touch">
            <h1 class="has-text-weight-bold is-size-1">{{ basic.landing.thirdTitle }}</h1>
            <p class="has-text-weight-medium has-text-grey is-size-5">{{ basic.landing.thirdText }}</p>
          </div>
          <div class="column content is-hidden-desktop">
            <h1 class="has-text-weight-bold">{{ basic.landing.thirdTitle }}</h1>
            <p class="has-text-weight-medium has-text-grey">{{ basic.landing.thirdText }}</p>
          </div>
          <div v-show="basic.landing.thirdFigure" class="column is-7 is-hidden-mobile">
            <div class="is-figure is-large" :style="`background-image: url(${basic.landing.thirdFigure})`"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section">
      <div class="container is-vexpanded content">
        <div class="columns is-centered">
          <div class="column is-6 is-hidden-touch">
            <h1 class="has-text-weight-bold has-text-centered is-size-1">{{ basic.landing.featuresTitle }}</h1>
            <p v-show="basic.landing.featuresText" class="has-text-weight-medium has-text-centered is-size-5">{{ basic.landing.featuresText }}</p>
          </div>
          <div class="column is-hidden-desktop">
            <h1 class="has-text-weight-bold has-text-centered">{{ basic.landing.featuresTitle }}</h1>
            <p v-show="basic.landing.featuresText" class="has-text-weight-medium has-text-centered">{{ basic.landing.featuresText }}</p>
          </div>
        </div>
        <div class="columns is-multiline is-vcentered is-centered">
          <div v-for="(item, index) in basic.landing.features" :key="index" class="column is-3-fullhd is-4-desktop is-6-tablet is-vexpanded has-text-centered animated fadeInUp" :class="'minidelay'+ index">
            <h4 class="has-text-left has-text-info has-text-weight-bold">{{ item.title }}</h4>
            <p class="has-text-left has-text-grey has-text-weight-medium">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-info section">
      <div class="container content is-vexpanded">
        <div class="section field is-hidden-touch">
          <h1 class="has-text-centered is-size-1 has-text-white has-text-weight-bold">{{ basic.landing.faqTitle }}</h1>
          <p class="has-text-centered has-text-white has-text-weight-medium is-size-5">{{ basic.landing.faqText }}</p>
        </div>
        <div class="section field is-hidden-desktop">
          <h1 class="has-text-weight-bold has-text-white">{{ basic.landing.faqTitle }}</h1>
          <p class="has-text-weight-medium">{{ basic.landing.faqText }}</p>
        </div>
        <div class="columns is-multiline is-vcentered is-centered is-vexpanded">
          <div v-for="(item, index) in basic.landing.faqs" :key="index" class="column is-6">
            <div v-if="item.a" class="card is-rounded">
              <header @click="toggleFaq(item)" class="card-header is-clickable">
                <p class="card-header-title has-padding-left is-marginless">{{ item.q }}</p>
                <span class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <span class="mdi mdi-24px" :class="{ 'mdi-chevron-right': !item.show, 'mdi-chevron-down': item.show }"/>
                  </span>
                </span>
              </header>
              <div v-show="item.show" class="card-content">
                <div class="content">{{ item.a }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section is-demo-text">
      <div class="content has-text-centered">
        <div class="columns is-centered">
          <div class="column">
            <div class="is-hidden-touch">
              <div class="v-field">
                <h1 class="is-size-1 has-text-weight-normal">{{ basic.landing.demoTitle }}</h1>
              </div>
              <div class="v-field has-text-centered">
                <p class="has-text-centered has-margin-auto has-text-weight-bold has-line-height has-max-width is-size-5">{{ basic.landing.demoText }}</p>
              </div>
            </div>
            <div class="is-hidden-desktop content">
              <h1 class="has-text-weight-normal">{{ basic.landing.demoTitle }}</h1>
              <div class="v-field">
                <p class="has-text-weight-bold has-line-height">{{ basic.landing.demoText }}</p>
              </div>
            </div>
            <div class="columns is-centered is-vcentered">
              <div class="column is-narrow">
                <a @click="/* window.fbq('trackCustom', 'viewDemoFromLanding') */" href="https://demo.overlemon.com" class="button is-text" target="_blank">
                  <span>Ver tienda demo </span>
                  <b-icon icon="eye"/>
                </a>
              </div>
              <div class="column is-narrow">
                <a href="/proba-nuestro-gestor" class="button is-success">
                  <span>Probar gestor</span>
                  <b-icon icon="gesture-tap-button"/>
                </a>
              </div>
              <div class="column is-narrow">
                <button type="button" class="button is-info" @click="submitCreateShop()">
                  <span>Crear tienda</span>
                  <svg-icon icon="shop"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-hidden-touch">
          <div class="column">
            <form @submit.prevent="submitSubscribeNews">
              <b-field class="is-flex-center" grouped>
                <div class="control is-hidden-mobile">
                  <span>Quiero recibir novedades en </span>
                </div>
                <div class="control">
                  <b-input type="email" v-model="email" placeholder="Tu correo electrónico" required/>
                </div>
                <div class="control">
                  <b-button native-type="submit" type="is-info" :loading="sending">Enviar</b-button>
                </div>
              </b-field>
            </form>
          </div>
          <div v-if="basic.settings" class="column">
            <b-field grouped group-multiline position="is-right" class="is-share-icons">
              <p v-for="(item, index) in basic.settings.social" :key="index" class="control">
                <a :href="item.url" :title="`Seguinos en ${item.icon}`" target="_blank">
                  <b-icon :icon="item.icon"/>
                </a>
              </p>
            </b-field>
          </div>
        </div>
        <div class="columns is-hidden-tablet">
          <div class="column">
            <form @submit.prevent="submitSubscribeNews">
              <div class="columns is-mobile">
                <div class="column">
                  <b-input type="email" v-model="email" placeholder="Tu correo electrónico" required/>
                </div>
                <div class="column is-narrow">
                  <b-button native-type="submit" type="is-info" :loading="sending">Enviar</b-button>
                </div>
              </div>
            </form>
          </div>
          <div v-if="basic.settings" class="column">
            <b-field grouped group-multiline position="is-right" class="is-share-icons">
              <p v-for="(item, index) in basic.settings.social" :key="index" class="control">
                <a :href="item.url" :title="`Seguinos en ${item.icon}`" target="_blank">
                  <b-icon :icon="item.icon"/>
                </a>
              </p>
            </b-field>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import SvgIcon from '../components/SvgIcon'
export default {
  name: 'landing',
  components: {
    SvgIcon
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  data () {
    return {
      shopname: '',
      email: '',
      sending: false
    }
  },
  methods: {
    toggleFaq (item) {
      this.basic.landing.faqs = this.basic.landing.faqs.map(e => {
        e.show = !e.show && e === item
        return e
      })
      if (item.show) {
        // window.fbq('trackCustom', 'readFaq', { q: item.q })
      }
    },
    submitCreateShop () {
      // window.fbq('trackCustom', 'shopCreateStart', { shop: this.shopname })
      this.$router.push(`/crea-tu-tienda/${this.shopname}`)
    },
    submitSubscribeNews () {
      const email = this.email.toLowerCase().trim()
      this.sending = true
      axios.post('/newsletter', { email: email, origin: 'landing_footer' }).then(res => {
        this.sending = false
        this.email = ''
        this.$buefy.snackbar.open({
          message: res.data.message,
          type: `is-${res.data.status}`
        })
        // window.fbq('trackCustom', 'subscribeNewsletter', { email: email })
      })
    }
  }
}
</script>
