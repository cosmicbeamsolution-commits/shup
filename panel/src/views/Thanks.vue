<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="rocket" size="is-medium"/>
      <span> Gracias</span>
      <router-link slot="right" to="/" class="button ">
        Escritorio
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <div class="container is-vexpanded content">
        <card-component title="Gracias por tu suscripción en geotiendas" icon="certificate" class="animated fadeIn delay">
          <p>Revisá tu email para mas detalles de tu suscripción.</p>
          <hr>
          <div class="has-text-centered">
            <router-link to="/">
              <b-button type="white ">Ir a Escritorio</b-button>
            </router-link>
          </div>
        </card-component>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import CardComponent from '@/components/CardComponent'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'thanks',
  components: {
    NavBar,
    AsideMenu,
    HeroBar,
    CardComponent
  }
}
</script>
