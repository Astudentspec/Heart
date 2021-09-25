import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		// 展示具体文章的ID
		article_id: 0,
		// 需要编辑的文章ID
		activeArt_id: 0,
		// 注册完时的用户信息
		register_user_info: {
		},
		user_info: {},
		// 当前登录用户的消息列表
		letters: [],
		// 轻聊消息列表
		chatRoom: [],
		// 当前跟谁在聊天
		targetUserId: '',
		// 当前连接的socket对象
		socketTask: '',
		// 私信列表滚动到底部
		letters_scroll: 9999999,
		
	},
    mutations: {},
    actions: {}
})
export default store