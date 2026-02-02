<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="shopping" size="is-medium"/> Tienda
    </hero-bar>
    <section class="section is-main-section">
      <card-component>
        <form @submit.prevent="submit" novalidate>
          <div class="tabs is-centered is-boxed">
            <ul>
              <li :class="{ 'is-active': tab === 'texts' }">
                <a @click="tab = 'texts'">
                  <span>Perfil</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'type' }">
                <a @click="tab = 'type'">
                  <span>Tipo</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'stock' }">
                <a @click="tab = 'stock'">
                  <span>Catálogo</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'about' }">
                <a @click="tab = 'about'">
                  <span>Info</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'scope' }">
                <a @click="tab = 'scope'">
                  <span>Envíos</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'payments' }">
                <a @click="tab = 'payments'">
                  <span>Cobros</span>
                </a>
              </li>
              <li :class="{ 'is-active': tab === 'promos' }">
                <a @click="tab = 'promos'">
                  <span>Promos</span>
                </a>
              </li>
            </ul>
          </div>
          <div v-show="tab === 'texts'">
            <label class="label">Establecé la información de tu tienda</label>
            <p>El nombre y la información básica de tu tienda, resumí en pocas palabras de que se trata tu tienda.</p>
            <hr>
            <div class="columns">
              <div class="column">
                <b-field label="Nombre de tu geotienda">
                  <b-input placeholder="Delicias del Sur" v-model="form.shop" required />
                </b-field>
                <b-field label="Describí brevemente de qué se trata tu geotienda">
                  <textarea class="textarea is-rows-condensed" @keyup="checkShopText" v-model="form.text" placeholder="Comida gourmet con productos regionales, la mejor atención..." required />
                </b-field>
              </div>
              <div class="column">
                <section class="profile-faker">
                  <file-picker class="logo" @fileUploaded="handleLogoUploaded" :style="`background-image:url('${form.logo}')`" />
                  <file-picker class="background" ref="backgroundPicker" @fileUploaded="handleBackgroundUploaded" :style="`background-image:url('${form.background}')`" />
                </section>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/perfil" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de info de la tienda</a></p>
          </div>
          <div v-show="tab === 'stock'" class="content">
            <label class="label">Establecé la orientación de las tarjetas</label>
            <p>Si ofrecés productos como ropa ó lámparas tal vez necesites activar la orientación retrato. Para el resto de los productos la orientación paisaje puede resultar la mejor opción.</p>
            <hr>
            <div class="columns">
              <div class="column">
                <div class="buttons has-addons is-flex-center">
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.item_layout === 'landscape' || !form.item_layout }" @click="form.item_layout = 'landscape'">Paisaje</button>
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.item_layout === 'portrait' }" @click="form.item_layout = 'portrait'">Retrato</button>
                </div>
              </div>
              <div class="column is-narrow">
                <div class="item-layout" :class="form.item_layout"></div>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/orientacion-tarjeta" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca orientación de tarjeta</a></p>
          </div>
          <div v-show="tab === 'type'" class="content">
            <label class="label">Establecé el tipo de tu tienda</label>
            <p>Si ofrecés productos deberás establecer la geolocalización y los costos de envío. Si ofrecés servicios no necesitarás establecer los precios de antemano ya que podrás cotizarlo de acuerdo a las necesidades. Los servicios tampoco necesitan de costos de envío. </p>
            <hr>
            <div class="columns">
              <div class="column">
                <div class="buttons has-addons is-flex-center">
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.type === 'products' || !form.type }" @click="form.type = 'products'">Productos</button>
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.type === 'services' }" @click="form.type = 'services'">Servicios</button>
                </div>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/tipo" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de tipo de la tienda</a></p>
          </div>
          <div v-show="tab === 'about'" class="content">
            <label class="label">Agregá información adicional de tu tienda</label>
            <p>Si querés obtener ventas confiables es importante que tus clientes sepan quien sos antes de conocerte, este espacio está orientado a que desarrolles de que se trata tu tienda.</p>
            <hr>
            <div class="columns">
              <div class="column">
                <!--vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="form.about"> </vue-editor-->
                <b-field label="Acerca de mi tienda">
                  <textarea class="textarea is-rows-expanded" v-model="form.about" placeholder="Información complementaria de tu tienda" />
                </b-field>
                <hr>
                <b-field label="Mensaje importante de tu tienda">
                  <textarea class="textarea is-rows-condensed" v-model="form.about_important" placeholder="Realizamos los envíos los días lunes sin excepción" />
                </b-field>
              </div>
              <div class="column">
                <label class="label">Imagen de mi tienda</label>
                <section class="profile-faker">
                  <file-picker class="about" @fileUploaded="handleAboutPhotoUploaded" :style="`background-image:url('${form.about_photo}')`" />
                </section>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/info" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de info adicional de la tienda</a></p>
          </div>
          <div v-show="tab === 'scope'" class="content">
            <label class="label">Establecé el área de cobertura de tus envíos</label>
            <p>Si ofrecés productos como ropa ó lámparas tal vez necesites activar la orientación retrato. Para el resto de los productos la orientación paisaje puede resultar la mejor opción.</p>
            <hr>
            <div class="columns">
              <div class="column">
                <div class="buttons has-addons is-flex-center">
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.scope === 'country' || !form.scope }" @click="setShopScope('country')">Todo el país</button>
                  <button type="button" class="button  is-light" :class="{ 'is-success': form.scope === 'custom' }" @click="setShopScope('custom')">Localizado</button>
                </div>
                <b-field label="¿Dónde está ubicada tu geotienda?">
                  <input type="text"
                    v-model="form.address"
                    id="address"
                    class="input "
                    placeholder="Dirección de tu geotienda"
                    required/>
                </b-field>
                <b-field label="¿Alguna indicación más sobre la dirección?">
                  <b-input type="text" v-model="form.address_extra" placeholder="Piso, torre, departamento, ..." />
                </b-field>
                <div v-if="form.type === 'products'" class="field">
                  <b-field>
                    <b-field label="Costo de envío (ARS)">
                      <b-numberinput v-model="form.cost_delivery_base" @input="previewDeliveryCost" controls-position="compact" controls-rounded/>
                    </b-field>
                  </b-field>
                  <b-field v-if="form.scope === 'country'">
                    <b-field label="Adicional por km (ARS)">
                      <b-numberinput v-model="form.cost_delivery_km" step="0.01" @input="previewDeliveryCost" controls-position="compact" controls-rounded/>
                    </b-field>
                  </b-field>
                  <p v-show="form.scope === 'country'">Completá la formula de cálculo de costo de envío y previsualizá costos dibujando segmentos en el mapa. Podés hacer click en un punto para borrarlo.</p>
                  <p v-show="form.scope === 'custom'">Dibujá un rectángulo en el mapa haciendo click dos veces para establecer el área de cobertura.</p>
                </div>
                <div v-show="form.scope === 'country' && form.type === 'products'" id="map_country" class="map"></div>
                <div v-show="form.scope === 'custom'" id="map_custom" class="map"></div>
                <div v-show="form.scope === 'country' && mapDistance" class="notification is-info">
                  <p>Distancia: {{ mapDistance }} km</p>
                  <p v-show="form.cost_delivery_base && form.cost_delivery_km">Costo de envío {{ mapDeliveryCost }} ARS</p>
                </div>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/envios" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de envíos de la tienda</a></p>
          </div>
          <div v-show="tab === 'promos'">
            <label class="label">Establecé promos de tus productos</label>
            <p>Si ofrecés productos podés armar combos y promociones. Por cada x de Producto A obtenés x de Producto B.</p>
            <hr>
            <div class="columns">
              <div class="column is-narrow">
                <div v-if="form.hasOwnProperty('promos') && Object.keys(form.promos).length">
                  <div v-for="(item, index) in form.promos" :key="index" class="field">
                    <div class="notification is-info">
                      <div class="level">
                        <div v-if="item" class="level-item level-left">
                          <p>Por cada venta de <strong>{{ item.itemFrom.name }}</strong> se ofrece <strong>{{ item.quantity }}</strong> <strong>{{ item.itemTo.name }}</strong> sin cargo</p>
                        </div>
                        <div class="level-item level-right level-right-padded">
                          <b-button type="is-white is-small" @click="delPromo(item)">Eliminar</b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="field content">
                  <div class="notification is-light has-text-white">
                    <h5 class="has-text-dark">No hay promociones establecidas.</h5>
                    <p class="has-text-dark">Creá una seleccionando categoría, producto y cantidad. Al finalizar presioná Guardar.</p>
                  </div>
                </div>
                <div v-if="promos.itemFrom && promos.itemTo && promos.quantity" class="field">
                  <div class="notification is-success">
                    <div class="level">
                      <div class="level-item level-left">
                        <p>Por cada venta de <strong>{{ promos.itemFrom[0].name }}</strong> se ofrece <strong>{{ promos.quantity }}</strong> <strong>{{ promos.itemTo[0].name }}</strong> sin cargo</p>
                      </div>
                      <div class="level-item level-right level-right-padded">
                        <b-button type="is-white is-small" @click="addPromo">Agregar</b-button>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table">
                  <tr>
                    <th>Stock</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                  </tr>
                  <tr>
                    <td>
                      <b-select
                        multiple
                        native-size="8"
                        v-model="promos.itemFrom">
                        <option v-for="(item, index) in basic.items" :key="index" :value="item">{{ item.name }}</option>
                      </b-select>
                    </td>
                    <td>
                      <b-select
                        multiple
                        native-size="8"
                        v-model="promos.itemTo">
                        <option v-for="(item, index) in basic.items" :key="index" :value="item">{{ item.name }}</option>
                      </b-select>
                    </td>
                    <td>
                      <b-numberinput v-model="promos.quantity" min="0" max="9999" controls-position="compact" controls-rounded></b-numberinput>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/promos" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de promociones</a></p>
          </div>
          <div v-show="tab === 'payments'">
            <label class="label">Establecé cómo querés cobrar en tu tienda</label>
            <p>Te ofrecemos las alternativas mas usadas hoy de venta electrónica. Si tu forma de cobro no está en la lista <a href="https://geotiendas.com/contacto" target="_blank">háznoslo saber</a>, tal vez la podamos agregar! </p>
            <hr>
            <div class="columns">
              <div class="column">
                <b-field label="Métodos de pago" class="has-check">
                  <checkbox-picker :options="{ 'takeaway': 'Retiro en sucursal', 'cash': 'Envío a domicilio', 'bank': 'CBU o ALIAS', 'mercadopago': 'Mercado Pago'}" v-model="payment_methods" type="is-primary"/>
                </b-field>
              </div>
              <div class="column is-narrow">
                <b-field message="Precio compra mínima">
                  <b-numberinput v-model="form.min_price" controls-position="compact" controls-rounded></b-numberinput>
                </b-field>
              </div>
            </div>
            <hr v-show="payment_methods.includes('bank')">
            <div v-show="payment_methods.includes('bank')" class="columns">
              <div class="column">
                <b-field label="CBU" message="Establece el CBU">
                  <input class="input " :class="{ 'is-success': checkCBUFormat, 'is-danger': !checkCBUFormat }" type="text" v-model="form.bank_cbu" placeholder="0720168088000036018000" />
                </b-field>
                <b-field label="Entidad bancaria" message="Opcional">
                  <b-input placeholder="Banco Santander" v-model="form.bank_entity" />
                </b-field>
                <b-field label="Titular de la cuenta" message="Opcional">
                  <b-input placeholder="Juan Manuel Rodríguez" v-model="form.bank_owner" />
                </b-field>
              </div>
              <div class="column">
                <b-field label="Alias de la cuenta" message="Opcional">
                  <b-input placeholder="JUAN.MANUEL.RODRIGUEZ" v-model="form.bank_alias" />
                </b-field>
                <b-field label="Número de la cuenta" message="Opcional">
                  <b-input placeholder="000-360187/3" v-model="form.bank_account" />
                </b-field>
              </div>
            </div>
            <hr v-show="payment_methods.includes('mercadopago')"/>
            <div v-show="payment_methods.includes('mercadopago')" class="columns">
              <div class="column">
                <b-field label="Mercado Pago" message="Ingresá el access token de tu app en Mercado Pago">
                  <input class="input " :class="{ 'is-success': checkMpAccessTokenFormat, 'is-danger': !checkMpAccessTokenFormat }" type="text" v-model="form.mp_access_token" placeholder="APP_USR-3233559644412004-102816-8ef374b8cca647798ecd4b60fd8894e2-000000000" />
                </b-field>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column">
                <label class="label">Texto después del pago</label>
                <vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="form.payment_text"> </vue-editor>
              </div>
            </div>
            <p><a href="https://geotiendas.com/guia/pagos" target="_blank"><b-icon icon="book-information-variant"/> Saber más acerca de pagos de la tienda</a></p>
          </div>
          <hr>
          <div class="buttons is-flex-end">
            <b-button type="is-primary" :loading="saving" native-type="submit">Guardar</b-button>
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
import CheckboxPicker from '@/components/CheckboxPicker'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
import FilePicker from '@/components/FilePicker'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'Shop',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    CheckboxPicker,
    FilePicker,
    VueEditor
  },
  data () {
    return {
      tab: 'texts',
      saving: false,
      payment_methods: [],
      form: {},
      shopTextLength: 0,
      // shopTextMin: 30,
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
      promos: {
        itemFrom: [],
        itemTo: [],
        quantity: 0
      }
    }
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ]),
    checkCBUFormat () {
      return this.bankCbuRe.test(this.form.bank_cbu) || (this.form.bank_alias && this.form.bank_alias.length > 5)
    },
    checkMpAccessTokenFormat () {
      return this.mpAccessTokenRe.test(this.form.mp_access_token)
    }
  },
  created () {
    if (this.shop) {
      this.form = this.shop
      if (this.form.payment_methods) {
        this.payment_methods = this.form.payment_methods
      }
      if (this.shop.text) {
        this.shopTextLength = this.shop.text.length
      }
      if (!this.form.item_layout) {
        this.form.item_layout = 'landscape'
      }
      if (this.form.about) {
        this.form.about = this.form.about.replace(/(<([^>]+)>)/gi, '')
      }
    }
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
    handleLogoUploaded (files) {
      this.$set(this.form, 'logo', files[0])
    },
    handleBackgroundUploaded (files) {
      this.$set(this.form, 'background', files[0])
    },
    handleAboutPhotoUploaded (files) {
      this.$set(this.form, 'about_photo', files[0])
    },
    checkScopeMaps () {
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
    },
    previewDeliveryCost () {
      if (this.form.cost_delivery_base && this.form.cost_delivery_km) {
        this.mapDeliveryCost = parseInt(this.form.cost_delivery_base + (this.form.cost_delivery_km * this.distance))
      }
    },
    setShopScope (scope) {
      this.$set(this.form, 'scope', scope)
      this.checkScopeMaps()
    },
    checkShopText () {
      if (this.form.text) {
        this.shopTextLength = this.form.text.length
      }
    },
    onlyNumeric () {
      if (this.form.phone) {
        this.form.phone = this.form.phone.replace(/[^0-9]/g, '').replace(/^0+/, '')
      }
    },
    addPromo () {
      let promos = this.form.promos
      if (!promos) {
        promos = []
      }
      promos = promos.filter(e => !(e.itemFrom.id === this.promos.itemFrom[0].id && e.itemTo.id === this.promos.itemTo[0].id))
      console.log(this.promos.itemFrom[0].name)
      if (this.promos.itemFrom[0].name) {
        promos.push({
          itemFrom: {
            id: this.promos.itemFrom[0]._id,
            name: this.promos.itemFrom[0].name
          },
          itemTo: {
            id: this.promos.itemTo[0]._id,
            name: this.promos.itemTo[0].name
          },
          quantity: this.promos.quantity
        })
        this.$set(this.form, 'promos', promos)
        this.promos.itemFrom = []
        this.promos.itemTo = []
        this.promos.quantity = 0
      }
    },
    delPromo (item) {
      let promos = this.form.promos
      promos = promos.filter(e => !(e.itemFrom.id === item.itemFrom.id && e.itemTo.id === item.itemTo.id))
      this.$set(this.form, 'promos', promos)
    },
    initAutocomplete (id) {
      let t = this
      var autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById(id),
        {
          types: ['geocode'],
          componentRestrictions: {
            country: this.shop.country_iso || 'ar'
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
        t.checkScopeMaps()
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
    submit () {
      if (this.payment_methods.length === 0) {
        return this.$buefy.toast.open({
          message: `Al menos un método de pago es necesario para vender con tu geotienda. Elegí al menos uno.`,
          type: 'is-danger'
        })
      }

      if (this.payment_methods.includes('mercadopago')) {
        if (!this.mpAccessTokenRe.test(this.form.mp_access_token)) {
          return this.$buefy.toast.open({
            message: `El access token de Mercado Pago ingresado es incorrecto. Debe comenzar con APP_USER-...`,
            type: 'is-danger'
          })
        }
      }

      if (this.payment_methods.includes('bank')) {
        if (!this.bankCbuRe.test(this.form.bank_cbu) && (!this.form.bank_alias || this.form.bank_alias.length < 5)) {
          return this.$buefy.toast.open({
            message: `Para cobrar con Banco llená tu CBU o ALIAS.`
          })
        }
        if (!this.bankCbuRe.test(this.form.bank_cbu)) {
          return this.$buefy.toast.open({
            message: `El CBU ingresado tiene un formato incorrecto. Debe tener 22 dígitos.`,
            type: 'is-danger'
          })
        }
      }
      this.saving = true
      this.form.payment_methods = this.payment_methods
      if (this.form.cost_delivery_base) {
        this.form.cost_delivery_base = parseFloat(this.form.cost_delivery_base)
      }
      if (this.form.cost_delivery_km) {
        this.form.cost_delivery_km = parseFloat(this.form.cost_delivery_km)
      }
      this.$store.dispatch('update', this.form).then(res => {
        this.saving = false
        this.$buefy.toast.open({
          message: `Tienda actualizada`,
          type: 'is-success',
          queue: false
        })
      })
    }
  },
  watch: {
    tab (newValue) {
      if (newValue === 'scope') {
        this.checkScopeMaps()
      }
    }
  }
}
</script>

<style scoped>
  #map {
    width: 100%;
    height: 400px;
  }
</style>
