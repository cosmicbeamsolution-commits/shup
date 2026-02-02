<template>
  <div>
    <section-background>
      <div class="content is-bottom-padded">
        <div class="columns is-centered">
          <div class="column is-6">
            <h1 class="has-text-centered has-text-white has-text-shadow">
              <span class="mdi mdi-comment-question"></span> Preguntas frecuentes
            </h1>
            <p class="has-text-centered has-text-white has-text-weight-bold has-text-shadow has-line-height">{{ basic.settings.faq_subtitle }}</p>
          </div>
        </div>
      </div>
    </section-background>
    <div class="column content has-padding-extra-bottom animated fadeIn delay">
      <card-component :is-float="true" :is-centered="true">
        <h5>Preguntas frecuentes</h5>
        <div class="has-background-white pre-wrap" v-html="basic.settings.faq"/>
      </card-component>
      <div class="buttons is-flex-center">
        <b-button type="is-light is-small" icon-left="backspace" @click="goBack()" rounded>
          <span>Volver</span>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SectionBackground from '../components/SectionBackground'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'faq',
  components: {
    CardComponent,
    SectionBackground
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
