<template>
  <div class="animated fadeIn">
    <section class="hero is-top">
      <div v-if="!Object.keys(data).length" class="content">
        <card-component :is-float="true" :is-centered="true">
          <h1>
            <span>No encontramos lo que estás buscando</span>
          </h1>
          <div>
            <span>Por favor revisá la URL. Si creés que se trata de un error contactanos. </span>
            <hr>
            <div class="columns is-centered">
              <div class="column is-narrow">
                <a @click="$router.go(-1)" class="button is-info is-rounded is-outlined">Volver atrás</a>
              </div>
              <div class="column is-narrow">
                <router-link to="/" class="button is-info is-rounded is-outlined">Volver a inicio</router-link>
              </div>
              <div class="column is-narrow">
                <router-link to="/contacto" class="button is-info is-rounded is-outlined">Contactar al administrador</router-link>
              </div>
            </div>
          </div>
        </card-component>
      </div>
      <div v-else class="container">
        <div class="column content is-left">
          <h1>{{ data.name }}</h1>
          <div ref="content" v-html="data.content"/>
          <hr>
          <span class="has-text-light">
            <b-icon icon="lead-pencil" size="is-small"/>
            <span> {{ data.created | adjustFormalTZ }}</span>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'notfound',
  components: {
    CardComponent
  },
  data () {
    return {
      data: {}
    }
  },
  created () {
    this.findPage(window.location.pathname)
  },
  methods: {
    fixVue2EditorLinks () {
      setTimeout(() => {
        const host = 'https://overlemon.com'
        this.$refs.content.querySelectorAll('a').forEach(e => {
          if (e.href.indexOf(host) > -1) {
            e.addEventListener('click', ev => {
              ev.preventDefault()
              const slug = e.href.replace(host, '')
              this.$router.push(slug)
              return false
            })
          }
        })
      }, 500)
    },
    findPage (slug) {
      axios.post('/page', { slug: slug }).then((res) => {
        if (res.data.data) {
          if (res.data.data.content) {
            res.data.data.content = res.data.data.content.split('ℹ️').join('<span class="mdi mdi-book-information-variant"></span>')
          }
          this.data = res.data.data
          this.fixVue2EditorLinks()
        } else {
          this.data = {}
        }
        setTimeout(() => {
          this.$store.dispatch('loaded', true)
        }, 500)
      })
    }
  },
  watch: {
    $route (to, from) {
      this.findPage(window.location.pathname)
    }
  }
}

</script>
