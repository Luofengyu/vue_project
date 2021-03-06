// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import MathJax from 'mathjax'

Vue.config.productionTip = false
axios.defaults.baseURL = '/api'
Vue.prototype.$ajax = axios
Vue.prototype.MathJax = MathJax

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
