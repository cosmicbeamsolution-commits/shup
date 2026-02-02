<template>
  <div class="app-view">
    <blog-header-search :data-title="data.name" :section-data="data.entries"/>
    <div class="container">
      <div class="column">
        <b-field grouped>
          <b-field>
            <router-link :to="'/blog/' + data.slug">
              <b-button type="is-primary is-small is-rounded is-outlined">
                <span v-html="data.name"/>
              </b-button>
            </router-link>
          </b-field>
        </b-field>
      </div>
      <div class="content column has-padding-top-1">
        <h1 v-html="data.entries.name"/>
        <div v-html="data.entries.content"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import moment from 'moment'
import BlogHeaderSearch from '@/components/BlogHeaderSearch'
export default {
  name: 'blog_entrada',
  components: {
    BlogHeaderSearch
  },
  data () {
    return {
      data: {
        entries: {}
      }
    }
  },
  created: function () {
    axios.get(['news', this.$route.params.id, this.$route.params.sid].join('/')).then(res => {
      this.data = res.data
    })
  }
}
</script>
