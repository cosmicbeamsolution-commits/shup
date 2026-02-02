<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <title-bar :title-stack="titleStack" :call-action="callAction"/>
    <hero-bar>
      <b-icon icon="credit-card-multiple-outline" size="is-large"/>
      {{ heroTitle }}
      <router-link slot="right" :to="heroRouterLinkTo" class="button">
        {{ heroRouterLinkLabel }}
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <card-component :title="formCardTitle" icon="credit-card-multiple-outline" class="tile is-child">
          <form @submit.prevent="submit">
            <b-field label="Cobrado" horizontal>
              <b-switch v-model="form.active"></b-switch>
            </b-field>
            <hr>
            <b-field label="Código" message="Código de la transacción" horizontal>
              <b-input placeholder="#8349275773" v-model="form.codigo" required />
            </b-field>
            <hr>
            <b-field label="Código Proveedor" message="" horizontal>
              <b-input placeholder="5e6f89d15e0bfb0f32e4ece2" v-model="form._id" disabled />
            </b-field>
            <b-field label="Proveedor" message="" horizontal>
              <b-input placeholder="Proveedor" v-model="form.name" required />
            </b-field>
            <hr>
            <b-field label="Método de pago" message="" horizontal>
              <b-select placeholder="Select a department" v-model="form.metodo" required>
                <option v-for="(item, index) in metodos" :key="index" :value="item">
                  {{ item }}
                </option>
              </b-select>
            </b-field>
            <div v-show="form.metodo && form.metodo.startsWith('Tarjeta')">
              <b-field grouped horizontal>
                <b-field label="Nro. tarjeta" message="">
                  <b-input placeholder="4417-6603-5544-5310" v-model="form.tarjeta" />
                </b-field>
                <b-field label="Validez de la tarjeta" message="">
                  <b-input placeholder="03/2030" v-model="form.tarjeta_validez" />
                </b-field>
              </b-field>
              <b-field grouped horizontal>
                <b-field label="Código de seguridad" message="">
                  <b-input placeholder="003" v-model="form.tarjeta_codigo" />
                </b-field>
                <b-field label="Banco" message="">
                  <b-input placeholder="Banco Nación" v-model="form.banco" />
                </b-field>
              </b-field>
              <hr>
            </div>
            <b-field label="Monto" message="Ingresá el monto de la transacción" horizontal>
              <b-input placeholder="3000" v-model="form.price" required />
            </b-field>
            <b-field label="Monto IVA" message="Ingresá el monto de IVA correspondiente" horizontal>
              <b-input placeholder="630" v-model="form.iva_price" required />
            </b-field>
            <b-field label="IVA incluído" horizontal>
              <b-switch v-model="form.iva"></b-switch>
            </b-field>
            <b-field label="Moneda" message="Ingresá una moneda para el pago" horizontal>
              <b-input placeholder="ARS" v-model="form.moneda" required />
            </b-field>
            <b-field label="Validez" message="Validez del pago" horizontal>
              <b-select placeholder="Select a department" v-model="form.validez" required>
                <option v-for="(item, index) in plazos" :key="index" :value="item">
                  {{ item }}
                </option>
              </b-select>
            </b-field>
            <vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="form.content"> </vue-editor>
            <hr>
            <b-field horizontal>
              <b-button type="is-primary" :loading="isLoading" native-type="submit">Guardar</b-button>
            </b-field>
          </form>
        </card-component>
      </tiles>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'PaymentsForm',
  components: {
    NavBar,
    AsideMenu,
    CardComponent,
    Tiles,
    HeroBar,
    TitleBar,
    VueEditor
  },
  props: {
    id: {
      default: null
    }
  },
  data () {
    return {
      customElementsForm: {
        checkbox: [],
        radio: null,
        switch: true,
        file: null
      },
      isLoading: false,
      htmlForEditor: '',
      form: this.getClearFormObject(),
      metodos: ['Mercadopago', 'Transferencia bancaria', 'Tarjeta de débito', 'Tarjeta de crédito', 'Envío a domicilio'],
      plazos: ['Mensual', 'Bimestral', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual'],
      createdReadable: null,
      isProfileExists: false
    }
  },
  computed: {
    callAction () {
      return {
        link: '/pagos',
        icon: 'credit-card-multiple-outline',
        title: 'Pagos'
      }
    },
    titleStack () {
      let lastCrumb

      if (this.isProfileExists) {
        lastCrumb = this.form.name
      } else {
        lastCrumb = 'Nuevo pago'
      }

      return [
        'Admin',
        'Pagos',
        lastCrumb
      ]
    },
    heroTitle () {
      if (this.isProfileExists) {
        return this.form.name
      } else {
        return 'Crear Pago'
      }
    },
    heroRouterLinkTo () {
      if (this.isProfileExists) {
        // return { name: 'pago.new' }
        return '/pagos/' + this.$route.params.id + '/new'
      } else {
        return '/pagos'
      }
    },
    heroRouterLinkLabel () {
      if (this.isProfileExists) {
        return 'Editar Pago'
      } else {
        return 'Pagos'
      }
    },
    formCardTitle () {
      if (this.isProfileExists) {
        return 'Editar Pago'
      } else {
        return 'Nuevo pago'
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('files', file)
      axios({
        url: '/upload/multi',
        method: 'POST',
        data: formData
      }).then(result => {
        Editor.insertEmbed(cursorLocation, 'image', result.data[0])
        resetUploader()
      }).catch(err => {
        console.log(err)
      })
    },
    getClearFormObject () {
      return {
        _id: null,
        metodo: null,
        proveedor: null,
        price: null,
        iva_price: null,
        iva: null,
        total: null,
        active: true,
        created: new Date()
      }
    },
    getData () {
      if (this.$route.params.id) {
        if (this.$route.params.id !== 'new') {
          axios
            .get('/pagos/' + this.$route.params.id)
            .then(res => {
              let item = res.data
              if (item) {
                this.isProfileExists = true
                this.form = item
                this.form.created_date = new Date(item.created)
                this.createdReadable = moment(new Date(item.created)).format('MMM D, Y').toString()
              } else {
                this.$router.push({ name: 'pagos.new' })
              }
            })
            .catch(e => {
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        }
      }
    },
    input (v) {
      this.createdReadable = moment(v).format('MMM D, Y').toString()
    },
    submit () {
      this.isLoading = true
      this.form.total = parseFloat(this.form.price) + parseFloat(this.form.iva_price)
      setTimeout(() => {
        if (this.$route.params.id !== 'new') {
          axios
            .post('/pagos/' + this.$route.params.id, this.form)
            .then(res => {
              this.isLoading = false
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Pago actualizado',
                  queue: false
                })
                this.$router.push({ name: 'pagos' })
              }
            })
            .catch(e => {
              this.isLoading = false
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        } else {
          axios
            .put('/pagos', this.form)
            .then(res => {
              this.isLoading = false
              if (res.data) {
                this.$buefy.snackbar.open({
                  message: 'Pago agregado',
                  queue: false
                })
                this.$router.push({ name: 'pagos' })
              }
            })
            .catch(e => {
              this.isLoading = false
              this.$buefy.toast.open({
                message: `Error: ${e.message}`,
                type: 'is-danger',
                queue: false
              })
            })
        }
      }, 500)
    }
  },
  watch: {
    id (newValue) {
      this.isProfileExists = false

      if (!newValue) {
        this.form = this.getClearFormObject()
      } else {
        this.getData()
      }
    }
  }
}
</script>
