<template>
  <div>
    <b-field label="Nombre" message="Tu nombre">
      <b-input v-model="form.first_name" name="name" required/>
    </b-field>
    <b-field label="Nombre" message="Tu apellido">
      <b-input v-model="form.last_name" name="name" required/>
    </b-field>
    <b-field label="E-mail" message="Tu email">
      <b-input v-model="form.email" name="email" type="email" required/>
    </b-field>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProfileUpdateForm',
  data () {
    return {
      isFileUploaded: false,
      saving: false,
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
    this.form.name = this.auth.shop.first_name
    this.form.email = this.auth.shop.email
  },
  methods: {
    submit () {
      this.saving = true
      this.$store
        .dispatch('update', this.form)
        .then(res => {
          this.saving = false
          this.$buefy.toast.open({
            message: 'Perfil actualizado',
            queue: false
          })
        })
    }
  }
}
</script>
