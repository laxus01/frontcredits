import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreatePayment from '../views/CreatePayment'
import CreateCredit from '../views/CreateCredit'
import RegisterPaid from '../views/RegisterPaid'
import BalancePayment from '../views/BalancePayment'
import Dashboard from '../views/Dashboard'
import EditPaids from '../views/EditPaids'
import EditCredits from '../views/EditCredits'
import ActualState from '../views/ActualState'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',  
    component: HomeView  
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/create-payment',
        name: 'CreatePayment',
        component: CreatePayment,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/register-paid',
        name: 'RegisterPaid',
        component: RegisterPaid,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/create-credit/:id',
        name: 'CreateCredit',    
        props: true,
        component: CreateCredit,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/balance-payment',
        name: 'BalancePayment',    
        props: true,
        component: BalancePayment,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/edit-paids',
        name: 'EditPaids',    
        props: true,
        component: EditPaids,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/edit-credits',
        name: 'EditCredits',    
        props: true,
        component: EditCredits,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/actual-state',
        name: 'ActualState',    
        props: true,
        component: ActualState,
        meta: {
          requiresAuth: true,
        },  
      },
    ],  
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
