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
      name: 'home',
      component: () => import('./views/Dash.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: () => import('./views/ForgotPassword.vue')
    },
    {
      path: '/resetpassword/:code',
      name: 'resetpassword',
      component: () => import('./views/ResetPassword.vue')
    },
    {
      path: '/comenzar',
      name: 'wizard',
      component: () => import('./views/Wizard.vue')
    },
    {
      path: '/validar/:code',
      name: 'shop.validate',
      component: () => import('./views/ShopValidate.vue')
    },
    {
      path: '/search/:query',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/ajustes',
      name: 'application',
      component: () => import('./views/Application.vue')
    },
    {
      path: '/planes',
      name: 'plans',
      component: () => import('./views/Plans.vue')
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
      path: '/gracias',
      name: 'thanks',
      component: () => import('./views/Thanks.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('./views/Blog.vue')
    },
    {
      path: '/blog/:id',
      name: 'blog.edit',
      component: () => import('./views/BlogForm.vue')
    },
    {
      path: '/blog/:id/:sid',
      name: 'blog.entries',
      component: () => import('./views/BlogSubForm.vue')
    },
    {
      path: '/pages',
      name: 'pages',
      component: () => import('./views/Pages.vue')
    },
    {
      path: '/pages/:id',
      name: 'pages.edit',
      component: () => import('./views/PagesForm.vue')
    },
    {
      path: '/catalogo',
      name: 'stock',
      component: () => import('./views/Stock.vue')
    },
    {
      path: '/catalogo/:id',
      name: 'stock.edit',
      component: () => import('./views/StockForm.vue')
    },
    {
      path: '/catalogo/:id/:sid',
      name: 'stock.items',
      component: () => import('./views/StockSubForm.vue')
    },
    {
      path: '/soporte',
      name: 'support',
      component: () => import('./views/Support.vue')
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('./views/Tickets.vue')
    },
    {
      path: '/tickets/:id',
      name: 'tickets.edit',
      component: () => import('./views/TicketForm.vue')
    },
    {
      path: '/tienda',
      name: 'shop',
      component: () => import('./views/Shop.vue')
    },
    {
      path: '/ventas',
      name: 'sales',
      component: () => import('./views/Sales.vue')
    },
    {
      path: '/presupuestos',
      name: 'quotes',
      component: () => import('./views/Quotes.vue')
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('./views/Delivery.vue')
    },
    {
      path: '/clientes',
      name: 'customers',
      component: () => import('./views/Customers.vue')
    },
    {
      path: '/sales/print/:id',
      name: 'sale_print',
      component: () => import('./views/SalePrint.vue')
    },
    {
      path: '/sales/print',
      name: 'sales_print',
      component: () => import('./views/SalesPrint.vue')
    },
    {
      path: '/perfil',
      name: 'profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/cuentas',
      name: 'accounts',
      component: () => import('./views/Accounts.vue')
    },
    {
      path: '/cuentas/:id',
      name: 'accounts.edit',
      component: () => import('./views/AccountsForm.vue')
    },
    {
      path: '/contactos',
      name: 'contacts',
      component: () => import('./views/Contacts.vue')
    },
    {
      path: '/contactos/:id',
      name: 'contacts.edit',
      component: () => import('./views/ContactsForm.vue')
    },
    {
      path: '/suscripciones',
      name: 'subscriptions',
      component: () => import('./views/Subscriptions.vue')
    },
    {
      path: '/suscripciones/:id',
      name: 'subscriptions.edit',
      component: () => import('./views/SubscriptionsForm.vue')
    },
    {
      path: '/filters',
      name: 'filters',
      component: () => import('./views/Filters.vue')
    },
    {
      path: '/filters/:id',
      name: 'filters.edit',
      component: () => import('./views/FiltersForm.vue')
    },
    {
      path: '/photos',
      name: 'Fotos',
      component: () => import('./views/Photos.vue')
    },
    {
      path: '/dump/:c',
      name: 'dump',
      component: () => import('./views/Dump.vue')
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
