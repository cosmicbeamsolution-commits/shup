<template>
  <div>
    <title-bar :title-stack="titleStack"/>
    <section class="section is-main-section is-body-centered">
      <div class="columns is-centered">
        <div class="column is-5">
          <div ref="wizardContainer" class="animated">
            <card-component :title="wizardTitle" icon="assistant" class="animated">
              <div class="content wizard" ref="wizardSteps">
                <form v-show="wizardStep === 0">
                  <div class="column">
                    <h5>Bienvenido al asistente de configuración</h5>
                    <p>A través de este asistente te ayudaremos a configurar los aspectos básicos de tu tienda. Al finalizar vas a poder empezar a cargar tu catálogo. Solo vas a tener que completarlo una vez.</p>
                    <hr>
                    <h5>Términos y condiciones de tiendas</h5>
                    <pre class="terms" v-html="basic.settings.terms"/>
                    <hr>
                    <div class="buttons is-flex-center">
                      <b-button type="is-success" @click="nextStep">Acepto términos y condiciones</b-button>
                    </div>
                  </div>
                </form>
                <form v-show="wizardStep === 1" @submit.prevent="save">
                  <b-field label="Tu nombre">
                    <b-input icon="account" type="text" v-model="form.first_name" placeholder="Juan Manuel" required />
                  </b-field>
                  <b-field label="Tu apellido">
                    <b-input icon="account" type="text" v-model="form.last_name" placeholder="Rodríguez" required />
                  </b-field>
                  <b-field label="Tu teléfono">
                    <input class="input " v-model="form.phone" type="text" @keyup="onlyNumeric" placeholder="1145558888" required />
                  </b-field>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-light" @click="prevStep">Atrás</b-button>
                    <b-button native-type="submit" type="is-success" :loading="saving">Continuar</b-button>
                  </div>
                </form>
                <form v-show="wizardStep === 2" @submit.prevent="save">
                  <b-field label="¿Qué ofrece tu tienda?"/>
                  <div class="column">
                    <div class="buttons has-addons is-flex-center">
                      <button type="button" class="button  is-light" :class="{ 'is-success': form.type === 'products' || !form.type }" @click="form.type = 'products'">Productos</button>
                      <button type="button" class="button  is-light" :class="{ 'is-success': form.type === 'services' }" @click="form.type = 'services'">Servicios</button>
                    </div>
                  </div>
                  <b-field label="Describí brevemente de qué se trata tu tienda">
                    <textarea class="textarea is-rows-condensed" @keyup="checkShopText" v-model="form.text" placeholder="Comida gourmet con productos regionales, la mejor atención..." required />
                  </b-field>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-light" @click="prevStep">Atrás</b-button>
                    <b-button native-type="submit" type="is-success" :loading="saving">Continuar</b-button>
                  </div>
                </form>
                <form v-show="wizardStep === 3" @submit.prevent="save">
                  <section class="profile-faker">
                    <file-picker class="logo" @fileUploaded="handleLogoUploaded" :style="`background-image:url('${form.logo}')`" />
                    <file-picker class="background" ref="backgroundPicker" @fileUploaded="handleBackgroundUploaded" :style="`background-image:url('${form.background}')`" />
                  </section>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-light" @click="prevStep">Atrás</b-button>
                    <b-button native-type="submit" type="is-success" :loading="saving">Continuar</b-button>
                  </div>
                </form>
                <form v-show="wizardStep === 4" @submit.prevent="save" novalidate>
                  <b-field label="¿Qué área de cobertura tiene tu tienda?"/>
                  <div class="column">
                    <div class="buttons has-addons is-flex-center">
                      <button type="button" class="button  is-light" :class="{ 'is-success': form.scope === 'country' }" @click="setShopScope('country')">Todo el país</button>
                      <button type="button" class="button  is-light" :class="{ 'is-success': form.scope === 'custom' }" @click="setShopScope('custom')">Localizado</button>
                    </div>
                  </div>
                  <b-field label="¿Dónde está ubicada tu tienda?">
                    <input type="text"
                      v-model="form.address"
                      id="address"
                      class="input "
                      placeholder="Dirección de tu tienda"
                      required/>
                  </b-field>
                  <b-field label="¿Alguna indicación más sobre la dirección?">
                    <b-input type="text" v-model="form.address_extra" placeholder="Piso, torre, departamento, ..." />
                  </b-field>
                  <div v-show="form.scope === 'country' && form.type === 'products'" class="field">
                    <b-field label="Costos de entrega"/>
                    <p>Completá la formula de cálculo de costo de envío y previsualizá costos dibujando segmentos en el mapa. Podés hacer click en un punto para borrarlo.</p>
                    <b-field>
                      <b-field label="Costo de envío (ARS)">
                        <b-numberinput v-model="form.cost_delivery_base" @input="previewDeliveryCost" controls-position="compact" controls-rounded></b-numberinput>
                      </b-field>
                    </b-field>
                    <b-field>
                      <b-field label="Adicional por km (ARS)">
                        <b-numberinput v-model="form.cost_delivery_km" step="0.01" @input="previewDeliveryCost" controls-position="compact" controls-rounded/>
                      </b-field>
                    </b-field>
                  </div>
                  <div v-show="form.scope === 'custom' && form.type === 'products'" class="field">
                    <b-field label="Área de cobertura y costo de envío"/>
                    <p>Dibujá un rectángulo en el mapa haciendo click dos veces para establecer el área de cobertura.</p>
                    <b-field v-show="form.type === 'products'">
                      <b-field label="Costo de envío (ARS)">
                        <b-numberinput v-model="form.cost_delivery_base" controls-position="compact" controls-rounded></b-numberinput>
                      </b-field>
                    </b-field>
                  </div>
                  <div v-show="form.scope === 'country' && form.type === 'products'" id="map_country" class="map"></div>
                  <div v-show="form.scope === 'custom'" id="map_custom" class="map"></div>
                  <div v-show="form.scope === 'country' && form.type === 'products' && mapDistance" class="notification is-info">
                    <p>Distancia: {{ mapDistance }} km</p>
                    <p v-show="form.cost_delivery_base && form.cost_delivery_km">Costo de envío {{ mapDeliveryCost }} ARS</p>
                  </div>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-light" @click="prevStep">Atrás</b-button>
                    <b-button native-type="submit" type="is-success" :loading="saving">Continuar</b-button>
                  </div>
                </form>
                <form v-show="wizardStep === 5" @submit.prevent="save">
                  <b-field label="¿Cómo te gustaría cobrar las ventas?" message="Si elegís cobrar con Mercado Pago necesitás ingresar el access token" class="has-check">
                    <checkbox-picker :options="{  'takeaway': 'Retiro en sucursal', 'cash': 'Envío a domicilio', 'bank': 'CBU o ALIAS', 'mercadopago': 'Mercado Pago' }" v-model="payment_methods" type="is-primary"/>
                  </b-field>
                  <b-field v-show="payment_methods.includes('mercadopago')" label="Ingresá tu access token de Mercado Pago">
                    <input class="input " :class="{ 'is-success': checkMpAccessTokenFormat, 'is-danger': !checkMpAccessTokenFormat }" type="text" v-model="form.mp_access_token" placeholder="APP_USR-3233559644412004-102816-8ef374b8cca647798ecd4b60fd8894e2-000000000" />
                  </b-field>
                  <b-field v-show="payment_methods.includes('bank')" label="Ingresá tu CBU" message="Introducí el CBU de tu cuenta">
                    <input class="input" :class="{ 'is-success': checkCBUFormat, 'is-danger': !checkCBUFormat }" type="text" v-model="form.bank_cbu" placeholder="0720168088000036018000" />
                  </b-field>
                  <b-field v-show="payment_methods.includes('bank')" label="Ingresá tu ALIAS" message="Ó el ALIAS de tu cuenta">
                    <input class="input" :class="{ 'is-success': checkCBUFormat, 'is-danger': !checkCBUFormat }" type="text" v-model="form.bank_alias" placeholder="MESA.BAR.MATE"  message="ó el ALIAS de tu cuenta"/>
                  </b-field>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-light" @click="prevStep">Atrás</b-button>
                    <b-button native-type="submit" type="is-success" :loading="saving">Continuar</b-button>
                  </div>
                </form>
                <form v-show="wizardStep === 6">
                  <div class="column">
                    <h5>¡Felicitaciones!</h5>
                    <p>Ajustaste correctamente tu tienda con los datos básicos. Presioná para crear tu catálogo!</p>
                  </div>
                  <hr>
                  <div class="buttons is-flex-center">
                    <b-button type="is-success" @click="finishWizard">Crear mi catálogo ahora</b-button>
                  </div>
                </form>
              </div>
            </card-component>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TitleBar from '@/components/TitleBar'
import CardComponent from '@/components/CardComponent'
import CheckboxPicker from '@/components/CheckboxPicker'
import FilePicker from '@/components/FilePicker'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
export default {
  name: 'wizard',
  components: {
    CardComponent,
    CheckboxPicker,
    FilePicker,
    TitleBar
  },
  data () {
    return {
      defaults: {
        background: 'https://cdn.overlemon.com/img/background.jpg',
        logo: 'https://cdn.overlemon.com/img/logo.jpg',
        type: 'products',
        scope: 'country'
      },
      form: {},
      payment_methods: [],
      saving: false,
      wizardStep: 0,
      shopTextLength: 0,
      // shopTextMin: 30,
      wizardStepCount: 0,
      costDeliveryBase: 350,
      costDeliveryKm: 0.75,
      mapCenter: [-65.368325, -36.879621],
      mapZoom: 3,
      mapToken: this.$root.accessToken,
      distance: 0,
      mapDistance: 0,
      mapDeliveryCost: 0,
      mapCountryLoaded: false,
      mapCustomLoaded: false,
      mapAutocompleteLoaded: false,
      bankCbuRe: /^[0-9]{22}$/,
      mpAccessTokenRe: /^APP_USR-[0-9]{16}-[0-9]{6}-(\w){32}-[0-9]{9}$/,
      wizardStepsTitles: [
        'Términos y condiciones',
        'Datos personales',
        'Tipo y descripción',
        'Logo y fondo',
        'Área de cobertura',
        'Métodos de pago',
        'Finalizado'
      ]
    }
  },
  created () {
    if (this.shop) {
      this.form = this.shop
      Object.keys(this.defaults).forEach(i => {
        let value = this.defaults[i]
        if (!this.form[i]) {
          this.form[i] = value
        }
      })
      if (this.form.payment_methods) {
        this.payment_methods = this.form.payment_methods
      }
      if (this.shop.text) {
        this.shopTextLength = this.shop.text.length
      }
    }
  },
  mounted () {
    this.wizardStepCount = this.$refs.wizardSteps.children.length
  },
  computed: {
    checkCBUFormat () {
      return this.bankCbuRe.test(this.form.bank_cbu) || (this.form.bank_alias && this.form.bank_alias.length > 5)
    },
    checkMpAccessTokenFormat () {
      return this.mpAccessTokenRe.test(this.form.mp_access_token)
    },
    wizardTitle () {
      if (this.wizardStep > this.wizardStepCount) {
        return 'Hubo un error con el asistente.'
      }
      if (this.wizardStep === 0) {
        return this.wizardStepsTitles[this.wizardStep]
      } else if (this.wizardStep === this.wizardStepsTitles.length - 1) {
        return 'Finalizado'
      }
      return `${this.wizardStepsTitles[this.wizardStep]}: ${this.wizardStep} de ${this.wizardStepCount - 2}`
    },
    titleStack () {
      return [
        'geotiendas',
        this.shop.shop,
        'Asistente de Configuración'
      ]
    },
    ...mapState([
      'basic',
      'shop'
    ])
  },
  methods: {
    previewDeliveryCost () {
      if (this.form.cost_delivery_base && this.form.cost_delivery_km) {
        this.mapDeliveryCost = parseInt(this.form.cost_delivery_base + (this.form.cost_delivery_km * this.distance))
      }
    },
    setShopScope (scope) {
      this.$set(this.form, 'scope', scope)
      this.checkWizard()
    },
    checkShopText () {
      if (this.form.text) {
        this.shopTextLength = this.form.text.length
      }
    },
    handleLogoUploaded (files) {
      this.$set(this.form, 'logo', files[0])
    },
    handleBackgroundUploaded (files) {
      this.$set(this.form, 'background', files[0])
    },
    onlyNumeric () {
      if (this.form.phone) {
        this.form.phone = this.form.phone.replace(/[^0-9]/g, '').replace(/^0+/, '')
      }
    },
    save () {
      /* if (this.wizardStep === 2) {
        if (this.shopTextLength < this.shopTextMin) {
          return this.$buefy.toast.open({
            message: `La descripción de tu tienda necesita al menos ${this.shopTextMin} caracteres`,
            type: 'is-danger'
          })
        }
      } */

      if (this.wizardStep === 3) {
        if (!this.form.logo) {
          return this.$buefy.toast.open({
            message: `Por favor seleccioná un logo para tu tienda`
          })
        }
      }

      if (this.wizardStep === 4) {
        if (!this.form.geo) {
          document.getElementById('address').focus()
          return this.$buefy.toast.open({
            message: `Por favor establecé la ubicación de tu tienda seleccionando una opción de la lista`
          })
        }
      }

      if (this.wizardStep === 5) {
        if (this.payment_methods.length === 0) {
          return this.$buefy.toast.open({
            message: `Al menos un método de pago es necesario para vender con tu tienda. Elegí al menos uno.`
          })
        }

        if (this.payment_methods.includes('mercadopago')) {
          if (!this.mpAccessTokenRe.test(this.form.mp_access_token)) {
            return this.$buefy.toast.open({
              message: `El access token de Mercado Pago ingresado es incorrecto. Debe comenzar con APP_USER-...`
            })
          }
        }

        if (this.payment_methods.includes('bank')) {
          if (!this.bankCbuRe.test(this.form.bank_cbu) && (!this.form.bank_alias || this.form.bank_alias.length < 5)) {
            return this.$buefy.toast.open({
              message: `Para cobrar con Banco llená tu CBU o ALIAS.`
            })
          }
          if (this.form.bank_cbu && !this.bankCbuRe.test(this.form.bank_cbu)) {
            return this.$buefy.toast.open({
              message: `El CBU ingresado tiene un formato incorrecto. Debe tener 22 dígitos.`
            })
          }
        }
        this.form.payment_methods = this.payment_methods
      }

      this.saving = true
      if (this.form.type === 'services') {
        this.form.cost_delivery_base = 0
      } else {
        this.form.cost_delivery_base = parseFloat(this.form.cost_delivery_base)
      }
      if (this.form.cost_delivery_km) {
        this.form.cost_delivery_km = parseFloat(this.form.cost_delivery_km)
      }
      this.$store.dispatch('update', this.form).then(res => {
        this.saving = false
        this.nextStep()
      })
    },
    nextStep () {
      let wizard = this.$refs.wizardContainer
      wizard.classList.remove('fadeOutLeft', 'fadeInRight', 'fadeOutRight', 'fadeInLeft')
      wizard.classList.add('fadeOutLeft')
      setTimeout(() => {
        this.wizardStep++
        wizard.classList.remove('fadeOutLeft', 'fadeInRight', 'fadeOutRight', 'fadeInLeft')
        wizard.classList.add('fadeInRight')
        this.checkWizard()
      }, 500)
    },
    prevStep () {
      let wizard = this.$refs.wizardContainer
      wizard.classList.remove('fadeOutLeft', 'fadeInRight', 'fadeOutRight', 'fadeInLeft')
      wizard.classList.add('fadeOutRight')
      setTimeout(() => {
        this.wizardStep--
        wizard.classList.remove('fadeOutLeft', 'fadeInRight', 'fadeOutRight', 'fadeInLeft')
        wizard.classList.add('fadeInLeft')
        this.checkWizard()
        this.saving = false
      }, 500)
    },
    checkWizard () {
      if (this.wizardStep === this.wizardStepCount - 1) {
        this.$store.dispatch('update', {
          wizard_complete: true,
          wizard_complete_date: new Date()
        })
      }
      if (this.wizardStep === 4) {
        if (!this.form.cost_delivery_base) {
          this.form.cost_delivery_base = this.costDeliveryBase
        }
        if (this.form.type === 'products') {
          if (!this.form.cost_delivery_km) {
            this.form.cost_delivery_km = this.costDeliveryKm
          }
        }
        if (!this.mapAutocompleteLoaded) {
          this.initAutocomplete('address')
        }
        setTimeout(() => {
          if (this.form.type === 'products') {
            if (this.form.scope === 'country') {
              if (!this.mapCountryLoaded) {
                this.drawCountryMap()
              }
            }
          }
          if (this.form.scope === 'custom') {
            if (!this.mapCustomLoaded) {
              this.drawCustomMap()
            }
          }
        }, 1000)
      }
    },
    initAutocomplete (id) {
      let t = this
      var autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById(id),
        {
          types: ['geocode'],
          strictBounds: true,
          componentRestrictions: {
            country: this.shop.country_iso
          }
        }
      )
      window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
        var place = autocomplete.getPlace()
        // let ac = place.address_components
        // let city = ac[0]['short_name']
        t.form.address = place.formatted_address
        t.form.geo = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        t.checkWizard()
      })
      this.mapAutocompleteLoaded = true
    },
    drawCountryMap () {
      let t = this
      mapboxgl.accessToken = this.mapToken
      var map = new mapboxgl.Map({
        container: 'map_country',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.mapCenter,
        zoom: this.mapZoom
      })

      var geojson = {
        'type': 'FeatureCollection',
        'features': []
      }

      var linestring = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': []
        }
      }

      map.on('load', function () {
        map.addSource('geojson', {
          'type': 'geojson',
          'data': geojson
        })

        map.addLayer({
          id: 'measure-points',
          type: 'circle',
          source: 'geojson',
          paint: {
            'circle-radius': 5,
            'circle-color': '#000'
          },
          filter: ['in', '$type', 'Point']
        })

        map.addLayer({
          id: 'measure-lines',
          type: 'line',
          source: 'geojson',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#000',
            'line-width': 2.5
          },
          filter: ['in', '$type', 'LineString']
        })

        map.on('click', function (e) {
          var features = map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
          })

          if (geojson.features.length > 1) {
            geojson.features.pop()
          }

          if (features.length) {
            var id = features[0].properties.id
            geojson.features = geojson.features.filter(function (point) {
              return point.properties.id !== id
            })
          } else {
            var point = {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [e.lngLat.lng, e.lngLat.lat]
              },
              'properties': {
                'id': String(new Date().getTime())
              }
            }

            geojson.features.push(point)
          }

          if (geojson.features.length > 1) {
            linestring.geometry.coordinates = geojson.features.map(function (point) {
              return point.geometry.coordinates
            })

            geojson.features.push(linestring)
            let distance = window.turf.length(linestring)
            t.mapDistance = distance.toLocaleString()
            t.distance = distance
            t.previewDeliveryCost()
          }

          map.getSource('geojson').setData(geojson)
        })

        map.on('mousemove', function (e) {
          var features = map.queryRenderedFeatures(e.point, {
            layers: ['measure-points']
          })
          // UI indicator for clicking/hovering a point on the map
          map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair'
        })
      })

      this.mapCountryLoaded = true
    },
    drawCustomMap () {
      let deliveryBounds = this.form.delivery_bounds
      class ExtendDrawBar {
        constructor (opt) {
          let ctrl = this
          ctrl.draw = opt.draw
          ctrl.buttons = opt.buttons || []
          ctrl.onAddOrig = opt.draw.onAdd
          ctrl.onRemoveOrig = opt.draw.onRemove
        }
        onAdd (map) {
          let ctrl = this
          ctrl.map = map
          ctrl.elContainer = ctrl.onAddOrig(map)
          ctrl.buttons.forEach((b) => {
            ctrl.addButton(b)
          })
          return ctrl.elContainer
        }
        onRemove (map) {
          let ctrl = this
          ctrl.buttons.forEach((b) => {
            ctrl.removeButton(b)
          })
          ctrl.onRemoveOrig(map)
        }
        addButton (opt) {
          let ctrl = this
          var elButton = document.createElement('button')
          elButton.className = 'mapbox-gl-draw_ctrl-draw-btn'
          if (opt.classes instanceof Array) {
            opt.classes.forEach((c) => {
              elButton.classList.add(c)
            })
          }
          elButton.addEventListener(opt.on, opt.action)
          ctrl.elContainer.appendChild(elButton)
          opt.elButton = elButton
        }
        removeButton (opt) {
          opt.elButton.removeEventListener(opt.on, opt.action)
          opt.elButton.remove()
        }
      }
      mapboxgl.accessToken = this.mapToken
      let center = this.mapCenter
      let zoom = this.mapZoom
      if (this.form.geo) {
        center = [this.form.geo.lng, this.form.geo.lat]
        zoom = 10
      }
      const map = new mapboxgl.Map({
        container: 'map_custom',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom
      })
      const modes = MapboxDraw.modes
      modes.draw_rectangle = DrawRectangle
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: true
        },
        modes: modes
      })
      var drawBar = new ExtendDrawBar({
        draw: draw,
        buttons: [
          {
            on: 'click',
            action: drawRectangleMode,
            classes: ['mapbox-gl-draw_polygon']
          }
        ]
      })
      function drawRectangleMode (e) {
        e.preventDefault()
        draw.changeMode('draw_rectangle')
      }
      map.addControl(drawBar, 'top-left')
      map.on('load', function (e) {
        if (deliveryBounds && Object.keys(deliveryBounds).length && deliveryBounds.features.length) {
          draw.add(deliveryBounds)
          let coordinates = deliveryBounds.features[0].geometry.coordinates[0]
          var bounds = coordinates.reduce((e, i) => {
            return e.extend(i)
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
          map.fitBounds(bounds, {
            padding: 100,
            offset: [0, 0]
          })
        }
      })

      let updateArea = e => {
        const bounds = draw.getAll()
        this.form.delivery_bounds = bounds
      }

      map.on('draw.create', updateArea)
      map.on('draw.delete', updateArea)
      map.on('draw.update', updateArea)
      this.mapCustomLoaded = true
    },
    finishWizard () {
      this.saving = true
      this.$store.dispatch('update', {
        wizard_complete: true,
        wizard_complete_date: new Date()
      }).then(res => {
        this.saving = false
        this.$router.push('/catalogo')
      })
    }
  }
}
</script>
