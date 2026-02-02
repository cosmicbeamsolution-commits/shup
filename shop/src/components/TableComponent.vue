<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm"
               @cancel="trashCancel"/>
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
        <b-table-column class="has-no-head-mobile is-image-cell">
          <div class="image">
            <img :src="props.row.file" class="">
          </div>
        </b-table-column>
        <b-table-column label="Nombre" field="name" sortable>
          <span v-if="props.row.especial">
            <b-icon icon="hand-heart has-text-success" size="is-small"/>
          </span>
          {{ props.row.name }}
          <span v-if="props.row[dataChildrenName]">(<span v-html="props.row[dataChildrenName].length"></span>)</span>
        </b-table-column>
        <b-table-column v-if="props.row.slug" label="URL" field="slug" sortable>
          <span class="is-size-7 has-text-grey">/{{ props.row.slug }}</span>
        </b-table-column>
        <b-table-column v-if="props.row.empresa" label="Negocio" field="empresa" sortable>
          {{ props.row.empresa }}
        </b-table-column>
        <b-table-column v-if="props.row.localidad" label="Ciudad" field="localidad" sortable>
          {{ props.row.localidad }}
        </b-table-column>
        <!--b-table-column class="is-progress-col" label="Progress" field="progress" sortable>
          <progress class="progress is-small is-primary" :value="props.row.progress" max="100">{{ props.row.progress }}</progress>
        </b-table-column-->
        <b-table-column label="Creado">
          <small class="has-text-grey is-abbr-like" :title="props.row.created">{{ props.row.created | fromNow }}</small>
        </b-table-column>
        <b-table-column custom-key="actions" class="is-actions-cell">
          <div class="buttons is-right">
            <router-link v-if="!dataPid" :to="{name:routeName+'.'+routeMethodName, params: {id: props.row._id}}" class="button is-small is-primary">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <router-link v-else :to="{name:routeName+'.'+routeMethodName, params: {id: dataPid, sid: props.row._id}}" class="button is-small is-primary">
              <b-icon icon="square-edit-outline" size="is-small"/>
            </router-link>
            <button class="button is-small is-danger" type="button" @click.prevent="trashModal(props.row)">
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
    }
  },
  mounted () {
    this.dataRefresh()
  },
  methods: {
    dataRefresh: function () {
      if (this.dataSet.length) {
        this.loadByObj()
      } else if (this.dataUrl) {
        if (this.$route.params.id !== 'new') {
          this.loadByURL()
        }
      }
    },
    loadByObj: function () {
      if (this.dataSet.length > this.perPage) {
        this.paginated = true
      }
      this.clients = this.dataSet
      this.isLoading = false
    },
    loadByURL: function () {
      this.isLoading = true
      axios
        .get(this.dataUrl)
        .then(r => {
          this.isLoading = false
          if (Object.keys(r.data).length) {
            if (r.data.length > this.perPage) {
              this.paginated = true
            }
          }
          this.clients = r.data
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
      let endpoint = [this.$store.state.endpoint, this.routeName, this.trashObject._id].join('/')
      if (this.routeMethod) {
        endpoint = [this.$store.state.endpoint, this.routeName, this.dataPid, this.routeMethodName, this.trashObject._id].join('/')
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
