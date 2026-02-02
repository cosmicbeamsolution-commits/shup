<template>
  <div class="app-view">
    <section-background :is-rolled="true">
      <div class="content">
        <h1 class="is-special-title has-text-centered has-text-white">{{ filters.servicio }}</h1>
      </div>
      <div class="column is-hidden-desktop animated fadeIn">
        <div class="content">
          <card-component
            :is-float="true"
            :is-bottom-rounded="true"
            :is-mobile="true">
            <div class="columns">
              <div class="column">
                <autocomplete @valueChanged="setServicio" v-if="servicios" :data-items="servicios" :data-label="filters.servicio" :data-message="'Ej. salones de eventos, fotografía'" :data-caption="'Ej. Salones de eventos Fotografía Catering'" />
              </div>
              <div class="column">
                <autocomplete @valueChanged="setLocalidad" v-if="localidades" :data-items="localidades" :data-label="filters.localidad" :data-caption="'Ej. Plottier Neuquén'" />
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-button @click="submit" type="is-danger is-fullwidth is-outlined " title="Buscar en YA CABRÓN">Buscar</b-button>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <router-link to="/consultar" class="button is-fullwidth is-info is-outlined " title="Solicitar presupuesto general">
                  <span>Presupuesto múltiple</span>
                </router-link>
              </div>
            </div>
          </card-component>
        </div>
      </div>
      <!-- endmobile -->
      <!-- desktop -->
      <div class="column is-hidden-mobile is-hidden-tablet-only animated fadeIn delay-1s">
        <card-component :is-float="true" :is-v-condensed="true">
          <div class="is-special-searchbox">
            <b-field grouped>
              <b-field class="is-6" expanded>
                <autocomplete @valueChanged="setServicio" v-if="servicios" :data-items="servicios" :data-label="filters.servicio" :data-message="'Ej. salones de eventos, fotografía'"/>
              </b-field>
              <b-field class="is-6" expanded>
                <autocomplete @valueChanged="setLocalidad" v-if="localidades" :data-items="localidades" :data-label="filters.localidad"/>
              </b-field>
              <b-field>
                <b-button @click="submit" type="is-danger is-outlined  is-circle">
                  <svg-icon icon="search"/>
                </b-button>
              </b-field>
            </b-field>
          </div>
        </card-component>
      </div>
    </section-background>
    <div class="container">
      <div class="content column">
        <div class="columns">
          <div class="column is-8 is-thin-mobile">
            <div class="column">
              <b-field grouped>
                <b-field v-show="filters.servicio">
                  <b-button type="is-primary is-small  is-outlined">
                    <span v-html="filters.servicio"/>
                  </b-button>
                </b-field>
                <b-field v-show="filters.localidad">
                  <b-button @click="closeTab" type="is-primary is-small  is-outlined">
                    <span v-html="filters.localidad"/>
                    <b-icon icon="close" size="is-small"/>
                  </b-button>
                </b-field>
              </b-field>
            </div>
            <div>
              <div v-show="!data.length">
                <h1>No se han encontrado resultados para tu búsqueda</h1>
              </div>
              <div v-show="data.length" v-for="(item, index) in data" :key="index">
                <card-provider :data-item="item"/>
              </div>
            </div>
          </div>
          <div class="column is-thin-mobile">
            <div class="column">
              <b-field grouped position="is-right">
                <b-field class="is-invisible">
                  <router-link class="button is-small  is-text" to="/">
                    <span class="has-text-light">Volver</span>
                  </router-link>
                </b-field>
                <b-field>
                  <router-link class="button is-small  is-text" to="/">
                    <span class="has-text-light">Volver</span>
                  </router-link>
                </b-field>
              </b-field>
            </div>
            <card-component class="animated delay-1s fadeIn">
              <div class="sidebar has-text-centered">
                <h3>Dejá que ellos te busquen</h3>
                <p class="has-text-light">Completá los datos de tu evento y pronto recibirás presupuestos de distintos proveedores.</p>
                <div class="has-text-centered">
                  <router-link to="/consultar" class="button is-info  is-outlined">
                    <span>Presupuesto múltiple</span>
                  </router-link>
                </div>
              </div>
            </card-component>
            <div>
              <div class="sidebar-title">
                <h3 class="has-text-centered">Recomendados YA CABRÓN</h3>
              </div>
              <div v-for="(item, index) in destacados" :key="index" class="animated delay-1s fadeIn">
                <card-featured :data-item="item"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import SectionBackground from '../components/SectionBackground'
import CardFeatured from '@/components/CardFeatured'
import CardComponent from '@/components/CardComponent'
import Autocomplete from '@/components/Autocomplete'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'Buscar',
  components: {
    SectionBackground,
    CardFeatured,
    CardComponent,
    Autocomplete,
    SvgIcon
  },
  watch: {
    '$route.params.donde': {
      handler: function (donde) {
        this.search(this.$route.params.que, donde)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      destacados: [],
      servicios: [],
      localidades: [],
      servicio: '*',
      localidad: '*',
      filters: {
        servicio: null,
        localidad: null
      },
      data: {}
    }
  },
  computed: {
    ...mapState([
      'app'
    ])
  },
  methods: {
    setServicio: function (value) {
      this.servicio = value
    },
    setLocalidad: function (value) {
      this.localidad = value
    },
    closeTab (t) {
      this.$router.push(`/buscar/${this.$route.params.que}/*`)
    },
    search (que, donde) {
      this.$root.isLoading = true
      axios.get(['buscar', que, donde].join('/')).then(res => {
        this.data = res.data
        setTimeout(() => {
          this.$root.isLoading = false
        }, 1000)
      })
    },
    submit () {
      if (!this.servicio) {
        return this.$buefy.snackbar.open({
          message: `Por favor, seleccioná una categoría`,
          type: 'is-success',
          queue: false
        })
      }
      this.$router.push('/buscar/' + this.servicio + '/' + this.localidad)
    }
  },
  created: function () {
    let que = this.$route.params.que
    let donde = this.$route.params.donde
    this.search(que, donde)
    this.servicios = this.$store.getters.servicios
    this.localidades = this.$store.getters.localidades
    if (que !== '*' && this.app.servicios[que]) {
      this.filters.servicio = this.app.servicios[this.$route.params.que].name
    }
    if (donde !== '*' && this.app.localidades[donde]) {
      this.filters.localidad = this.app.localidades[donde].name
    }
    this.servicio = this.$route.params.que
    this.localidad = this.$route.params.donde
    this.destacados = this.app.destacados
  }
}
</script>
