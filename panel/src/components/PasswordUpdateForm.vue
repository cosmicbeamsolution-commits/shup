<template>
  <div>
    <b-field label="Contraseña actual" message="Ingresá tu actual contraseña">
      <b-input name="password_current" type="password" v-model="form.password_current" required autcomplete="current-password"/>
    </b-field>
    <hr>
    <b-field label="Nueva contraseña" message="Ingresá tu nueva contraseña">
      <b-input name="password" type="password" v-model="form.password" required autocomplete="new-password"/>
    </b-field>
    <b-field label="Confirmar contraseña" message="Ingresá nuevamente la nueva contraseña">
      <b-input name="password_confirmation" type="password" v-model="form.password_confirmation" autocomplete="new-password" required />
    </b-field>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PasswordUpdateForm',
  data () {
    return {
      isLoading: false,
      form: {
        password_current: null,
        password: null,
        password_confirmation: null
      }
    }
  },
  methods: {
    submit () {
      if (this.form.password !== this.form.password_confirmation) {
        return this.$buefy.toast.open({
          message: `Las contraseñas no coinciden`,
          type: 'is-danger'
        })
      }
      this.isLoading = true
      axios.post('/admin/change_password', this.form).then((res) => {
        this.$buefy.toast.open({
          message: `Contraseña modificada`,
          type: 'is-success'
        })
      }).catch(err => {
        console.log(err)
        this.$buefy.toast.open({
          message: `La contraseña es incorrecta`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
