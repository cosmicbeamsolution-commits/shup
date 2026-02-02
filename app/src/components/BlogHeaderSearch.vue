<template>
  <section-background :section-data="sectionData">
    <div class="content">
      <h1 class="is-special-title has-text-centered has-text-white">{{ dataTitle }}</h1>
    </div>
    <card-component :is-float="true" :is-v-condensed="true">
      <div class="is-special-searchbox">
        <form @submit.prevent="submit">
          <b-field grouped>
            <b-field expanded>
              <p class="control is-bottom-bordered">
                <input type="text" autocomplete="on" placeholder="Buscar en Blog" class="input">
              </p>
            </b-field>
            <b-field>
              <b-button native-type="submit" type="is-white is-outlined is-rounded is-circle" :style="{ borderColor: basic.application.themecolor }">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19"><g width="32" height="32" transform="translate(1.95 5)"><path d="M13.81,12.106,11.083,9.38a.656.656,0,0,0-.465-.191h-.446a5.685,5.685,0,1,0-.984.984v.446a.656.656,0,0,0,.191.465l2.726,2.726a.654.654,0,0,0,.927,0l.774-.774A.659.659,0,0,0,13.81,12.106ZM5.688,9.188a3.5,3.5,0,1,1,3.5-3.5A3.5,3.5,0,0,1,5.688,9.188Z" :fill="basic.application.themecolor"/></g></svg>
              </b-button>
            </b-field>
          </b-field>
        </form>
      </div>
    </card-component>
  </section-background>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import SectionBackground from '../components/SectionBackground'
export default {
  name: 'BlogHeaderSearch',
  components: {
    CardComponent,
    SectionBackground
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  props: {
    sectionData: null,
    dataTitle: null
  },
  data () {
    return {
      query: this.$route.params.query
    }
  },
  methods: {
    submit () {
      if (!this.query) {
        return this.$buefy.snackbar.open({
          message: `Por favor, seleccioná ingresá una palabra clave`,
          type: 'is-success',
          queue: false
        })
      }
      this.$router.push('/blog/search/' + this.query)
    }
  }
}
</script>
