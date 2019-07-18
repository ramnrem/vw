import Vue from 'vue'
import { i18n } from './plugins'
import './components'
import './assets/css/app.scss'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

document.addEventListener('DOMContentLoaded', () => {  
  new Vue({
    store,
    router,
    i18n,
    ...App
  })
})
