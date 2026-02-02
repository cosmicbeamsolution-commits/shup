<template>
  <div class="app-view">
    <section-background :is-rolled="true" />
    <card-component :is-float="true" :is-narrow="true" :is-centered="true">
      <div class="sidebar content has-text-centered">
        <div v-if="$route.params.id">
          <h4>Solicitar presupuesto</h4>
          <p class="has-text-light">Completá los datos de tu evento y pronto recibirás respuesta de {{ proveedor.empresa }}.</p>
        </div>
        <div v-else>
          <h4>Presupuesto múltiple</h4>
          <p class="has-text-light">Completá los datos, pronto recibirás las mejores opciones para tu evento.</p>
        </div>
      </div>
      <form class="form" @submit.prevent="submit">
        <b-field>
          <b-input v-model="form.name" placeholder="Nombre y Apellido" required />
        </b-field>
        <b-field>
          <b-input v-model="form.email" type="email" placeholder="Email" required />
        </b-field>
        <b-field>
          <b-input v-model="form.telefono" placeholder="Teléfono ó Celular" required />
        </b-field>
        <div v-if="!$route.params.id" class="dropdown-container">
          <dropdown @valueChanged="setServicio" v-if="servicios" :data-items="servicios" :data-label="'¿Qué buscás?'"/>
        </div>
        <div v-if="!$route.params.id" class="dropdown-container">
          <dropdown @valueChanged="setLocalidad" v-if="localidades" :data-items="localidades" :data-label="'¿Dónde buscás?'"/>
        </div>
        <b-field>
          <datepicker :language="es" input-class="input" v-model="form.fecha" name="fecha" placeholder="Fecha" required></datepicker>
        </b-field>
        <b-field grouped>
          <b-field>
            <b-input v-model="form.presupuesto" placeholder="Presupuesto" required />
          </b-field>
          <b-field>
            <b-input v-model="form.invitados" placeholder="Invitados" required />
          </b-field>
        </b-field>
        <b-field>
          <textarea class="textarea" v-model="form.mensaje" placeholder="Mensaje" />
        </b-field>
        <div class="has-text-centered is-margin-top">
          <button type="submit" class="button is-danger  is-outlined" :class="{'is-loading' : $root.isLoading}">
            <span>Enviar solicitud</span>
          </button>
        </div>
      </form>
    </card-component>
    <div class="container">
      <div class="columns has-text-centered">
        <div class="column">
          <div class="">
            <a @click="goBack" class="button is-text">Volver</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import Datepicker from 'vuejs-datepicker'
import { es } from 'vuejs-datepicker/dist/locale'
import Dropdown from '@/components/Dropdown'
import SectionBackground from '@/components/SectionBackground'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'Consultar',
  components: {
    Datepicker,
    Dropdown,
    CardComponent,
    SectionBackground
  },
  data () {
    return {
      servicios: [],
      localidades: [],
      proveedor: {},
      form: {},
      es: es
    }
  },
  created: function () {
    if (this.$route.params.id) {
      axios.get('/proveedor/' + this.$route.params.id).then(res => {
        this.$root.isLoading = false
        this.proveedor = res.data
      })
    } else {
      this.$root.isLoading = false
    }
    this.servicios = this.$store.getters.servicios
    this.localidades = this.$store.getters.localidades
  },
  computed: {
    ...mapState([
      'section',
      'app'
    ])
  },
  methods: {
    goBack () {
      history.go(-1)
    },
    iconClick (e) {
      this.$store
        .dispatch('event', {
          _id: this.$route.params.id,
          tag: e
        })
    },
    setServicio (value) {
      this.form.servicio = value
    },
    setLocalidad (value) {
      this.form.localidad = value
    },
    submit () {
      this.$root.isLoading = true
      let endpoint = ['consultar']
      if (this.$route.params.id) {
        this.iconClick('consultas')
        endpoint.push(this.$route.params.id)
      }
      axios.put(endpoint.join('/'), this.form).then(res => {
        this.$router.push('/consultar/exito')
      })
    }
  }
}
</script>
