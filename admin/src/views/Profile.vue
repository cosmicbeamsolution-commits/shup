<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      Perfil
      <router-link slot="right" to="/" class="button">
        Perfil
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <tiles>
        <profile-update-form class="tile is-child"/>
      </tiles>
      <password-update-form/>
    </section>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import ProfileUpdateForm from '@/components/ProfileUpdateForm'
import PasswordUpdateForm from '@/components/PasswordUpdateForm'
import Tiles from '@/components/Tiles'
export default {
  name: 'Profile',
  components: {
    NavBar,
    AsideMenu,
    Tiles,
    PasswordUpdateForm,
    ProfileUpdateForm,
    HeroBar
  }
}
</script>
