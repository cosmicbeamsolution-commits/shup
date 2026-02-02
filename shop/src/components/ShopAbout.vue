<template>
  <div class="content shop-about">
    <h4 class="is-font-black has-text-centered">Acerca de {{ shop.shop }}</h4>
    <div v-show="shop.about_photo" class="shop-about-photo" :style="`background-image: url(${shop.about_photo})`"></div>
    <div v-show="shop.about" class="shop-about-text">
      <p class="has-text-color">{{ shop.about }}</p>
      <p v-show="shop.about_important" class="shop-about-important is-font-black">{{ shop.about_important }}</p>
    </div>
    <div v-show="!shop.about">
      <p>{{ shop.shop }} todavía no tiene información</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ShopAbout',
  computed: {
    ...mapState([
      'shop'
    ])
  }
}
</script>
