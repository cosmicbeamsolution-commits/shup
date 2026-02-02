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
      path: '/events',
      name: 'events',
      component: () => import('./views/Events.vue')
    },
    {
      path: '/newsletter',
      name: 'newsletter',
      component: () => import('./views/Newsletter.vue')
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
      path: '/updatepassword/:code',
      name: 'updatepassword',
      component: () => import('./views/UpdatePassword.vue')
    },
    {
      path: '/search/:query',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/application',
      name: 'application',
      component: () => import('./views/Application.vue')
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
      path: '/landing',
      name: 'landing',
      component: () => import('./views/Landing.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue')
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('./views/Sales.vue')
    },
    {
      path: '/subscriptions',
      name: 'certificate',
      component: () => import('./views/Subscriptions.vue')
    },
    {
      path: '/shops',
      name: 'shops',
      component: () => import('./views/Shops.vue')
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
      path: '/customers',
      name: 'customers',
      component: () => import('./views/Customers.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('./views/Accounts.vue')
    },
    {
      path: '/accounts/:id',
      name: 'accounts.edit',
      component: () => import('./views/AccountsForm.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('./views/Contacts.vue')
    },
    {
      path: '/contacts/:id',
      name: 'contacts.edit',
      component: () => import('./views/ContactsForm.vue')
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
