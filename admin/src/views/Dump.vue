<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack"/>
    <pre v-html="data"></pre>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'Dump',
  components: {
    NavBar,
    AsideMenu,
    TitleBar
  },
  data () {
    return {
      data: {}
    }
  },
  created: function () {
    axios.get('/' + this.$route.params.c).then(res => {
      this.data = res.data
    })
  },
  computed: {
    titleStack () {
      return [
        'Admin',
        this.$route.c
      ]
    }
  }
}
</script>
