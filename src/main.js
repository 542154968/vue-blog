// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import ElementUI from 'element-ui'
import blog from './assets/javascript/base.js'

import 'element-ui/lib/theme-default/index.css'
import './assets/css/reset.css'
import './assets/css/font-awesome.min.css'
import Animate from 'animate.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' //样式文件

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})


Vue.prototype.$ajax = axios
Vue.prototype.$blog = blog
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


