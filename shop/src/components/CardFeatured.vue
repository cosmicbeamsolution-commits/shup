<template>
  <div class="card" ref="cardProvider">
    <div class="card-content content">
      <div class="columns is-mobile">
        <div class="column is-4">
          <div class="card-avatar" :style="`background-image: url('${dataItem.photo}')`"/>
        </div>
        <div class="column is-menu-text is-clickable">
          <h5 class="is-marginless">{{ dataItem.name }}</h5>
          <!--span class="is-block has-text-success is-size-6">${{ dataItem.price }}</span-->
          <p>{{ dataItem.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardFeatured',
  data () {
    return {
      showIcons: false
    }
  },
  props: {
    dataItem: {
      type: Object,
      default: () => {}
    },
    icon: {
      type: String,
      default: null
    },
    headerIcon: {
      type: String,
      default: null
    }
  }
}
</script>
