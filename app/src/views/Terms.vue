<template>
  <div class="animated fadeIn">
    <section class="hero is-top">
      <div class="hero-bodys content">
        <card-component :is-float="true" :is-centered="true">
          <h2>Términos y condiciones</h2>
          <div class="has-background-white pre-wrap" v-html="basic.settings.terms"/>
        </card-component>
        <div class="buttons is-flex-center">
          <b-button type="is-light" icon-left="backspace" @click="goBack()">
            <span>Volver</span>
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'terms',
  components: {
    CardComponent
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>
