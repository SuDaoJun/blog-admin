// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from '@/api/index'
import {baseURL} from '@/api/axios'
import store from './store'
import echarts from 'echarts'
import moment from 'moment'
import VueParticles from 'vue-particles'
import '@/assets/icons/iconfont.css'
import animated from 'animate.css'
import {constant, mainMessage} from '@/utils/utils'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
let Base64 = require('js-base64').Base64
import './permission'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueParticles)
Vue.use(animated)

// 千分位过滤器,value为传过来数值，arg1为参数
Vue.filter('NumFormat', function (value, arg1) {
  if (!value) return ' '
  let intPart = parseInt(value).toFixed(0) // 获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  let result = arg1 ? arg1 + intPartFormat : intPartFormat;
  return result;
})
// 代码高亮
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
      hljs.highlightBlock(block)
  })
})
Vue.prototype.$api = api;
Vue.prototype.$baseURL = baseURL;
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment;
Vue.prototype.$Base64 = Base64;
Vue.prototype.$message = mainMessage;
Vue.prototype.$constant = constant;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
