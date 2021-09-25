<template>
	<view class="content">
		<view class="blur">
			<view class="login_type animated bounceIn">
				<view @tap="login_type(1)">
					<image src="../../static/img/login.png" mode=""></image>
					<text>登录</text>
				</view>
				<view @tap="login_type(2)">
					<image src="../../static/img/email.png" mode=""></image>
					<text>邮箱登录</text>
				</view>
				<view @tap="login_type(3)">
					<image src="../../static/img/register.png" mode=""></image>
					<text>注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		onShow() {
			this.input_visible = true
		},
		methods: {

			// 进行各自类型的登录界面
			login_type(type) {
				switch (type) {
					case 1:
						console.log("登录");
						uni.navigateTo({
							url: './login',
							animationType: 'pop-in',
							animationDuration: 1000
						});
						break;
					case 2:
						console.log("邮箱注册")
						uni.navigateTo({
							url: './email/emailLogin',
							animationType: 'pop-in',
							animationDuration: 1000
						});
						break;
					case 3:
						uni.navigateTo({
							url: './register',
							animationType: 'pop-in',
							animationDuration: 1000
						});
						console.log("注册");
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
		background: url(../../static/img/login_back.jpg) no-repeat;

		.blur {
			width: 100%;
			height: 100%;
			background-color: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(2px);
		}


		.login_type {
			padding: 10px;
			width: 70%;
			position: fixed;
			bottom: 500rpx;
			left: 100rpx;
			// background-color: gray;
			// backdrop-filter: blur(3px);
			border-radius: 25px;

			view {
				padding: 8px;
				backdrop-filter: blur(10px);
				margin-top: 15rpx;
				border-radius: 25px;
				background-color: rgba(221, 255, 234, 0.7);
			}
			view:nth-child(2){
				text{
					margin-left: 130rpx;
				}
			}



			image {
				width: 60rpx;
				height: 60rpx;
				vertical-align: middle;
			}

			text {
				display: inline-block;

				margin-left: 165rpx;
			}


		}
	}
</style>
