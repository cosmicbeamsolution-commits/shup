<template>
  <div class="animated fadeIn">
    <section class="hero is-info">
      <div class="container content is-vexpanded">
        <div class="section field is-hidden-touch">
          <h1 class="has-text-white has-text-centered is-size-1 has-text-weight-bold">{{ basic.landing.plansTitle}}</h1>
          <p class="has-text-white has-text-weight-medium  has-text-centered is-size-5">{{ basic.landing.plansText }}</p>
        </div>
        <div class="section field is-hidden-desktop">
          <h1 class="has-text-white has-text-weight-bold">{{ basic.landing.plansTitle}}</h1>
          <p class="has-text-white has-text-weight-medium">{{ basic.landing.plansText }}</p>
        </div>
        <div class="buttons has-border-collapse has-addons is-flex-center has-plans-buttons">
          <button class="button" :class="{ 'is-white': planPeriod === 'mes', 'is-grey': planPeriod !== 'mes' }" @click.prevent="updatePlanPeriod('mes')">Mensual</button>
          <button class="button" :class="{ 'is-white': planPeriod === 'semestral', 'is-grey': planPeriod !== 'semestral' }" @click.prevent="updatePlanPeriod('semestral')">Semestral</button>
          <button class="button" :class="{ 'is-white': planPeriod === 'anual', 'is-grey': planPeriod !== 'anual' }" @click.prevent="updatePlanPeriod('anual')">Anual</button>
        </div>
        <div class="columns is-plans-cards is-centered is-vexpanded">
          <div v-for="(item, index) in basic.landing.plans" :key="index" class="column">
            <card-component>
              <h3 class="has-text-centered is-size-3">{{ item.title }}</h3>
              <p class="has-text-centered">{{ item.text }}</p>
              <h1 class="has-text-centered is-size-2">
                <growing-number :key="updatePriceKey" :value="parseInt(planTotal[index])" prefix="$" :suffix="planPeriod"/>
              </h1>
              <div v-show="planPeriod !== 'mes'" class="has-text-centered animated fadeIn">
                <span class="has-text-success has-text-weight-bold is-size-5">${{ planPrice[index] | formatNumber }}/mes</span>
              </div>
              <hr>
              <div v-for="(feature, index2) in item.features" :key="index2">
                <b-icon icon="progress-check" class="is-fixed-icon has-text-success"/> <span>{{ feature }}</span>
              </div>
              <div v-show="morePlanFeatures[index]" v-for="(feature, index2) in item.morefeatures" :key="`m${index2}`">
                <b-icon icon="progress-check" class="is-fixed-icon has-text-success"/> <span>{{ feature }}</span>
              </div>
              <div class="column has-text-centered">
                <span v-show="!morePlanFeatures[index]" class="has-text-info is-clickable" @click="toggleMorePlanFeatures(item.title, index)">Mostrar más</span>
                <span v-show="morePlanFeatures[index]" class="has-text-info is-clickable" @click="toggleMorePlanFeatures(item.title, index)">Mostrar menos</span>
              </div>
              <hr>
              <div class="buttons is-flex-center">
                <a @click="planStart(item.title)" class="button is-info">
                  <span>Comenzar</span>
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
import CardComponent from '../components/CardComponent'
import GrowingNumber from '@/components/GrowingNumber'
export default {
  name: 'landing',
  components: {
    CardComponent,
    GrowingNumber
  },
  computed: {
    ...mapState([
      'basic'
    ])
  },
  data () {
    return {
      updatePriceKey: 0,
      morePlanFeatures: [],
      planPeriod: 'mes',
      planPrice: {},
      planTotal: {}
    }
  },
  created () {
    if (this.basic.landing.plans) {
      Object.keys(this.basic.landing.plans).forEach(e => {
        this.$set(this.morePlanFeatures, e, false)
      })
      this.updatePlanPeriod(this.planPeriod, true)
    }
  },
  methods: {
    planStart (plan) {
      // window.fbq('trackCustom', 'planStart', { plan: plan })
      this.$router.push('/crea-tu-tienda')
    },
    toggleMorePlanFeatures (plan, index) {
      if (this.morePlanFeatures[index]) {
        // window.fbq('trackCustom', 'planAdvancedFeatured', { plan: plan })
      }
      this.morePlanFeatures[index] = !this.morePlanFeatures[index]
    },
    updatePlanPeriod (period, skipFbq) {
      if (!skipFbq) {
        // window.fbq('trackCustom', 'planPeriod', { period: period })
      }
      Object.keys(this.basic.landing.plans).forEach(e => {
        const item = this.basic.landing.plans[e]
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
    }
  }
}
</script>
