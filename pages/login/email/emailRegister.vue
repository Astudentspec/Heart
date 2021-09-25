<template>
	<view class="login">
		<returnOperate :content="content"></returnOperate>
		<view class="content">
			<view class="title">欢迎来到心灵驿站</view>


			<u-form :model="form" ref="uForm">
				<u-form-item label="邮箱" prop="email">
					<u-input placeholder="请输入邮箱" v-model="form.email" border="border" />
				</u-form-item>

				<u-form-item class=" animated bounceIn" label="名字" prop="username">
					<u-input v-model="form.username" placeholder="请输入名字" :clearable="false" border="border" />
				</u-form-item>
				<u-form-item class=" animated bounceIn" label="密码" prop="password">
					<u-input type="password"  v-model="form.password" placeholder="请输入密码" :clearable="false" border="border" />
				</u-form-item>

				<u-form-item class=" animated bounceIn">
					<u-input v-model="form.code" placeholder="请输入验证码" :clearable="false" border="border" />
					<u-button :disabled="time > 0 ? true  : false" type="success" @click="getCode()">
						{{ time == 0 ? '获取验证码' : time }}
					</u-button>
				</u-form-item>


				<u-button type="success" @click="register" class="animated bounceIn">注册</u-button>
			</u-form>


			<view class="alternative">
				<view class="issue">遇到问题</view>
			</view>
		</view>
	</view>
</template>

<script>
	import returnOperate from '@/components/returnOperate.vue'
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				content: "邮箱注册",
				form: {
					username: '',
					password: '',
					email: '',
					code: ''
				},
				code: '',
				rules: {
					username: [{
						required: true,
						message: '请输入名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur'
					}],
					password: [{
						min: 7,
						required: true,
						message: '密码不能少于七位',
						trigger: 'blur'
					}],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.email(value);
							},
							message: '邮箱不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}

					]
				},
				time: 0,
				interval: ''
			}
		},
		components: {
			returnOperate
		},
		methods: {
			findUser() {
				if (this.form.username != '') {
					this.$request('post', "/user/login", this.form).then(res => {
						if (res.msg != "此用户不存在") {
							this.showToast("此用户存在")
							this.form.username = ''
						} else {
							this.showToast("用户名可以使用")
							this.password_show = true
						}
					})
				}

			},
			async register() {
				uni.showLoading({
					title: '注册中'
				})
				let valid_result = true
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.form.code.trim() == '') {
							valid_result = false
							uni.showToast({
								title: "请输入验证码",
								icon: 'none'
							})
						}
						console.log("验证成功");
					} else {
						valid_result = false
						console.log('验证失败');
					}

				})


				if (valid_result) {
					// 发起邮箱注册请求
					let result = await api.emailRegister(this.form)
					uni.hideLoading()
					if (result.state != 200) {
	
						if (result.msg == "验证码错误") {
							this.form.code = ""
						}else{
							this.form.username = ""
							this.form.password = ""
							this.form.code = ""
							this.form.email = ""
						}
						
					} else {
						this.$store.state.register_user_info = this.form
						uni.navigateTo({
							url: '/pages/login/email/emailLogin',
							animationType: 'pop-in',
							animationDuration: 1000
						})
					}
					this.showToast(result.msg)
				}
			},
			async getCode() {
				uni.showLoading()

				let valid_result = true
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log("验证成功");
					} else {
						valid_result = false
						console.log('验证失败');
					}

				})
				
				/**
				 * 判断是否验证通过
				 */
				if (valid_result) {
					const sessionId = await api.getEmailCode(this.form.email)
					uni.setStorageSync("sessionId", sessionId)
					this.time = 60
					this.interval = setInterval(() => {
						this.time = this.time - 1
						if (this.time == 0) {
							clearInterval(this.interval)
						}
					}, 1000)
					console.log(sessionId);
				}

				uni.hideLoading()
			},
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			},
			showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 1000
				})
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
			height: 40rpx;
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
