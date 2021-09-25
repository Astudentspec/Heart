<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			uni.getSystemInfo({
				success: (res) => {
					console.log("手机可用高度:" + res.windowHeight * 2 + "rpx");
				}
			})

			// token标志来判断
			let token = uni.getStorageSync('userInfo').token;
			console.log("token:" + token);
			if (!token) {
				console.log("未登录");
				//不存在则跳转至登录页
				uni.reLaunch({
					url: "/pages/login/index",
					success: () => {
						plus.navigator.closeSplashscreen();
					}
				})
			} else {
				//存在则关闭启动页进入首页
				plus.navigator.closeSplashscreen();
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
			
		},
		
		onUnload(){
			console.log("页面卸载");
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import url("static/iconfont")
	@import url("static/animate.min");
	// @import "uview-ui/index.scss";

	page {
		padding: 0;
		margin: 0;
		list-style: none;
		width: 100%;
		height: 100%;
	}
</style>
