<template>
  <div>
    <pay-selection-box
      :is-active="isPayModalActive"
      @cancel="payBoxCancel"
      @pay-select="payBoxSelect" />
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="rocket" size="is-medium"/>
      <span> Planes</span>
      <!--router-link slot="right" to="/" class="button ">
        Escritorio
      </router-link-->
    </hero-bar>
    <section class="section is-main-section">
      <div class="container is-vexpanded content">
        <h1 v-if="trialDaysLeft && trialDaysLeft < 7" class="has-text-centered">Falta<span v-show="trialDaysLeft > 1">n</span> {{ trialDaysLeft }} días para que expire tu periodo de prueba</h1>
        <h1 v-else class="has-text-centered">{{ data.plansTitle }}</h1>
        <p class="has-text-weight-medium has-text-centered is-size-5">{{ data.plansText }}</p>
        <p></p>
        <div class="buttons has-addons is-flex-center has-plans-buttons">
          <button class="button " :class="{ 'is-info': planPeriod === 'mes', 'is-white': planPeriod !== 'mes' }" @click.prevent="updatePlanPeriod('mes')">Mensual</button>
          <button class="button " :class="{ 'is-info': planPeriod === 'semestral', 'is-white': planPeriod !== 'semestral' }" @click.prevent="updatePlanPeriod('semestral')">Semestral</button>
          <button class="button " :class="{ 'is-info': planPeriod === 'anual', 'is-white': planPeriod !== 'anual' }" @click.prevent="updatePlanPeriod('anual')">Anual</button>
        </div>
        <div class="columns is-centered is-vexpanded">
          <div v-for="(item, index) in plans" :key="index" class="column">
            <card-component>
              <h3 class="has-text-centered is-size-3">{{ item.title }}</h3>
              <p class="has-text-centered">{{ item.text }}</p>
              <h1 class="has-text-centered is-size-2">
                <growing-number :key="updatePriceKey" :value="parseInt(planTotal[index])" prefix="$" :suffix="planPeriod"/>
              </h1>
              <div v-show="planPeriod !== 'mes'" class="has-text-centered">
                <span class="has-text-success has-text-weight-medium is-size-5">${{ planPrice[index] }}/mes</span>
              </div>
              <hr>
              <div v-for="(feature, index2) in item.features" :key="index2">
                <b-icon icon="progress-check" class="is-fixed-icon has-text-success"/> <span>{{ feature }}</span>
              </div>
              <div v-for="(feature, index2) in item.morefeatures" :key="`m${index2}`">
                <b-icon icon="progress-check" class="is-fixed-icon has-text-success"/> <span>{{ feature }}</span>
              </div>
              <hr>
              <div class="buttons is-flex-center">
                <a v-show="shop.plan === index" class="button is-light ">
                  <span>Contratado</span>
                </a>
                <a v-show="shop.plan === index || !shop.plan" @click="paySelectionModal(index)" class="button is-info ">
                  <span>Contratar</span>
                </a>
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
import moment from 'moment'
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import PaySelectionBox from '@/components/PaySelectionBox'
import GrowingNumber from '@/components/GrowingNumber'
export default {
  name: 'plans',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    PaySelectionBox,
    GrowingNumber
  },
  data () {
    return {
      saving: false,
      updatePriceKey: 0,
      isPayModalActive: false,
      planPeriod: 'mes',
      planPrice: {},
      planTotal: {},
      plans: {},
      plan: null,
      item: {},
      data: {}
    }
  },
  computed: {
    trialDaysLeft () {
      return moment(this.shop.trial_ends).diff(moment(), 'days')
    },
    ...mapState([
      'basic',
      'shop'
    ])
  },
  created () {
    axios.get('/landing/5f9300d791a60a67b54a013b').then(res => {
      if (res.data) {
        this.data = res.data
        if (res.data.plans) {
          this.plans = res.data.plans
        }
        this.updatePlanPeriod(this.planPeriod)
      }
    })
  },
  methods: {
    paySelectionModal (index) {
      this.plan = index
      this.item = this.plans[index]
      this.isPayModalActive = true
    },
    payBoxSelect (mode) {
      this.isPayModalActive = false
      this.onReady(mode)
    },
    payBoxCancel () {
      this.isPayModalActive = false
    },
    onReady (mode) {
      this.payMode = mode
      this.submit()
    },
    updatePlanPeriod (period) {
      Object.keys(this.plans).forEach(e => {
        const item = this.plans[e]
        let total = item.price
        let price = item.price
        if (period === 'semestral') {
          total *= 6
          total *= 1 - (item.biannual_discount / 100)
          price = parseInt(total / 6)
        } else if (period === 'anual') {
          total *= 12
          total *= 1 - (item.annual_discount / 100)
          price = parseInt(total / 12)
        }
        this.$set(this.planPrice, e, parseInt(price))
        this.$set(this.planTotal, e, parseInt(total))
      })
      this.updatePriceKey++
      this.planPeriod = period
    },
    submit () {
      this.$buefy.toast.open({
        message: `Generando orden de compra, por favor espere...`,
        queue: true,
        duration: 5000
      })
      /* register payment */
      axios.post(`/panel/payments/${this.basic.shop._id}`, {
        paymode: this.payMode,
        period: this.planPeriod,
        plan: this.plan,
        item: this.item
      }).then(res => {
        if (res.data.status === 'success') {
          setTimeout(() => {
            if (this.payMode === 'online') {
              this.$buefy.toast.open({
                message: `Recibiendo datos de mercadopago, por favor espere...`,
                queue: true
              })
              /* save payment preference for further use */
              localStorage.setItem('preference', JSON.stringify(res.data.data))
              this.$router.push('/pagar')
            } else {
              localStorage.removeItem('order')
              this.$router.push('/gracias')
            }
          }, 1000)
        } else {
          this.$buefy.toast.open({
            message: `Hubo un error al generar la orden de compra. Por favor, intente nuevamente en unos instantes.`,
            type: 'is-danger',
            queue: true,
            duration: 60000
          })
        }
      }).catch(err => {
        this.$buefy.toast.open({
          message: `Hubo un error al generar la orden de compra. Por favor, intente nuevamente en unos instantes. Error: ${err}`,
          type: 'is-danger',
          queue: false,
          duration: 60000
        })
      })
    }
  }
}
</script>
