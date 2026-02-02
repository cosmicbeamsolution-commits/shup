<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="account-circle" size="is-medium"/> Perfil
    </hero-bar>
    <section class="section is-main-section">
      <div v-if="this.basic.shop.id === 'demo'" class="notification is-grey">
        Esta cuenta no puede editar su perfil por ser una cuenta de prueba de la plataforma. Para editar tu propio perfil <a href="https://overlemon.com/crea-tu-tienda" target="_blank">creá una cuenta</a> registrando tu tienda desde nuestra Landing Page.
        <hr>
        <div class="buttons is-center">
          <a class="button is-white" href="https://overlemon.com/crea-tu-tienda" target="_blank">Quiero editar perfil en mi tienda</a>
        </div>
      </div>
      <div v-else>
        <card-component>
          <form @submit.prevent="submit">
            <div class="tabs is-centered is-boxed">
              <ul>
                <li :class="{ 'is-active': tab === 'profile' }">
                  <a @click="tab = 'profile'">
                    <span>Perfil</span>
                  </a>
                </li>
                <li :class="{ 'is-active': tab === 'account' }">
                  <a @click="tab = 'account'">
                    <span>Cuenta</span>
                  </a>
                </li>
                <li :class="{ 'is-active': tab === 'password' }">
                  <a @click="tab = 'password'">
                    <span>Contraseña</span>
                  </a>
                </li>
              </ul>
            </div>
            <div v-show="tab === 'profile'" class="content">
              <b-field label="Tienda" message="El nombre de tu tienda">
                <b-input v-model="form.shop" required/>
              </b-field>
              <hr>
              <b-field label="Nombre" message="Tu nombre">
                <b-input v-model="form.first_name" required/>
              </b-field>
              <b-field label="Apellido" message="Tu apellido">
                <b-input v-model="form.last_name" required/>
              </b-field>
              <b-field  label="E-mail" message="Tu email">
                <b-input v-model="form.email" type="email" required/>
              </b-field>
            </div>
            <div v-show="tab === 'account'" class="content">
              <b-field label="Nombre de usuario" message="Elegí el nombre de usuario de tu geotienda">
                <div class="control" :class="{ 'is-loading': checkingShop }">
                  <input type="text" class="input " maxlength="16" minlength="3" v-model="desiredId" @keyup="checkshopNameStatus" required/>
                </div>
              </b-field>
              <b-notification :type="'is-' + shopNameStatus.status + ' is-light'" aria-close-label="Close notification" v-show="shopNameStatus.message">
                <span class="has-text-weight-bold" v-html="shopNameStatus.message"></span>
              </b-notification>
            </div>
            <div v-show="tab === 'password'" class="content">
              <b-field label="Contraseña actual" message="Ingresá tu actual contraseña">
                <b-input type="password" autocomplete="off" v-model="form.password_current" />
              </b-field>
              <hr>
              <b-field label="Nueva contraseña" message="Ingresá tu nueva contraseña">
                <b-input type="password" autocomplete="off" v-model="form.password" value="" />
              </b-field>
              <b-field label="Confirmar contraseña" message="Ingresá nuevamente la nueva contraseña">
                <b-input type="password" autocomplete="off" v-model="form.password_confirmation"  />
              </b-field>
            </div>
            <hr>
            <div class="buttons is-flex-end">
              <button type="submit" class="button is-primary " :class="{'is-loading': saving}">
                Guardar
              </button>
            </div>
          </form>
        </card-component>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'Profile',
  data () {
    return {
      tab: 'profile',
      saving: false,
      form: {},
      clock: 0,
      desiredId: null,
      checkingShop: false,
      shopNameStatus: {},
      shopNameVars: {
        min: 3,
        max: 14
      }
    }
  },
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    HeroBar
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  methods: {
    checkshopNameStatus () {
      if (this.desiredId === this.form.id) {
        this.shopNameStatus = {}
        return clearInterval(this.clock)
      }
      if (this.clock) {
        clearInterval(this.clock)
      }
      this.clock = setTimeout(() => {
        this.shopNameStatus = {}
        this.checkingShop = true
        if (this.form.id.length < this.shopNameVars.min || this.form.id.length > this.shopNameVars.max) {
          this.shopNameStatus = {
            status: 'danger',
            message: `El nombre de la geotienda debe tener al menos ${this.shopNameVars.min} y máximo ${this.shopNameVars.max} caracteres. ${this.form.id} contiene ${this.form.id.length}`
          }
          this.checkingShop = false
        } else {
          axios.post('/shops/checkname', {
            id: this.desiredId
          }).then(res => {
            this.shopNameStatus = res.data
            this.checkingShop = false
          })
        }
      }, 1000)
    },
    submit () {
      this.saving = true
      if (this.tab === 'password') {
        if (!this.form.password || !this.form.password_confirmation || !this.form.password_current) {
          this.saving = false
          return this.$buefy.toast.open({
            message: `Por favor ingresa tu clave actual y la deseada`,
            type: 'is-warning'
          })
        }
        if (this.form.password !== this.form.password_confirmation) {
          this.saving = false
          return this.$buefy.toast.open({
            message: `Las contraseñas no coinciden`,
            type: 'is-warning'
          })
        }
        axios.post('/panel/change_password', {
          old_password: this.form.password_current,
          new_password: this.form.password
        }).then((res) => {
          this.$buefy.toast.open({
            message: `Contraseña modificada`,
            type: 'is-success'
          })
          this.saving = false
          this.form.password_current = ''
        }).catch(err => {
          console.log(err)
          this.saving = false
          this.$buefy.toast.open({
            message: `La contraseña es incorrecta`,
            type: 'is-danger'
          })
        })
      } else {
        if (this.basic.shop.id !== this.desiredId && this.shopNameStatus.status !== 'success') {
          this.saving = false
          return this.$buefy.toast.open({
            message: `Revisá el usuario de la tienda y volvé a intentar`,
            type: 'is-danger',
            duration: 5000
          })
        }
        this.shopNameStatus = {}
        this.form.id = this.desiredId
        this.$store.dispatch('update', {
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          email: this.form.email,
          shop: this.form.shop,
          id: this.desiredId
        }).then(res => {
          this.$store.dispatch('shop', this.form).then(res => {
            this.saving = false
            this.$buefy.toast.open({
              message: `Tienda actualizada`,
              type: 'is-success',
              queue: false
            })
          })
        })
      }
    }
  },
  created () {
    if (this.basic) {
      this.form = this.basic.shop
      this.desiredId = this.form.id
    }
  }
}
</script>
