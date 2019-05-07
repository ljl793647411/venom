import Vue from 'vue'
import vueRouter from 'vue-router'
import vuex from 'vuex'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import createStore from './store/store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment'
import axios from 'axios' 
import Highcharts from 'highcharts/highstock';
import variwide from 'highcharts/modules/variwide';
import createRouter from './router/router'
import App from './App.vue'

Vue.use(vuex)
Vue.use(Antd)
Vue.use(vueRouter)
Vue.use(Highcharts)
const store = createStore()
const router = createRouter()

Vue.config.productionTip = false
Vue.prototype.$msg = Message
Vue.prototype.moment = moment
Vue.prototype.axios = axios
Vue.prototype.Highcharts = Highcharts
variwide(Highcharts)


Vue.filter('formatTime1', function (value) {
	if (value) {
		let valueArr = value.split(" ");
		let timeArr = valueArr[1].split(":");
		return timeArr[0] + ':' + timeArr[1]
	} else {
		return value
	}
})
/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
