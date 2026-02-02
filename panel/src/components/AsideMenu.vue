<template>
  <aside
    v-show="isAsideVisible"
    class="aside is-placed-left is-expanded">
    <aside-tools :is-main-menu="true">
      <span slot="label">
        <router-link to="/">
          <span class="has-text-weight-bold">
            {{ shop.shop }}
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
            to: '/catalogo',
            label: 'Catálogo',
            icon: 'tray-full',
            visible: this.auth
          },
          {
            label: 'Ventas',
            icon: 'cash-usd',
            to: '/ventas',
            visible: this.auth,
            updateMark: this.marks.sales
          },
          {
            label: 'Suscripciones',
            icon: 'certificate',
            to: '/suscripciones',
            visible: this.auth
          },
          {
            label: 'Presupuestos',
            icon: 'clipboard-flow',
            to: '/presupuestos',
            visible: this.shop.type === 'services',
            updateMark: this.marks.sales
          },
          {
            label: 'Soporte',
            icon: 'email',
            to: '/soporte',
            visible: !['advanced', 'premium'].includes(this.shop.plan),
            updateMark: this.marks.tickets
          },
          {
            label: 'Tickets',
            icon: 'headset',
            to: '/tickets',
            visible: ['advanced', 'premium'].includes(this.shop.plan),
            updateMark: this.marks.tickets
          },
          {
            label: 'Envíos',
            icon: 'map-marker-multiple-outline',
            to: '/envios',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          },
          {
            label: 'Clientes',
            icon: 'account-card-details',
            to: '/clientes',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          }
        ],
        'Administración',
        [
          {
            to: '/tienda',
            label: 'Tienda',
            icon: 'shopping',
            visible: this.auth
          },
          {
            to: '/planes',
            label: 'Planes',
            icon: 'rocket',
            visible: this.auth
          },
          {
            to: '/paginas',
            label: 'Páginas',
            icon: 'square-edit-outline',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          },
          {
            to: '/blog',
            label: 'Blog',
            icon: 'blogger',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          },
          {
            label: 'Cuentas',
            icon: 'account-star',
            to: '/cuentas',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          },
          {
            label: 'Consultas',
            icon: 'email',
            to: '/contactos',
            visible: ['advanced', 'premium'].includes(this.shop.plan)
          }
        ],
        'Aplicación',
        [
          {
            to: '/ajustes',
            label: 'Ajustes',
            icon: 'image-auto-adjust',
            visible: this.auth
          }
        ]
      ]
    },
    ...mapState([
      'isAsideVisible',
      'shop',
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
