<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="email" size="is-medium"/>
      <span> Soporte</span>
      <a slot="right" href="https://overlemon.com/guia" target="_blank" class="button ">
        Guía geotiendas
      </a>
    </hero-bar>
    <section class="section is-main-section">
      <div class="container is-vexpanded content">
        <h1 class="has-text-centered">Área de soporte</h1>
        <p class="has-text-weight-medium  has-text-centered is-size-5">Somos una plataforma conformada por emprendedores que disfrutan lo que hacen y uno de nuestros principales valores es la calidez y la humanidad con la que gestionamos la relación con nuestros clientes.</p>
        <p>Es por esto que ponemos a disposición este espacio de soporte y nuestro compromiso de responder cualquier tipo de consulta en menos de 24hs.</p>
        <p>Para que podamos brindarte ayuda envianos un email o Whatsapp con el ID de tu tienda y responderemos tu consulta a la brevedad.</p>
        <figure class="figure">
          <img src="/img/support.svg" width="300" />
        </figure>
        <div class="buttons is-flex-center">
          <a :href="`mailto:${basic.settings.email}?Subject=${shop.id}&Body=Hola, necesito ayuda con mi tienda`" class="button " target="_blank">Solicitar ayuda por email</a>
          <a :href="`https://wa.me/${basic.settings.phone}?text=Hola, necesito ayuda con mi tienda ${shop.id}`" class="button " target="_blank">Solicitar ayuda por whatsapp</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
export default {
  name: 'support',
  components: {
    NavBar,
    AsideMenu,
    HeroBar
  },
  data () {
    return {
      saving: false,
      data: {}
    }
  },
  computed: {
    ...mapState([
      'basic',
      'shop'
    ])
  }
}
</script>
