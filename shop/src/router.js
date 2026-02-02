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
      path: '/datos',
      name: 'pay_form',
      component: () => import('./views/PayForm.vue')
    },
    {
      path: '/pagar',
      name: 'pay_action',
      component: () => import('./views/PayAction.vue')
    },
    {
      path: '/pago-procesado/:status?',
      name: 'payment_status',
      component: () => import('./views/PaymentStatus.vue')
    },
    {
      path: '/ventas/:id',
      name: 'sale',
      component: () => import('./views/Sale.vue')
    },
    {
      path: '/cotizaciones/:id',
      name: 'quote',
      component: () => import('./views/Quote.vue')
    },
    {
      path: '/geo',
      name: 'coverage',
      component: () => import('./views/Coverage.vue')
    },
    {
      path: '/gracias',
      name: 'thanks',
      component: () => import('./views/Thanks.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
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
