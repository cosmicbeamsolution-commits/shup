<template>
  <nav v-show="isNavBarVisible" id="navbar-main" class="navbar is-fixed-top">
    <div class="navbar-brand">
      <a class="navbar-item is-hidden-desktop" @click.prevent="menuToggleMobile">
        <b-icon :icon="menuToggleMobileIcon"/>
      </a>
      <div class="navbar-item">
        <form @submit.prevent="submit">
          <div class="control">
            <input class="input" id="query" v-model="query" placeholder="Buscar...">
            <input type="submit" class="is-hidden"/>
          </div>
        </form>
      </div>
    </div>
    <div class="navbar-brand is-right">
      <a class="navbar-item navbar-item-menu-toggle is-hidden-desktop" @click.prevent="menuNavBarToggle">
        <b-icon :icon="menuNavBarToggleIcon" custom-size="default"/>
      </a>
    </div>
    <div class="navbar-menu fadeIn animated faster" :class="{'is-active':isMenuNavBarActive}">
      <div class="navbar-end">
        <!--nav-bar-menu class="has-divider">
          <b-icon icon="menu" custom-size="default"/>
          <span>Sample Menu</span>
          <div slot="dropdown" class="navbar-dropdown">
            <router-link to="/profile" class="navbar-item" exact-active-class="is-active">
              <b-icon icon="account" custom-size="default"/>
              <span>My Profile</span>
            </router-link>
            <a class="navbar-item">
              <b-icon icon="settings" custom-size="default"/>
              <span>Settings</span>
            </a>
            <a class="navbar-item">
              <b-icon icon="email" custom-size="default"/>
              <span>Messages</span>
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              <b-icon icon="logout" custom-size="default"/>
              <span>Log Out</span>
            </a>
          </div>
        </nav-bar-menu-->
        <nav-bar-menu class="has-divider has-user-avatar">
          <div v-if="auth" class="is-avatar" :style="`background-image: url(${auth.user.photo})`">
          </div>
          <div v-if="auth" class="is-user-name">
            <span class="has-text-weight-bold">{{ auth.user.first_name }}</span>
          </div>
          <div slot="dropdown" class="navbar-dropdown">
            <router-link to="/profile" class="navbar-item">
              <b-icon icon="account" custom-size="default"></b-icon>
              <span>Mi Perfil</span>
            </router-link>
            <!--a class="navbar-item">
              <b-icon icon="settings" custom-size="default"></b-icon>
              <span>Preferencias</span>
            </a>
            <a class="navbar-item">
              <b-icon icon="email" custom-size="default"></b-icon>
              <span>Messages</span>
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item" @click="logout">
              <b-icon icon="logout" custom-size="default"></b-icon>
              <span>Cerrar sesión</span>
            </a-->
          </div>
        </nav-bar-menu>
        <!--a href="https://justboil.me/bulma-admin-template/one" class="navbar-item has-divider is-desktop-icon-only" title="About">
          <b-icon icon="help-circle-outline" custom-size="default"/>
          <span>Acerca de</span>
        </a-->
        <a class="navbar-item is-desktop-icon-only" title="Log out" @click="logout">
          <b-icon icon="logout" custom-size="default"/>
          <span>Cerrar sesión</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import NavBarMenu from '@/components/NavBarMenu'
export default {
  name: 'NavBar',
  components: {
    NavBarMenu
  },
  data () {
    return {
      query: null,
      isMenuNavBarActive: false
    }
  },
  computed: {
    isNextDeliveryOnDue () {
      return moment().isBefore(moment(this.shop.next_delivery_date), 'day')
      // return moment(this.shop.next_delivery_date).isBefore(moment().format(), 'day')
    },
    menuNavBarToggleIcon () {
      return (this.isMenuNavBarActive) ? 'close' : 'dots-vertical'
    },
    menuToggleMobileIcon () {
      return this.isAsideMobileExpanded ? 'backburger' : 'forwardburger'
    },
    ...mapState([
      'isNavBarVisible',
      'isAsideMobileExpanded',
      'auth',
      'shop'
    ])
  },
  methods: {
    menuToggleMobile () {
      this.$store.commit('asideMobileStateToggle')
    },
    menuNavBarToggle () {
      this.isMenuNavBarActive = (!this.isMenuNavBarActive)
    },
    submit () {
      this.$router.push('/admin/search/' + this.query)
    },
    logout () {
      this.$store.dispatch('logout').then((user) => {
        this.$buefy.snackbar.open({
          message: `Hasta luego ${user}, esperamos verte pronto de nuevo`,
          type: 'is-success',
          queue: false
        })
        this.$router.push('/login')
      })
    }
  }
}
</script>
