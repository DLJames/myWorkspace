// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import echarts from 'echarts'
import router from './router'
import Header from './components/Header'
import DashBoard from './components/DashBoard'

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { Header, DashBoard},
  template: '<div id="jms-frame" class="jms-frame"><Header></Header><DashBoard></DashBoard></div>'
})
