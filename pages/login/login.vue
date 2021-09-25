<template>
	<view class="login">
		<returnOperate :content="content"></returnOperate>
		<view class="content">
			<view class="title">欢迎登录心灵驿站</view>


			<u-form :model="form" ref="uForm">
				<u-form-item label="账号" prop="username">
					<u-input v-model="form.username" />
				</u-form-item>
				<u-form-item label="密码" prop="password">
					<u-input type="password" :clearable="false" v-model="form.password" />
				</u-form-item>
				<u-button type="success" @click="submit()">登录</u-button>
			</u-form>


			<view class="alternative">
				<view class="issue">遇到问题</view>
				<navigator url="./register" class="issue blue">注册</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import returnOperate from '@/components/returnOperate.vue'
	import api from "@/api/index.js"

	export default {
		data() {
			return {
				content: "登录",
				form: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		components: {
			returnOperate
		},
		onShow() {
			if (this.$store.state.register_user_info.email == undefined) {
				this.form = this.$store.state.register_user_info
			}
			
		},
		methods: {

			async submit() {
				let is_req = true
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过')

					} else {

						is_req = false
						console.log(valid);
						console.log('验证未通过');
					}
				})

				if (is_req) { // 如果验证通过
					console.log("发送请求");
					const result = await api.login(this.form)
					// 调用判断方法 看是否验证成功
					const req_state = this.$showToast(result)
					if (req_state) { // 如果拿到的不为null 则登录成功
						uni.setStorageSync("userInfo", result.data) // 永久存储
						this.$store.state.user_info = result.data // 全局状态
						// 跳转
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index',
								animationType: 'pop-in',
								animationDuration: 1000
							})
						}, 1000)

					} else {
						this.form.username = ''
						this.form.password = ''
					}
				}
				this.$store.state.register_user_info = {}
			},
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 600rpx;
		margin: 150rpx auto 0;

		.title {
			text-align: left;
			font-size: 50rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}

		input {
			text-align: left;
			margin-bottom: 10rpx;
			margin-top: 15rpx;
			padding-bottom: 6rpx;
		}

		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}

		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;

			&::after {
				border: none;
			}
		}

		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;

			view:nth-child(2) {
				padding-bottom: 5rpx;
				color: blue;
				border-bottom: 2px solid blue;
			}
		}
	}
</style>
