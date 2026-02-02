<template>
  <div>
    <header-component/>
    <div v-if="Object.keys(data).length" class="content has-padding-bottom">
      <card-component :is-float="true" :is-centered="true" class="is-white">
        <h3 class="has-text-weight-bold has-text-centered">Detalle de tu compra</h3>
        <table class="table is-striped is-fullwidth">
          <tr v-for="(item, index) in data.order" :key="index">
            <td>
              <span>
                <h5 class="is-marginless">{{ item.name }}</h5>
                <p>{{ item.text }}</p>
              </span>
            </td>
          </tr>
        </table>
        <table class="table is-striped is-fullwidth">
          <tr>
            <td width="1%">
              <b-icon icon="toy-brick" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.id }}</p>
            </td>
          </tr>
          <tr>
            <td width="1%">
              <b-icon icon="clock" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.created | adjustTZ }} ({{ data.created | fromNow }})</p>
            </td>
          </tr>
          <tr v-for="(item, index) in customerData" :key="index">
            <td width="1%">
              <b-icon :icon="item.icon" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>{{ data.customer[item.value] }}</p>
            </td>
          </tr>
          <tr>
            <td width="1%">
              <b-icon icon="truck-check-outline" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>${{ data.delivery_cost }}</p>
            </td>
          </tr>
          <tr class="has-background-light">
            <td width="1%">
              <b-icon icon="cash" size="is-small" type="is-grey"/>
            </td>
            <td>
              <p>${{ data.total }}</p>
            </td>
          </tr>
        </table>
        <div class="buttons is-flex-center">
          <router-link to="/" class="button is-success ">Continuar</router-link>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import HeaderComponent from '../components/HeaderComponent'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'sale',
  components: {
    CardComponent,
    HeaderComponent
  },
  data () {
    return {
      data: {},
      customerData: [{
        value: 'fullname',
        icon: 'account'
      }, {
        value: 'email',
        icon: 'email-edit-outline'
      }, {
        value: 'phone',
        icon: 'cellphone-basic'
      }, {
        value: 'address',
        icon: 'map-marker'
      }, {
        value: 'comments',
        icon: 'comment-check-outline'
      }]
    }
  },
  mounted () {
    axios.post('/shops/sales/' + this.$route.params.id).then(res => {
      this.data = res.data
    })
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  }
}
</script>
