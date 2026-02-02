<template>
  <div>
    <title-bar :title-stack="titleStack"/>
  </div>
</template>

<script>
import axios from 'axios'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'shop.validate',
  components: {
    TitleBar
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    titleStack () {
      return [
        'Inicializando geotienda'
      ]
    }
  },
  created () {
    this.$store.state.basic.loaded = false
    axios.post('/panel/validate', { code: this.$route.params.code }).then(res => {
      this.data = res.data
      if (res.data.auth) {
        this.startWizard()
      } else {
        this.$buefy.snackbar.open({
          message: `Hubo un problema con el código de validación de esta geotienda.`,
          type: 'is-danger',
          duration: 60000,
          queue: false
        })
      }
    })
  },
  methods: {
    startWizard () {
      this.$store.dispatch('authenticate', this.data).then(res => {
        this.$router.push('/comenzar')
      })
    }
  }
}
</script>
