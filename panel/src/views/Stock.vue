<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="tray-full" size="is-medium"/> Catálogo
      <router-link slot="right" to="/catalogo/new" class="button ">
        Nueva Categoría
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced">
        <b-table v-if="Object.keys(data).length"
          class="stock-table"
          :data="data"
          default-sort-direction="desc"
          default-sort="id"
          detail-key="id"
          :opened-detailed="defaultOpenedDetails"
          :row-class="onRowClass"
          detailed
          focusable>
          <template slot-scope="props">
            <b-table-column field="props.row.name" label="Categoría" sortable>
              <span class="is-capitalized">{{ props.row.name }}</span>
            </b-table-column>
            <b-table-column label="Visible" class="is-actions-cell" numeric>
              <div class="buttons is-right">
                <b-switch v-model="props.row.active" @input="toggleStockStatus(props.row)"></b-switch>
              </div>
            </b-table-column>
            <b-table-column custom-key="actions">
              <div class="buttons is-mobile is-right">
                <router-link :to="{ name: 'stock.edit', params: { id: props.row._id }}" class="button is-small is-primary ">
                  <b-icon icon="square-edit-outline" size="is-small"/>
                </router-link>
                <router-link :to="{ name: 'stock.items', params: { id: props.row._id, sid: 'new' }}" class="button is-small is-primary">
                  <b-icon icon="file-document-box-plus-outline" size="is-small"/>
                </router-link>
              </div>
            </b-table-column>
          </template>
          <template slot="detail" slot-scope="props">
            <div class="columns is-multiline" :class="{ 'is-blured': !props.row.active }">
              <div v-for="(item, index) in props.row.items" :key="index" class="column is-4">
                <router-link :to="{ name: 'stock.items', params: { id: props.row._id, sid: item._id }}">
                  <div class="box content">
                    <div class="is-background-image" :style="`background-image: url(${item.photo})`"/>
                    <h5>{{ item.name }}</h5>
                    <h6 class="has-text-success">${{ item.price }}</h6>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </b-table>

        <div v-else class="stock-empty is-hidden is-padded animated fadeIn delay">
          <div class="has-text-centered content">
            <img src="/img/art/team.svg" width="320" />
            <h3>Creá al menos una categoría para publicar en tu tienda</h3>
            <p>Creando y guardando tus ítems bajo categorías específicas ganás en prolijidad y además brinda la posibilidad a tus clientes de elegir mejor.</p>
            <div class="buttons is-centered">
              <router-link to="/catalogo/new" class="button is-success">Crear mi primer categoría</router-link>
            </div>
          </div>
        </div>
      </card-component>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'Stock',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  data () {
    return {
      data: {},
      defaultOpenedDetails: []
    }
  },
  created () {
    axios.get(`/stock/search?shop=${this.shop._id}`).then((res) => {
      if (res.data) {
        this.data = res.data
        this.items = res.data.flatMap(e => {
          return [...e.items]
        })
      }
    })
  },
  methods: {
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
    updateItem (item, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`/stock/${item._id}`, payload).then(res => {
          resolve(item)
        })
      })
    },
    toggleStockStatus (item) {
      let state = { active: item.active }
      this.updateItem(item, state).then(res => {
        this.$buefy.toast.open({
          message: `categoría actualizada`
        })
      })
    }
  }
}
</script>
