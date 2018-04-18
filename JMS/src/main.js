// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import {Input, DatePicker} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import router from './router'
import Main from './components/Main'

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.use(Input);
Vue.use(DatePicker);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {Main},
  template: '<div id="jms-frame" class="jms-frame"><Main></Main></div>'
})
