<template>
  <div class="app-view">
    <modal-box :is-active="isModalActive" :data-item="data" @cancel="shareCancel"/>
    <section-background :is-rolled="true">
      <div class="content">
        <h1 class="is-special-title has-text-centered has-text-white">{{ data.empresa | sanitize }}</h1>
      </div>
    </section-background>
    <div class="container">
      <div class="content column">
        <div class="columns">
          <div class="column is-8 is-thin-mobile">
            <div class="column is-hidden-mobile is-invisible">
              <b-field grouped>
                <b-field>
                  <b-button type="is-primary is-small is-rounded is-outlined">
                    <span>...</span>
                  </b-button>
                </b-field>
              </b-field>
            </div>
            <div class="card card-provider has-margin-bottom-75 has-padding-bottom-mobile-05">
              <div class="card-content">
                <div class="columns is-mobile">
                  <div class="column is-2">
                    <div class="card-avatar" :style="`background-image: url('${data.avatar}')`"/>
                  </div>
                  <div class="column">
                    <h4 class="is-marginless">{{ data.empresa | sanitize }}</h4>
                    <span class="is-block has-text-light is-size-7">{{ data.rubro }}, {{ data.zona }} {{ data.localidad }} <span v-show="data.direccion">{{ data.direccion }}</span></span>
                    <span class="is-block has-text-light">{{ data.tagline | sanitize }}</span>
                  </div>
                  <div class="column is-1">
                    <span class="is-block card-icons">
                      <b-field position="is-right">
                        <a @click="iconClick('telefono')" v-show="data.telefono" :href="'tel:' + data.telefono">
                          <svg-icon icon="phone"/>
                        </a>
                        <span v-show="data.plan === 'premium'">
                          <a v-show="data.redsocial && data.redsocial === 'instagram'" @click="iconClick('fanpage')" :href="data.fanpage" target="_blank">
                            <svg-icon icon="instagram"/>
                          </a>
                          <a v-show="data.redsocial && data.redsocial === 'facebook'" @click="iconClick('fanpage')" :href="data.fanpage" target="_blank">
                            <svg-icon icon="facebook"/>
                          </a>
                          <a v-show="data.website" @click="iconClick('website')" :href="data.website" target="_blank">
                            <svg-icon icon="website"/>
                          </a>
                        </span>
                        <a @click="iconClick('share')" @click.prevent="shareModal">
                          <svg-icon icon="share"/>
                        </a>
                      </b-field>
                    </span>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <gallery-provider :data-videos="data.videos" :data-gallery="data.galeria" :data-extended="true"/>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <h5>Descripción</h5>
                    <p>{{ data.servicio_describe | sanitize }}</p>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <h5>Servicios</h5>
                    <p>{{ data.servicio_cuenta | sanitize }}</p>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <h5>Preguntas frecuentes</h5>
                    <div class="columns">
                      <div class="column is-6">
                        <div class="column">
                          <div class="field">
                            <label class="label">1. Cobro de presupuesto</label>
                            <p v-show="data.horas">Por hora</p>
                            <p v-show="data.evento">Por evento</p>
                            <p v-show="data.horas_evento">Por horas y evento</p>
                          </div>
                          <div class="field">
                            <label class="label">2. Anticipación de reserva</label>
                            <p>{{ data.anticipo | sanitize }}</p>
                          </div>
                          <div class="field">
                            <label class="label">3. Método de pago</label>
                            <p>{{ data.metodo_pago | sanitize }}</p>
                          </div>
                          <div class="field">
                            <label class="label">4. Movilidad</label>
                            <p>{{ data.movilidad | sanitize }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="column">
                          <div class="field">
                            <label class="label">5. ¿Realiza el servicio al aire libre?</label>
                            <p v-show="data.aire_libre">Sí</p>
                            <p v-show="!data.aire_libre">No</p>
                          </div>
                          <div class="field">
                            <label class="label">6. ¿Realiza horas extra?</label>
                            <p v-show="data.horas_extra">Sí</p>
                            <p v-show="!data.horas_extra">No</p>
                          </div>
                          <div class="field">
                            <label class="label">7. ¿Qué incluye el servicio?</label>
                            <p>{{ data.servicio_incluye | sanitize }}</p>
                          </div>
                          <div class="field">
                            <label class="label">8. ¿Cuánto dura el servicio?</label>
                            <p>{{ data.servicio_dura | sanitize }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <b-field grouped position="is-right">
                      <b-field>
                        <b-button :label="data.base" type="is-info is-rounded is-outlined"/>
                      </b-field>
                      <b-field>
                        <router-link :to="'/consultar/' + data._id" class="button is-danger is-rounded is-outlined">
                          <span @click="iconClick('consultar')">Consultar</span>
                        </router-link>
                      </b-field>
                    </b-field>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column">
              <b-field grouped position="is-right">
                <b-field class="is-invisible">
                  <router-link class="button is-small is-rounded is-text" to="/">
                    <span class="has-text-light">Volver</span>
                  </router-link>
                </b-field>
                <b-field>
                  <router-link class="button is-small is-rounded is-text" to="/">
                    <span class="has-text-light">Volver</span>
                  </router-link>
                </b-field>
              </b-field>
            </div>
            <card-component v-show="!isLoading" class="animated delay-1s fadeIn">
              <div class="sidebar content has-text-centered">
                <h4>Solicitar presupuesto</h4>
                <p class="has-text-light">Completá los datos de tu evento y pronto recibirás la respuesta de {{ data.name }}.</p>
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
                <b-field grouped>
                  <b-field>
                    <datepicker input-class="input" v-model="form.fecha" name="fecha" placeholder="Fecha" required></datepicker>
                  </b-field>
                  <b-field>
                    <b-input v-model="form.lugar" placeholder="Lugar" required />
                  </b-field>
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
                <div class="has-text-centered">
                  <button type="submit" class="button is-danger is-rounded is-outlined" :class="{'is-loading' : isLoading}">
                    <span>Enviar solicitud</span>
                  </button>
                </div>
              </form>
            </card-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import ModalBox from '@/components/ModalBox'
import SectionBackground from '../components/SectionBackground'
import CardComponent from '@/components/CardComponent'
import GalleryProvider from '@/components/GalleryProvider'
import SvgIcon from '@/components/SvgIcon'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'Proveedor',
  components: {
    SectionBackground,
    GalleryProvider,
    CardComponent,
    Datepicker,
    ModalBox,
    SvgIcon
  },
  computed: {
    provider () {
      return this.data
    },
    ...mapState([
      'app'
    ])
  },
  methods: {
    setRubro: function (value) {
      this.rubro = value
    },
    setZona: function (value) {
      this.zona = value
    },
    submit () {
      this.$root.isLoading = true
      let endpoint = ['consultar', this.data._id]
      axios.put(endpoint.join('/'), this.form).then(res => {
        this.$root.isLoading = false
        this.$router.push('/consultar/exito')
      })
    },
    shareModal () {
      this.isModalActive = true
    },
    shareCancel () {
      this.isModalActive = false
    },
    iconClick (e) {
      this.$store
        .dispatch('etag', {
          _id: this.data._id,
          tag: e
        })
    }
  },
  created: function () {
    this.iconClick('visitas')
    axios.get(['proveedor', this.$route.params.id].join('/')).then(res => {
      this.data = res.data
      this.$emit('updateHead')
      setTimeout(() => {
        this.$root.isLoading = false
      }, 3000)
    })
  },
  data () {
    return {
      params: {
        title: '',
        description: '',
        image: ''
      },
      isModalActive: false,
      isLoading: false,
      form: {},
      data: {}
    }
  }
}
</script>
