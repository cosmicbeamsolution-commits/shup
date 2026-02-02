import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* All require auth except for Login */
export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('./views/Landing.vue')
    },
    {
      path: '/crea-tu-tienda/:name?',
      name: 'shop_create',
      component: () => import('./views/ShopCreate.vue')
    },
    {
      path: '/tienda-creada',
      name: 'shop_created',
      component: () => import('./views/ShopCreated.vue')
    },
    {
      path: '/proba-nuestro-gestor',
      name: 'test_panel',
      component: () => import('./views/TestPanel.vue')
    },
    {
      path: '/preguntas-frecuentes',
      name: 'faq',
      component: () => import('./views/FAQ.vue')
    },
    {
      path: '/terminos-y-condiciones',
      name: 'terms',
      component: () => import('./views/Terms.vue')
    },
    {
      path: '/planes',
      name: 'planes',
      meta: {
        theme: 'has-background-info'
      },
      component: () => import('./views/Plans.vue')
    },
    {
      path: '/contacto',
      name: 'contact',
      component: () => import('./views/Contact.vue')
    },
    {
      path: '/contacto-enviado',
      name: 'contact_sent',
      component: () => import('./views/ContactSent.vue')
    },
    {
      path: '*',
      name: 'page',
      meta: {
        white: true
      },
      component: () => import('./views/Page.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
