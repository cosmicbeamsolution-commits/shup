<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <b-table
      :checked-rows.sync="checkedRows"
      :checkable="checkable"
      :loading="isLoading"
      :paginated="paginated"
      :per-page="perPage"
      :striped="true"
      :hoverable="true"
      default-sort="name"
      :data="clients">
      <template slot-scope="props">
        <b-table-column v-if="photo" label="Foto" class="has-no-head-mobile is-image-cell">
          <div class="image">
            <img :src="props.row.photo">
          </div>
        </b-table-column>
        <b-table-column v-if="name" label="Artículo" field="name" sortable>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column v-if="price" label="Precio" field="price" sortable>
          <span>${{ props.row.price }}</span>
        </b-table-column>
        <b-table-column v-if="first_name" label="Nombre" field="first_name" sortable>
          <span>{{ props.row.first_name }}</span>
        </b-table-column>
        <b-table-column v-if="last_name" label="Apellido" field="last_name" sortable>
          <span>{{ props.row.last_name }}</span>
        </b-table-column>
        <b-table-column v-if="shop_id" label="Tienda" field="shop_id" sortable>
          <span>{{ props.row.shop_id }}</span>
        </b-table-column>
        <b-table-column v-if="email" label="Email" field="email" sortable>
          <a :href="`mailto:${props.row.email}`">{{ props.row.email }}</a>
        </b-table-column>
        <b-table-column v-if="slug" label="URL" field="slug" sortable>
          <span class="is-size-7 has-text-grey">{{ props.row.slug }}</span>
        </b-table-column>
        <b-table-column v-if="header" label="Header" field="header" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.header, 'has-text-danger': !props.row.header}"/>
        </b-table-column>
        <b-table-column v-if="footer" label="Footer" field="footer" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.footer, 'has-text-danger': !props.row.footer}"/>
        </b-table-column>
        <b-table-column v-if="active" label="Activo" field="active" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.active, 'has-text-danger': !props.row.active}"/>
        </b-table-column>
        <b-table-column v-if="open" label="Abierto" field="open" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.open, 'has-text-danger': !props.row.open}"/>
        </b-table-column>
        <b-table-column v-if="answered" label="Contestado" field="answered" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.answered, 'has-text-danger': !props.row.answered}"/>
        </b-table-column>
        <b-table-column v-if="menu" label="Mostrar en menú" field="menu" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.menu, 'has-text-danger': !props.row.menu}"/>
        </b-table-column>
        <b-table-column v-if="created" label="Creado" field="created" sortable>
          <small class="has-text-grey is-abbr-like" :title="props.row.created">{{ props.row.created | fromNow }}</small>
        </b-table-column>
        <b-table-column v-if="dataActions" custom-key="actions" class="is-actions-cell">
          <div class="buttons is-right">
            <router-link v-if="!dataPid" :to="{ name: routeName + '.' + routeMethodName, params: { id: props.row._id }}" class="button is-small is-primary ">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <router-link v-else :to="{ name: routeName + '.' + routeMethodName, params: { id: dataPid, sid: props.row._id }}" class="button is-small is-primary ">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <button v-if="dataRemove" class="button is-small is-danger " type="button" @click.prevent="trashModal(props.row)">
              <b-icon icon="trash-can" size="is-small"/>
            </button>
          </div>
        </b-table-column>
      </template>
      <section class="section" slot="empty">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large"/>
            </p>
            <p>Buscando...</p>
          </template>
          <template v-else>
            <p>
              <b-icon icon="emoticon-neutral" size="is-large"/>
            </p>
            <p>Todavía nada &hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios'
import ModalBox from '@/components/ModalBox'

export default {
  name: 'Table',
  components: { ModalBox },
  props: {
    routeName: null,
    routeMethod: null,
    dataChildren: null,
    dataPid: null,
    dataSet: {
      type: Array,
      default: () => []
    },
    dataActions: {
      type: Boolean,
      default: true
    },
    dataAdd: {
      type: Boolean,
      default: false
    },
    dataRemove: {
      type: Boolean,
      default: true
    },
    dataUrl: {
      type: String,
      default: null
    },
    checkable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      clients: [],
      isLoading: false,
      paginated: false,
      perPage: 10,
      checkedRows: []
    }
  },
  computed: {
    dataChildrenName () {
      if (this.$props.dataChildren) {
        return this.$props.dataChildren
      }

      return null
    },
    routeMethodName () {
      if (this.$props.routeMethod) {
        return this.$props.routeMethod
      }

      return 'edit'
    },
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject.name
      }

      return null
    },
    name () {
      return this.clients.find(e => e.name)
    },
    photo () {
      return this.clients.find(e => e.photo)
    },
    created () {
      return this.clients.find(e => e.created)
    },
    price () {
      return this.clients.find(e => e.price)
    },
    menu () {
      return this.clients.find(e => e.menu)
    },
    slug () {
      return this.clients.find(e => e.slug)
    },
    active () {
      return this.clients.find(e => e.hasOwnProperty('active'))
    },
    open () {
      return this.clients.find(e => e.hasOwnProperty('open'))
    },
    answered () {
      return this.clients.find(e => e.hasOwnProperty('answered'))
    },
    header () {
      return this.clients.find(e => e.header)
    },
    footer () {
      return this.clients.find(e => e.footer)
    },
    hexcolor () {
      return this.clients.find(e => e.hexcolor)
    },
    first_name () {
      return this.clients.find(e => e.first_name)
    },
    last_name () {
      return this.clients.find(e => e.last_name)
    },
    shop_id () {
      return this.clients.find(e => e.shop_id)
    },
    email () {
      return this.clients.find(e => e.email)
    }
  },
  mounted () {
    this.dataRefresh()
  },
  methods: {
    dataRefresh () {
      if (this.dataSet.length) {
        this.loadByObj()
      } else if (this.dataUrl) {
        if (this.$route.params.id !== 'new') {
          this.loadByURL()
        }
      }
    },
    loadByObj () {
      if (this.dataSet.length > this.perPage) {
        this.paginated = true
      }
      this.clients = this.dataSet
      this.isLoading = false
    },
    loadByURL () {
      this.isLoading = true
      axios
        .get(this.dataUrl)
        .then(r => {
          this.isLoading = false
          if (Object.keys(r.data).length) {
            if (r.data.length > this.perPage) {
              this.paginated = true
            }
            this.clients = r.data
          } else {
            this.clients = []
          }
        })
        .catch(e => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger'
          })
        })
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      let endpoint = [this.routeName, this.trashObject._id].join('/')
      if (this.routeMethod) {
        endpoint = [this.routeName, this.dataPid, this.routeMethodName, this.trashObject._id].join('/')
      }
      axios
        .delete(endpoint)
        .then(res => {
          this.isLoading = false
          this.dataRefresh()
          this.$buefy.toast.open({
            message: `El registro fue eliminado de forma permanente`,
            type: 'is-success',
            queue: false
          })
        })
        .catch(e => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger',
            queue: false
          })
        })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
