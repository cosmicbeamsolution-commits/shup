<template>
  <div v-if="clients.length && !dataHideIfEmpty">
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
      <template v-show="props" slot-scope="props">
        <b-table-column v-if="propertyExists('photo')" class="has-no-head-mobile is-image-cell">
          <div class="image">
            <img :src="props.row.photo">
          </div>
        </b-table-column>
        <b-table-column v-if="propertyExists('name')" label="Nombre" field="name" sortable>
          <span class="has-text-weight-bold">{{ props.row.name }}</span>
          <span v-if="props.row[dataChildrenName]"> (<span v-html="props.row[dataChildrenName].length"></span>)</span>
        </b-table-column>
        <b-table-column v-if="propertyExists('price')" label="Precio" field="price" sortable>
          <span v-show="!props.row.quotable">${{ props.row.price }}</span>
          <span v-show="props.row.quotable" class="tag">cotizable</span>
        </b-table-column>
        <b-table-column v-if="propertyExists('stock')" label="Disponible" field="stock" sortable>
          <span v-show="!props.row.quotable">{{ props.row.stock }}</span>
          <span v-show="props.row.quotable" class="tag">cotizable</span>
        </b-table-column>
        <b-table-column v-if="propertyExists('slug')" label="URL" field="slug" sortable>
          <span class="is-size-7 has-text-grey">{{ props.row.slug }}</span>
        </b-table-column>
        <b-table-column v-if="propertyExists('plan')" label="Plan" field="plan" sortable>
          <span class="tag has-text-weight-bold">{{ props.row.plan }}</span>
        </b-table-column>
        <b-table-column v-if="propertyExists('header')" label="Header" field="header" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.header, 'has-text-danger': !props.row.header}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('footer')" label="Footer" field="footer" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.footer, 'has-text-danger': !props.row.footer}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('active')" label="Visible" field="active" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.active, 'has-text-danger': !props.row.active}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('payment_complete')" label="Visible" field="payment_complete" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.payment_complete, 'has-text-danger': !props.row.payment_complete}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('open')" label="Abierto" field="open" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.open, 'has-text-danger': !props.row.open}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('menu')" label="Mostrar en menú" field="menu" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.menu, 'has-text-danger': !props.row.menu}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('answered')" label="Contestado" field="answered" sortable>
          <b-icon icon="checkbox-blank-circle" size="is-small" :class="{ 'has-text-success' : props.row.answered, 'has-text-danger': !props.row.answered}"/>
        </b-table-column>
        <b-table-column v-if="propertyExists('created')" label="Creado" field="created" sortable>
          <small class="has-text-grey is-abbr-like" :title="props.row.created">hace {{ props.row.created | fromNow }}</small>
        </b-table-column>
        <b-table-column v-if="dataActions" custom-key="actions" class="is-actions-cell">
          <div class="buttons is-right">
            <router-link v-if="!dataPid" :to="{ name: routeName + '.' + routeMethodName, params: { id: props.row._id }}" class="button is-small is-primary" title="Editar">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <router-link v-else :to="{ name: routeName + '.' + routeMethodName, params: { id: dataPid, sid: props.row._id }}" class="button is-small is-primary" title="Editar">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <router-link v-if="dataChildrenAdd" :to="{ name: routeName + '.' + dataChildrenName, params: { id: props.row._id, sid: 'new' }}" class="button is-small is-primary"  title="Agregar">
              <b-icon icon="file-document-box-plus-outline" size="is-small"/>
            </router-link>
            <button v-if="dataRemove" class="button is-small is-danger " type="button" @click.prevent="trashModal(props.row)" title="Eliminar">
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
            <div v-if="!customDiv">
              <p>
                <b-icon icon="tray-remove" size="is-large"/>
              </p>
              <p>Todavía nada &hellip;</p>
              <router-link v-if="dataAdd && !dataPid" :to="`${routeName}/new`" class="button is-large is-primary ">
                <b-icon icon="tray-plus" size="is-small"/>
              </router-link>
            </div>
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
    dataChildrenAdd: {
      type: Boolean,
      default: false
    },
    dataRemove: {
      type: Boolean,
      default: true
    },
    dataHideIfEmpty: {
      type: Boolean,
      default: false
    },
    dataEmptyDiv: {
      type: String,
      default: null
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
      customDiv: false,
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
    }
  },
  mounted () {
    this.dataRefresh()
  },
  methods: {
    propertyExists (prop) {
      return this.clients.find(e => e.hasOwnProperty(prop))
    },
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
            if (this.dataEmptyDiv) {
              this.customDiv = true
              document.querySelector(this.dataEmptyDiv).classList.remove('is-hidden')
            }
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
