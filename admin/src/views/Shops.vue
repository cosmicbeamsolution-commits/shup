<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="shopping" size="is-medium"/>
      Tiendas
      <div class="buttons" slot="right">
        <a class="button" @click="getData">
          <span>Actualizar</span>
        </a>
      </div>
    </hero-bar>
    <section class="section is-main-section">
      <card-component v-if="data">
        <b-table
          class="sales-table"
          :data="data"
          default-sort-direction="desc"
          default-sort="created"
          detail-key="_id"
          detailed
          focusable>
          <template slot-scope="props">
            <b-table-column field="id" label="#" width="40" sortable searchable>
              <a :href="'https://' + props.row.id + '.geotiendas.com'" class="tag" :class="{ 'is-success': props.row.wizard_complete, 'is-danger': !props.row.wizard_complete }" title="Ver tienda" target="_blank">
                <span class="has-text-weight-bold"> {{ props.row.id }}</span>
              </a>
            </b-table-column>
            <b-table-column field="shop" label="Tienda" sortable searchable>
              <span class="is-capitalized">{{ props.row.shop }}</span>
              <span v-show="props.row.domain" class="is-lowercase tag is-small">{{ props.row.domain }}</span>
            </b-table-column>
            <b-table-column field="first_name" label="Nombre" sortable searchable>
              <span class="is-capitalized">{{ props.row.first_name }}</span>
            </b-table-column>
            <b-table-column field="last_name" label="Apellido" sortable searchable>
              <span class="is-capitalized">{{ props.row.last_name }}</span>
            </b-table-column>
            <b-table-column field="created" label="Creado" sortable searchable>
              <span class="tag has-text-weight-bold is-uppercase">{{ props.row.created | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="lastlogin" label="Última actividad" sortable searchable>
              <span class="tag has-text-weight-bold is-uppercase">{{ props.row.lastlogin | adjustShortTZ }}</span>
            </b-table-column>
            <b-table-column field="enabled" label="Habilitado" class="is-actions-cell" numeric>
              <div class="buttons is-right">
                <b-switch v-model="props.row.enabled" @input="toggleShopStatus(props.row)"></b-switch>
              </div>
            </b-table-column>
            <b-table-column field="featured" label="Comunidad" class="is-actions-cell" numeric>
              <div class="buttons is-right">
                <b-switch v-model="props.row.featured" @input="toggleShopFeatured(props.row)"></b-switch>
              </div>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <table class="table is-details">
              <tr>
                <td width="1%">
                  <span>Tienda</span>
                </td>
                <td>
                  <span>{{ props.row.shop }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Descripción</span>
                </td>
                <td>
                  <span>{{ props.row.text }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Tipo</span>
                </td>
                <td>
                  <span v-show="props.row.type === 'products'">Productos</span>
                  <span v-show="props.row.type === 'services'">Servicios</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Propietario</span>
                </td>
                <td>
                  <span>{{ props.row.first_name }} {{ props.row.last_name }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Teléfono</span>
                </td>
                <td>
                  <span>{{ props.row.phone }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Email</span>
                </td>
                <td>
                  <span>{{ props.row.email }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Ubicación</span>
                </td>
                <td>
                  <span>{{ props.row.address }} {{ props.row.address_extra }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Asistente completado</span>
                </td>
                <td>
                  <span>{{ props.row.wizard_complete }} {{ props.row.wizard_complete_date }}</span>
                </td>
              </tr>
              <tr>
                <td width="1%">
                  <span>Email validado</span>
                </td>
                <td>
                  <span>{{ props.row.validated }} {{ props.row.validation_date }}</span>
                </td>
              </tr>
            </table>
            <div class="buttons is-flex-end">
              <b-button @click.prevent="trashModal(props.row)" type="is-danger">Eliminar {{ props.row.shop }}</b-button>
            </div>
          </template>
        </b-table>
      </card-component>
      <notification v-else class="is-info">
        <p>No se registran tiendas</p>
      </notification>
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
import Notification from '@/components/Notification'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'Sales',
  components: {
    ModalBox,
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    Notification
  },
  data () {
    return {
      isModalActive: false,
      showDetailIcon: false,
      defaultOpenedDetails: [],
      item: {},
      data: []
    }
  },
  sockets: {
    sale (data) {
      if (!this.isSaleBoxActive && !this.isSaleDeliveryBoxActive) {
        setTimeout(() => {
          this.getData()
        }, 1000)
      } else {
        this.$buefy.toast.open({
          message: `Hay nuevas ventas`
        })
      }
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapState([
      'basic'
    ]),
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject.shop
      }

      return null
    }
  },
  methods: {
    toggleShopFeatured (item) {
      let state = { featured: item.featured }
      this.updateItem(item, state).then(res => {
        this.setItem(item, state).then(item => {
          this.$buefy.toast.open({
            message: `Estado de tienda actualizada`
          })
        })
      })
    },
    toggleShopStatus (item) {
      let state = { enabled: item.enabled }
      this.updateItem(item, state).then(res => {
        this.setItem(item, state).then(item => {
          this.$buefy.toast.open({
            message: `Estado de tienda actualizada`
          })
        })
      })
    },
    onRowClass: function (item, index) {
      let classList = []
      if (item.hidden) {
        classList.push('is-hidden')
      }
      if (item.cancelled) {
        classList.push('is-cancelled')
      }
      return classList.join(' ')
    },
    getData () {
      this.$store.dispatch('loaded', false)
      axios.post('/shops/sort', {
        find: {},
        sort: { created: 1 }
      }).then(res => {
        if (res.data.length) {
          this.data = res.data
        }
        this.$store.dispatch('loaded', true)
      })
    },
    updateItem (item, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`/shops/${item._id}`, payload).then(res => {
          resolve(item)
        })
      })
    },
    setItem (item, data) {
      return new Promise((resolve, reject) => {
        resolve(item)
      })
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      axios.delete(['shops', this.trashObject._id].join('/')).then(res => {
        axios.delete(['stock', 'shop', this.trashObject._id].join('/')).then(res => {
          this.data.filter(e => e._id !== this.trashObject._id)
          this.$buefy.toast.open({
            message: `Tienda eliminada`
          })
        })
      })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
