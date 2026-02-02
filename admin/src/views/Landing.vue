<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="rocket" size="is-medium"/>
      Landing
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <form @submit.prevent="submit">
          <div class="tabs is-centered is-boxed">
            <ul>
              <!--li :class="{ 'is-active': tab === 'header' }">
                <a @click="tab = 'header'">
                  <span class="has-text-weight-semibold">Header</span>
                </a>
              </li-->
              <li :class="{ 'is-active': tab === 'main' }">
                <a @click="tab = 'main'">
                  <span class="has-text-weight-semibold">Principal</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'secondary' }">
                <a @click="tab = 'secondary'">
                  <span class="has-text-weight-semibold">Secundaria</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'third' }">
                <a @click="tab = 'third'">
                  <span class="has-text-weight-semibold">Terciaria</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'features' }">
                <a @click="tab = 'features'">
                  <span class="has-text-weight-semibold">Features</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'demos' }">
                <a @click="tab = 'demos'">
                  <span class="has-text-weight-semibold">Demos</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'plans' }">
                <a @click="tab = 'plans'">
                  <span class="has-text-weight-semibold">Planes</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'faq' }">
                <a @click="tab = 'faq'">
                  <span class="has-text-weight-semibold">FAQ</span>
                </a>
              </li>
            </ul>
          </div>
          <div v-show="tab === 'main'">
            <div class="columns">
              <div class="column">
                <b-field label="Título principal">
                  <b-input placeholder="Creá tu geotienda" v-model="form.mainTitle" />
                </b-field>
                <b-field label="Texto principal">
                  <textarea class="textarea" v-model="form.mainText" rows="2" placeholder="y empezá a vender donde quieras"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handleMainFigureUploaded" :style="`background-image:url('${form.mainFigure}')`" />
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'secondary'">
            <div class="columns">
              <div class="column">
                <b-field label="Título secundario">
                  <b-input placeholder="Creá tu geotienda" v-model="form.secondaryTitle" />
                </b-field>
                <b-field label="Texto secundario">
                  <textarea class="textarea" v-model="form.secondaryText" rows="2" placeholder="y empezá a vender donde quieras"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handleSecondaryFigureUploaded" :style="`background-image:url('${form.secondaryFigure}')`" />
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'third'">
            <div class="columns">
              <div class="column">
                <b-field label="Título terciario">
                  <b-input placeholder="Creá tu geotienda" v-model="form.thirdTitle" />
                </b-field>
                <b-field label="Texto terciario">
                  <textarea class="textarea" v-model="form.thirdText" rows="2" placeholder="y empezá a vender donde quieras"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handleThirdFigureUploaded" :style="`background-image:url('${form.thirdFigure}')`" />
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'features'">
            <div class="columns">
              <div class="column">
                <b-field label="Título features">
                  <b-input placeholder="Sin necesidad de conocimientos técnicos" v-model="form.featuresTitle" />
                </b-field>
                <b-field label="Texto features">
                  <textarea class="textarea" v-model="form.featuresText" rows="2" placeholder="Geotienda es una plataforma que te permite y crear y administrar tu propio canal de ventas"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handleFeaturesFileUploaded" :style="`background-image:url('${form.featuresFigure}')`" />
                </b-field>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column content">
                <div class="columns">
                  <div class="column">
                    <b-field label="Título">
                      <b-input placeholder="Blog" v-model="feature.title" />
                    </b-field>
                    <b-field label="Descripción" message="Mín. 10 caracteres">
                      <textarea class="textarea" v-model="feature.text" rows="2" placeholder="Mantené informado a tus clientes"></textarea>
                    </b-field>
                  </div>
                  <div class="column">
                    <b-field label="Figura">
                      <file-picker class="filepicker-background" @fileUploaded="handleFeatureFileUploaded" :style="`background-image:url('${feature.icon}')`" />
                    </b-field>
                  </div>
                </div>
                <div v-if="featureEdit" class="buttons is-flex-end">
                  <b-button type="is-danger" @click="cancelEditFeature">Cancelar</b-button>
                </div>
                <div v-if="!featureEdit && feature.title.length && feature.text.length > 10" class="buttons is-flex-end">
                  <b-button type="is-success" @click="addFeature">Agregar</b-button>
                </div>
                <div v-if="feature.title.length && feature.text.length > 10" class="field">
                  <card-component>
                    <div v-show="feature.icon" class="is-feature-figure" :style="`background-image: url(${feature.icon})`"></div>
                    <h3 class="has-text-centered">{{ feature.title }}</h3>
                    <p class="has-text-centered has-text-weight-semibold">{{ feature.text }}</p>
                  </card-component>
                </div>
              </div>
              <div class="column content">
                <div v-if="form.hasOwnProperty('features') && Object.keys(form.features).length">
                  <b-table
                    class="is-borderless"
                    :data="features"
                    draggable
                    @dragstart="dragstart"
                    @drop="dropFeature"
                    @dragover="dragover"
                    @dragleave="dragleave">
                    <template slot-scope="props">
                      <b-table-column>
                        <div @click="editFeature(props)">
                          <b-notification type="is-info is-clickable" aria-close-label="Close notification" @close="delFeature(props.row)">
                            <div v-show="props.row.icon" class="is-feature-figure" :style="`background-image: url(${props.row.icon})`"></div>
                            <h3 class="has-text-centered has-text-white">{{ props.row.title }}</h3>
                            <p class="has-text-centered has-text-weight-semibold has-text-white">{{ props.row.text }}</p>
                          </b-notification>
                        </div>
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
                <div v-else class="field">
                  <div class="notification is-white">
                    No hay valores establecidos. Creá uno. Al finalizar presioná Guardar.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="tab === 'demos'">
            <div class="columns">
              <div class="column">
                <b-field label="Título principal">
                  <b-input placeholder="Probá gratis durante un mes" v-model="form.demoTitle" />
                </b-field>
                <b-field label="Texto principal">
                  <textarea class="textarea" v-model="form.demoText" rows="2" placeholder="Probalo gratis durante 30 días. No se requiere tarjeta de crédito. Cancelá en cualquier momento."></textarea>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Demo Desktop">
                  <file-picker class="filepicker-background" @fileUploaded="handleDemoDesktopFigureUploaded" :style="`background-image:url('${form.demoDesktop}')`" />
                </b-field>
              </div>
              <div class="column">
                <b-field label="Demo Mobile">
                  <file-picker class="filepicker-background" @fileUploaded="handleDemoMobileFigureUploaded" :style="`background-image:url('${form.demoMobile}')`" />
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Gestor Desktop">
                  <file-picker class="filepicker-background" @fileUploaded="handlePanelDesktopFigureUploaded" :style="`background-image:url('${form.panelDesktop}')`" />
                </b-field>
              </div>
              <div class="column">
                <b-field label="Gestor Mobile">
                  <file-picker class="filepicker-background" @fileUploaded="handlePanelMobileFigureUploaded" :style="`background-image:url('${form.panelMobile}')`" />
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="tab === 'plans'" class="content">
            <div class="columns">
              <div class="column">
                <b-field label="Título planes">
                  <b-input placeholder="Una solución para cada necesidad" v-model="form.plansTitle" />
                </b-field>
                <b-field label="Texto planes">
                  <textarea class="textarea" v-model="form.plansText" rows="2" placeholder="Conocé nuestro planes y elegí la mejor opción para tu empresa"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handlePlansFileUploaded" :style="`background-image:url('${form.plansFigure}')`" />
                </b-field>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div v-for="(item, index) in plans" :key="index" class="column">
                <card-component>
                  <b-field label="Activo" horizontal>
                    <b-switch v-model="item.active"></b-switch>
                  </b-field>
                  <hr>
                  <b-field>
                    <b-input placeholder="Título" v-model="item.title" />
                  </b-field>
                  <b-field>
                    <textarea class="textarea" v-model="item.text" rows="2" placeholder="Texto"></textarea>
                  </b-field>
                  <hr>
                  <b-field message="Precio mensual ($)">
                    <b-input placeholder="Precio mensual" v-model="item.price" />
                  </b-field>
                  <b-field message="Descuento semestral (%)">
                    <b-input placeholder="Descuento semestral" v-model="item.biannual_discount" />
                  </b-field>
                  <b-field message="Descuento anual (%)">
                    <b-input placeholder="Descuento anual" v-model="item.annual_discount" />
                  </b-field>
                  <hr>
                  <b-field v-for="index2 in nroplansfeatures" :key="`feat${index2}`" :message="`Feature #${index2} ${item.title}`">
                    <b-input placeholder="Feature" v-model="item.features[index2 - 1]" />
                  </b-field>
                  <hr>
                  <b-field v-for="index3 in nroplansmorefeatures" :key="`morefeat${index3}`" :message="`Feature extendido #${index3} ${item.title}`">
                    <b-input placeholder="Característica" v-model="item.morefeatures[index3 - 1]" />
                  </b-field>
                </card-component>
              </div>
            </div>
          </div>
          <div v-show="tab === 'faq'" class="content">
            <div class="columns">
              <div class="column">
                <b-field label="Título principal">
                  <b-input placeholder="Preguntas frecuentes" v-model="form.faqTitle" />
                </b-field>
                <b-field label="Texto principal">
                  <textarea class="textarea" v-model="form.faqText" rows="2" placeholder="Lee este resumen de preguntas y respuestas que se hacen frecuentemente nuestros clientes"></textarea>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Figura">
                  <file-picker class="filepicker-background" @fileUploaded="handleFaqFigureUploaded" :style="`background-image:url('${form.faqFigure}')`" />
                </b-field>
              </div>
            </div>
            <hr>
            <b-table
              class="is-borderless"
              :data="faqs"
              draggable
              @dragstart="dragstart"
              @drop="dropFaq"
              @dragover="dragover"
              @dragleave="dragleave">
              <template slot-scope="props">
                <b-table-column>
                <card-component>
                  <b-field grouped>
                    <b-field>
                      <textarea class="textarea" v-model="props.row.q" rows="2" placeholder="Pregunta"></textarea>
                    </b-field>
                    <b-field>
                      <textarea class="textarea" v-model="props.row.a" rows="2" placeholder="Respuesta"></textarea>
                    </b-field>
                  </b-field>
                </card-component>
                </b-table-column>
              </template>
            </b-table>
          </div>
          <hr>
          <div class="buttons is-flex-end">
            <b-button type="is-primary" :loading="loading" native-type="submit">Guardar</b-button>
          </div>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import FilePicker from '@/components/FilePicker'
export default {
  name: 'Landing',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    FilePicker,
    CardComponent
  },
  data () {
    return {
      tab: 'main',
      loading: false,
      form: {},
      feature: {
        title: '',
        text: '',
        icon: ''
      },
      featureEdit: false,
      featureEditIndex: 0,
      features: [],
      plans: {
        basic: {
          title: null,
          text: null,
          price: null,
          biannual_discount: null,
          annual_discount: null,
          features: [],
          morefeatures: []
        },
        advanced: {
          title: null,
          text: null,
          price: null,
          biannual_discount: null,
          annual_discount: null,
          features: [],
          morefeatures: []
        },
        premium: {
          title: null,
          text: null,
          price: null,
          biannual_discount: null,
          annual_discount: null,
          features: [],
          morefeatures: []
        }
      },
      faqs: [
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null },
        { q: null, a: null }
      ],
      nroplansfeatures: 15,
      nroplansmorefeatures: 10,
      nrofaqs: 20,
      draggingRow: null,
      draggingRowIndex: null
    }
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  created () {
    // this.$store.dispatch('loaded', false)
    axios.get('/landing/5f9300d791a60a67b54a013b').then(res => {
      if (res.data) {
        this.form = res.data
        if (res.data.plans) {
          this.plans = res.data.plans
        }
        if (res.data.features) {
          this.features = res.data.features
        }
        if (res.data.faqs) {
          res.data.faqs.forEach((e, i) => {
            if (res.data.faqs[i]) {
              this.$set(this.faqs, i, e)
            }
          })
        }
      }
      // this.$store.dispatch('loaded', true)
    })
  },
  mounted () {
    document.querySelectorAll('.plans-feature-add-row').forEach(row => {
      row.target.appendAfter('<input class="input"/>')
    })
  },
  methods: {
    handleFeatureFileUploaded (files) {
      this.$set(this.feature, 'icon', files[0])
    },
    handleMainFigureUploaded (files) {
      this.$set(this.form, 'mainFigure', files[0])
    },
    handleSecondaryFigureUploaded (files) {
      this.$set(this.form, 'secondaryFigure', files[0])
    },
    handleThirdFigureUploaded (files) {
      this.$set(this.form, 'thirdFigure', files[0])
    },
    handleDemoDesktopFigureUploaded (files) {
      this.$set(this.form, 'demoDesktop', files[0])
    },
    handleDemoMobileFigureUploaded (files) {
      this.$set(this.form, 'demoMobile', files[0])
    },
    handlePanelDesktopFigureUploaded (files) {
      this.$set(this.form, 'panelDesktop', files[0])
    },
    handlePanelMobileFigureUploaded (files) {
      this.$set(this.form, 'panelMobile', files[0])
    },
    handleFeaturesFileUploaded (files) {
      this.$set(this.form, 'featuresFigure', files[0])
    },
    handlePlansFileUploaded (files) {
      this.$set(this.form, 'plansFigure', files[0])
    },
    handleFaqFigureUploaded (files) {
      this.$set(this.form, 'faqFigure', files[0])
    },
    onlyMaterialIcon () {
      this.feature.icon = this.feature.icon.replace(/^mdi-/g, '')
    },
    dragstart (payload) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'copy'
    },
    dragover (payload) {
      payload.event.dataTransfer.dropEffect = 'copy'
      if (payload.event.target.closest) {
        payload.event.target.closest('tr').classList.add('is-selected')
      }
      payload.event.preventDefault()
    },
    dragleave (payload) {
      if (payload.event.target.closest) {
        payload.event.target.closest('tr').classList.remove('is-selected')
      }
      payload.event.preventDefault()
    },
    dropFeature (payload) {
      if (payload.event.target.closest) {
        payload.event.target.closest('tr').classList.remove('is-selected')
      }
      const droppedOnRowIndex = payload.index
      let features = this.form.features
      features.map((e, i) => {
        e.order = i
        return e
      })
      features[this.draggingRowIndex].order = droppedOnRowIndex
      features[droppedOnRowIndex].order = this.draggingRowIndex
      features.sort((a, b) => {
        return (b.order < a.order) ? 1 : ((b.order > a.order) ? -1 : 0)
      })
      this.$buefy.toast.open(`Se movió feature ${this.draggingRow.title} de fila ${this.draggingRowIndex} a ${droppedOnRowIndex}`)
    },
    dropFaq (payload) {
      if (payload.event.target.closest) {
        payload.event.target.closest('tr').classList.remove('is-selected')
      }
      const droppedOnRowIndex = payload.index
      let faqs = this.faqs
      faqs.map((e, i) => {
        e.order = i
        return e
      })
      faqs[this.draggingRowIndex].order = droppedOnRowIndex
      faqs[droppedOnRowIndex].order = this.draggingRowIndex
      faqs.sort((a, b) => {
        return (b.order < a.order) ? 1 : ((b.order > a.order) ? -1 : 0)
      })
      this.$buefy.toast.open(`Se movió FAQ ${this.draggingRow.title} de fila ${this.draggingRowIndex} a ${droppedOnRowIndex}`)
    },
    addFeature () {
      let features = this.features
      if (!features) {
        features = []
      }
      features.push(this.feature)
      this.feature = {
        icon: '',
        title: '',
        text: ''
      }
    },
    delFeature (item) {
      setTimeout(() => {
        this.features = this.features.filter(e => !(e.icon === item.icon))
        this.feature = {}
      }, 50)
    },
    cancelEditFeature () {
      this.featureEdit = false
      this.feature = {
        icon: '',
        title: '',
        text: ''
      }
    },
    editFeature (props) {
      this.featureEdit = true
      this.featureEditIndex = props.index
      this.feature = props.row
    },
    submit () {
      this.loading = true
      this.form.features = this.features
      Object.keys(this.plans).map(e => {
        this.plans[e].features = this.plans[e].features.filter(i => i)
        this.plans[e].morefeatures = this.plans[e].morefeatures.filter(i => i)
      })
      this.form.plans = this.plans
      this.form.faqs = this.faqs.filter(e => e.q)
      axios.post('/landing/5f9300d791a60a67b54a013b', this.form).then(res => {
        this.loading = false
        this.$buefy.toast.open({
          message: `Landing actualizada`,
          type: 'is-success',
          queue: false
        })
      })
    }
  }
}
</script>
