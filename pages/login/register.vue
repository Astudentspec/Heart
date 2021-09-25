<template>
	<view class="login">
		<returnOperate :content="content"></returnOperate>
		<view class="content">
			<view class="title">欢迎来到心灵驿站</view>


			<u-form :model="form" ref="uForm">
				<u-form-item label="用户名" prop="username">
					<u-input placeholder="请输入用户名" v-model="form.username" />
				</u-form-item>
				<u-form-item class=" animated bounceIn" v-show="password_show"  label="密码" prop="password">
					<u-input v-model="form.password" placeholder="请输入密码" :clearable="false" :type="password_type" border="border"  />
				</u-form-item>
				<u-button v-show="!password_show" type="primary " @click="findUser">查重</u-button>
				<u-button v-show="password_show" type="success" @click="register" class=" animated bounceIn">注册
				</u-button>
			</u-form>


			<view class="alternative">
				<view class="issue">遇到问题</view>
			</view>
		</view>
	</view>
</template>

<script>
	import returnOperate from '@/components/returnOperate.vue'
	export default {
		data() {
			return {
				content: "注册",
				form: {
					username: '',
					password: '',
				},
				password_type: "password",
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: 'blur'
					}],
					password: [{
						min: 7,
						required: true,
						message: '密码不能少于七位',
						trigger: 'blur'
					}]
				},
				// 控制显示密码框与按钮内容
				password_show: false
			}
		},
		components: {
			returnOperate
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');

					} else {
						console.log('验证失败');
					}
				});
			},
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
			register() {
				this.$refs.uForm.validate(valid => {
							if (valid) {
								this.$request("post", "/user/register", this.form).then(res => {
									if (res.state != 200) {
										this.msg = "*" + res.msg
										this.input_error = true
										this.showToast(res.msg)
										this.form.username = ""
										this.form.password = ""
									} else {
										this.msg = ""
										this.showToast("注册成功")
										this.$store.state.register_user_info = this.form
										setTimeout(() => {
											uni.navigateTo({
												url: "./login",
												animationType: 'pop-in',
												animationDuration: 1000
											})
										}, 1000)
									}
								})
							} else {
								console.log('验证失败');
							}

						})
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
