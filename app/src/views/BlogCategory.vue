<template>
  <div class="app-view">
    <blog-header-search :data-title="data.name" :section-data="data"/>
    <div class="container">
      <div class="column">
        <b-field grouped>
          <b-field>
            <router-link to="/blog">
              <b-button type="is-primary is-small is-rounded is-outlined">
                <span>Blog</span>
              </b-button>
            </router-link>
          </b-field>
        </b-field>
      </div>
      <div class="content column">
        <div v-for="(item, index) in data.entries" :key="index" class="">
          <router-link :to="'/blog/' + data.slug + '/' + item.slug">
            <div class="has-margin-bottom-1">
              <card-component>
                <h4>{{ item.name }}</h4>
                <p class="has-text-light">{{ item.text }} <small>{{ item.created | fromNow }}</small></p>
              </card-component>
            </div>
          </router-link>
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
  name: 'blog_categoria',
  components: {
    CardComponent,
    BlogHeaderSearch
  },
  data () {
    return {
      query: null,
      data: {}
    }
  },
  created: function () {
    axios.get('/news/' + this.$route.params.id).then(res => {
      this.data = res.data
    })
  },
  methods: {
    submit () {
      if (!this.query) {
        return this.$buefy.snackbar.open({
          message: `Por favor, seleccioná una categoría`,
          type: 'is-success',
          queue: false
        })
      }
      this.$router.push(['blog', 'buscar', this.query].join('/'))
    }
  }
}
</script>
