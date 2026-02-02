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
      <span> Plan {{ data.title }}</span>
      <router-link slot="right" to="/planes" class="button">
        Planes
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <div class="container is-vexpanded content">
        <div class="buttons has-addons is-flex-center has-plans-buttons">
          <button class="button " :class="{ 'is-info': planPeriod === 'mes', 'is-white': planPeriod !== 'mes' }" @click.prevent="updatePlanPeriod('mes')">Mensual</button>
          <button class="button " :class="{ 'is-info': planPeriod === 'semestral', 'is-white': planPeriod !== 'semestral' }" @click.prevent="updatePlanPeriod('semestral')">Semestral</button>
          <button class="button " :class="{ 'is-info': planPeriod === 'anual', 'is-white': planPeriod !== 'anual' }" @click.prevent="updatePlanPeriod('anual')">Anual</button>
        </div>
        <div class="columns is-vcentered is-centered is-vexpanded">
          <div class="column is-6">
            <card-component>
              <h3 class="has-text-centered is-size-3">{{ data.title }}</h3>
              <p class="has-text-centered">{{ data.text }}</p>
              <h1 class="has-text-centered is-size-4">${{ planPrice }}/{{ planPeriod }}</h1>
              <hr>
              <div v-for="(feature, index2) in data.features" :key="index2">
                <b-icon icon="progress-check" class="is-fixed-icon"/> <span>{{ feature }}</span>
              </div>
              <div v-for="(feature, index2) in data.morefeatures" :key="`m${index2}`">
                <b-icon icon="progress-check" class="is-fixed-icon"/> <span>{{ feature }}</span>
              </div>
              <hr>
              <div class="buttons is-flex-center">
                <a v-show="shop.plan === $route.params.plan" class="button is-light ">
                  <span>Contratado</span>
                </a>
                <a v-show="shop.plan !== $route.params.plan || !shop.plan" @click="paySelectionModal" class="button is-info ">
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
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
import PaySelectionBox from '@/components/PaySelectionBox'
export default {
  name: 'plan_form',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent,
    PaySelectionBox
  },
  data () {
    return {
      saving: false,
      isPayModalActive: false,
      payMode: null,
      planPeriod: 'mes',
      planPrice: null,
      planTotal: null,
      data: {}
    }
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  },
  created () {
    axios.get('/landing/5f9300d791a60a67b54a013b').then(res => {
      if (res.data) {
        if (res.data.plans[this.$route.params.plan]) {
          this.data = res.data.plans[this.$route.params.plan]
        }
        this.updatePlanPeriod(this.planPeriod)
      }
    })
  },
  methods: {
    paySelectionModal () {
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
    },
    startPlan (plan) {
      console.log('start plan')
    },
    updatePlanPeriod (period) {
      const data = this.data
      let total = data.price
      let price = data.price
      if (period === 'semestral') {
        total *= 6
        total *= 1 - (data.biannual_discount / 100)
        price = parseInt(total / 6)
      } else if (period === 'anual') {
        total *= 12
        total *= 1 - (data.annual_discount / 100)
        price = parseInt(total / 12)
      }
      this.planPrice = parseInt(price)
      this.planTotal = parseInt(total)
      this.planPeriod = period
    },
    submit () {
      this.saving = true
      this.form.social = this.social.map(e => {
        if (!e.url || e.url.indexOf('http') > -1) {
          return e
        }
        let str = e.url.split(' ').join('')
        if (e.icon === 'whatsapp') {
          e.url = `https://wa.me/${str}`
        } else if (e.icon === 'facebook') {
          e.url = `https://facebook.com/${str}`
        } else if (e.icon === 'instagram') {
          e.url = `https://instagram.com/${str}`
        } else if (e.icon === 'youtube') {
          e.url = `https://youtube.com/${str}`
        } else if (e.icon === 'medium') {
          e.url = `https://medium.com/${str}`
        } else if (e.icon === 'twitter') {
          e.url = `https://twitter.com/${str}`
        } else if (e.icon === 'vimeo') {
          e.url = `https://vimeo.com/${str}`
        } else if (e.icon === 'twitch') {
          e.url = `https://twitch.com/${str}`
        }
        return e
      }).filter(e => e.url)
      this.saving = true
      this.$store.dispatch('update', { extra: this.form }).then(res => {
        this.saving = false
        this.$buefy.toast.open({
          message: `Planes actualizados`,
          type: 'is-success',
          queue: false
        })
      })
    }
  }
}
</script>
