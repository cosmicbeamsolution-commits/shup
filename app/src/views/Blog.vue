<template>
  <div class="app-view">
    <blog-header-search :data-title="'Blog'"/>
    <div class="container column content">
      <div v-for="(item, index) in data" :key="index" class="">
        <router-link :to="'/blog/' + item.slug">
          <div class="has-margin-bottom-1">
            <card-component>
              <h4>{{ item.name }}</h4>
              <p class="has-text-light">{{ item.text }}</p>
            </card-component>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import CardComponent from '@/components/CardComponent'
import BlogHeaderSearch from '@/components/BlogHeaderSearch'
export default {
  name: 'blog',
  components: {
    BlogHeaderSearch,
    CardComponent
  },
  data () {
    return {
      query: null,
      data: {}
    }
  },
  created: function () {
    axios.get('/news').then(res => {
      this.data = res.data
    })
  }
}
</script>
