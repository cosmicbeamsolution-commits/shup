<template>
  <card-component>
    <!--pre v-html="item"/-->
    <div class="columns is-vcentered">
      <div class="column is-2 has-text-centered">
        <span class="subtitle has-text-grey has-text-weight-bold">{{ item.created | adjustRecentTZ }}</span>
      </div>
      <div class="column is-4">
        <div class="is-widget-label">
          <h3 class="subtitle is-spaced">
            <b-icon v-if="item.tag === 'pageview'" icon="eye" size="is-small" type="is-success"/>
            <b-icon v-if="item.tag === 'click'" icon="gesture-tap-button" size="is-small" type="is-info"/>
            <b-icon v-if="item.tag === 'search'" icon="magnify" size="is-small" type="is-warning"/>
            {{ item.shop_name }}
          </h3>
          <h6>
            <b-icon v-if="item.device.res.width <= 480" icon="cellphone-android" size="is-small" type="is-success"/>
            <b-icon v-if="item.device.res.width >= 1024" icon="desktop-mac" size="is-small" type="is-info"/>
            <b-icon v-if="item.device.res.width > 480 && item.device.res.width < 1024" icon="tablet" size="is-small" type="is-warning"/>
            {{ item.device.res.width }}x{{ item.device.res.height }}px, {{ item.device.browser }} {{ item.device.os }}
          </h6>
        </div>
      </div>
      <div class="column is-4">
        <h1 class="title">
          {{ item.value }}
        </h1>
      </div>
      <div v-if="item.geo" class="column is-2 has-widget-icon">
        <div class="is-widget-icon has-text-centered">
          <div class="icon is-medium">
            <div class="is-avatar" :style="`background-image: url(${$store.state.endpoint}/img/flags/${item.geo.country_iso.toLowerCase()}.svg)`"></div>
          </div>
        </div>
        <h6 class="title has-text-centered">
          {{ item.geo.city }} {{ item.geo.region }} {{ item.geo.country }}
        </h6>
        <!-- Ends screen exclusives -->
      </div>
    </div>
  </card-component>
</template>

<script>
// import moment from 'moment'
import CardComponent from '@/components/CardComponent'
export default {
  name: 'CardUserStats',
  components: { CardComponent },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
