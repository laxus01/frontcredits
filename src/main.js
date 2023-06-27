import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import Filters from './helpers/helper'

Vue.config.productionTip = false
Vue.use(Filters)

axios.defaults.baseURL = 'https://backcredits-production.up.railway.app/'

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authToken = window.localStorage.getItem('authToken')
    !authToken ? router.push('/') : next()
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')