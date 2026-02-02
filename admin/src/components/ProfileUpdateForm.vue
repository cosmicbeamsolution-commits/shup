<template>
  <card-component title="Editar Perfil" icon="account-circle">
    <form @submit.prevent="submit">
      <div class="columns">
        <div class="column is-narrow">
          <b-field label="Avatar">
            <file-picker class="filepicker-background-avatar" @fileUploaded="handlePhotoFileUploaded" :style="`background-image:url('${form.photo}')`" />
          </b-field>
        </div>
        <div class="column">
          <b-field label="Nombre" message="Tu name">
            <b-input v-model="form.first_name" required/>
          </b-field>
          <b-field label="Apellido" message="Tu name">
            <b-input v-model="form.first_name" required/>
          </b-field>
          <b-field label="E-mail" message="Tu email">
            <b-input v-model="form.email" type="email" required/>
          </b-field>
          <b-field label="Bio">
            <textarea class="textarea" v-model="form.bio" rows="2" placeholder="Eprendedor y amante de la música"></textarea>
          </b-field>
        </div>
      </div>
      <hr>
      <div class="buttons is-flex-end">
        <button type="submit" class="button is-primary " :class="{'is-loading':isLoading}">
          Guardar
        </button>
      </div>
    </form>
  </card-component>
</template>

<script>
import { mapState } from 'vuex'
import CardComponent from '@/components/CardComponent'
import FilePicker from '@/components/FilePicker'
export default {
  name: 'ProfileUpdateForm',
  components: {
    CardComponent,
    FilePicker
  },
  data () {
    return {
      isFileUploaded: false,
      isLoading: false,
      form: {
        name: null,
        email: null
      }
    }
  },
  computed: {
    ...mapState([
      'auth'
    ])
  },
  mounted () {
    this.form = this.auth.user
  },
  methods: {
    handlePhotoFileUploaded (files) {
      this.$set(this.form, 'photo', files[0])
    },
    submit () {
      this.isLoading = true
      this.$store
        .dispatch('update', this.form)
        .then(res => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: 'Perfil actualizado',
            queue: false
          })
        })
    }
  }
}
</script>
