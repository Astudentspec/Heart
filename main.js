import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import request from 'common/request.js'
// 导入vuex
import store from './store/index.js'
// 导入时间排序的函数
import compare from './common/compare.js'
// 导入时间格式化文件
import dateFormat from './common/dateformat.js'
// 导入全局请求判断的函数
import showToast from './common/showToast.js'
// 导入API文件
import api from './api/index.js'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.config.productionTip = false
Vue.prototype.$dateFormat = dateFormat
Vue.prototype.$compare = compare
Vue.prototype.$showToast = showToast
Vue.prototype.$api = api
// 请求基本路径
Vue.prototype.$base_url = "http://yaolovelive.com:8081"
// ws请求路径
Vue.prototype.$ws_url = "ws://yaolovelive.com:8081"
// 上传图片路径
Vue.prototype.$uploadFilePath = 'http://yaolovelive.com:8081/upload'

Vue.use(uView);
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
