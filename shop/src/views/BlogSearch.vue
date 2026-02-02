<template>
  <div class="app-view">
    <blog-header-search :data-title="data.name" :section-data="data"/>
    <div class="container">
      <div class="column">
        <b-field grouped>
          <b-field>
            <router-link to="/blog">
              <b-button @click="closeTab" type="is-primary is-small  is-outlined">
                <span>Resultado de tu búsqueda</span>
                <b-icon icon="close" size="is-small"/>
              </b-button>
            </router-link>
          </b-field>
        </b-field>
      </div>
      <div v-show="data.length" class="content column">
        <div v-for="(item, index) in data" :key="index" class="">
          <router-link :to="'/blog/' + data.pslug + '/' + item.slug">
            <div class="has-margin-bottom-1">
              <card-component>
                <h4>{{ item.name }}</h4>
                <p class="has-text-light">{{ item.text }} <small>{{ item.created | fromNow }}</small></p>
              </card-component>
            </div>
          </router-link>
        </div>
      </div>
      <div v-show="!data.length">
        <div class="column content">
          <h3>No se han encontrado resultados para tu búsqueda</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import moment from 'moment'
import CardComponent from '@/components/CardComponent'
import BlogHeaderSearch from '@/components/BlogHeaderSearch'
export default {
  name: 'blog_buscar',
  components: {
    CardComponent,
    BlogHeaderSearch
  },
  data () {
    return {
      query: null,
      data: []
    }
  },
  created: function () {
    axios.post('/news/search', { query: this.$route.params.query }).then(res => {
      let data = res.data.reduce((data, e) => {
        let item = e.entries
        item.pslug = e.slug
        return item
      }, {})
      this.data = data
    })
  },
  methods: {
    closeTab () {
      this.$router.push(`/blog`)
    },
    submit () {
      if (!this.query) {
        return this.$buefy.snackbar.open({
          message: `Por favor, ingresá una palabra clave`,
          type: 'is-success',
          queue: false
        })
      }
      this.$router.push(['blog', 'buscar', this.query].join('/'))
    }
  }
}
</script>
