<template>
  <aside
    v-show="isAsideVisible"
    class="aside is-placed-left is-expanded">
    <aside-tools :is-main-menu="true">
      <span slot="label">
        <router-link to="/">
          <span class="has-text-weight-bold">
            geotiendas
          </span>
        </router-link>
      </span>
    </aside-tools>
    <div class="menu is-menu-main">
      <template v-for="(menuGroup, index) in menu" >
        <p class="menu-label" v-if="typeof menuGroup === 'string'" :key="index">{{ menuGroup }}</p>
        <aside-menu-list
          v-else
          :key="index"
          @menu-click="menuClick"
          :menu="menuGroup"/>
      </template>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import AsideTools from '@/components/AsideTools'

export default {
  name: 'AsideMenu',
  components: { AsideTools },
  computed: {
    menu () {
      return [
        'Gestión',
        [
          {
            label: 'Tiendas',
            icon: 'shopping',
            to: '/shops',
            visible: this.auth
          },
          {
            label: 'Ventas',
            icon: 'cash-usd',
            to: '/sales',
            visible: this.auth,
            updateMark: this.marks.sales
          },
          {
            label: 'Tickets',
            icon: 'headset',
            to: '/tickets',
            visible: this.auth,
            updateMark: this.marks.tickets
          },
          {
            label: 'Suscripciones',
            icon: 'certificate',
            to: '/subscriptions',
            visible: this.auth,
            updateMark: this.marks.sales
          },
          {
            label: 'Eventos',
            icon: 'timeline-clock',
            to: '/events',
            visible: this.auth
          }
        ],
        'Administración',
        [
          {
            to: '/landing',
            label: 'Landing',
            icon: 'rocket',
            visible: this.auth
          },
          {
            to: '/settings',
            label: 'Ajustes',
            icon: 'image-auto-adjust',
            visible: this.auth
          },
          {
            label: 'Cuentas',
            icon: 'account-star',
            to: '/accounts',
            visible: this.auth && this.auth.user.super
          },
          {
            label: 'Consultas',
            icon: 'email',
            to: '/contacts',
            visible: this.auth
          },
          {
            label: 'Newsletter',
            icon: 'email-check-outline',
            to: '/newsletter',
            visible: this.auth
          },
          {
            to: '/pages',
            label: 'Páginas',
            icon: 'square-edit-outline',
            visible: true
          }
        ]
      ]
    },
    ...mapState([
      'isAsideVisible',
      'basic',
      'marks',
      'auth'
    ])
  },
  methods: {
    menuClick (item) {
      //
    }
  }
}
</script>
