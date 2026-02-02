<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      Perfil
      <router-link slot="right" to="/" class="button ">
        Contraseña
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <password-update-form/>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import PasswordUpdateForm from '@/components/PasswordUpdateForm'
export default {
  name: 'Password',
  components: {
    NavBar,
    AsideMenu,
    PasswordUpdateForm,
    HeroBar
  }
}
</script>
