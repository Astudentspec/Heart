<template>
	<view class="editor">
		<returnOperate content="设置"></returnOperate>
		<image src="../../../static/img/editor.jpg" mode="aspectFill"></image>
		<view>
			<input v-model="userInfo.username" />
			<text @click="updateUsername">修改</text>
		</view>
		<view>
			<input v-model="userInfo.password" />
			<text @click="updatePassword">修改</text>
		</view>
		<view>
			<image :src="userInfo.upic" />
			<text @click="updateUpic">修改</text>
		</view>
		<view>关于我们</view>
		<view @click="shutLogin">退出登录</view>
	</view>
</template>

<script>
	import returnOperate from "@/components/returnOperate.vue"
	export default {
		data() {
			return {
				userInfo: {},
				oldUsername: '',
				oldPassword: '',
				usernameInputDisabled: true
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync("userInfo")
			this.oldUsername = this.userInfo.username
			this.oldPassword = this.userInfo.password
			console.log(this.userInfo);
		},
		components: {
			returnOperate
		},
		methods: {
			async updateUsername() {
				console.log("修改用户名");
				if (this.oldUsername === this.userInfo.username) {
					return this.$showToast("请输入新用户名")
				}
				const result = await this.$api.updateUsername({
					username: this.userInfo.username,
					uId: this.userInfo.id
				})
				uni.setStorageSync("userInfo",this.userInfo)
				this.$showToast(result)
			},
			async updatePassword() {
				console.log("修改密码");
				if (this.oldPassword === this.userInfo.password) {
					return this.$showToast("请输入新密码")
				}
				const result = await this.$api.updatePassword({
					password: this.userInfo.password,
					uId: this.userInfo.id
				})
				uni.setStorageSync("userInfo",this.userInfo)
				this.$showToast(result)
			},
			updateUpic() {
				const _this = this
				console.log("$api:" + _this.$api)
				// 选择图片并上传 图片张数最多一张
				uni.chooseImage({
					count: 1,
					async success(res) {
						uni.showLoading({
							title: "上传中"
						})
						console.log(res);
						if (res.tempFilePaths.length >= 1) {
							console.log("选择成功");
							const filePath = res.tempFilePaths[0]
							// 把图片当做参数调用接口存入cos 得到cos路径再调用接口存入后端
							await uni.uploadFile({
								url: _this.$uploadFilePath,
								filePath: filePath,
								name: "file",
								success:async res => {
									const cos_pic_path = res.data
									console.log(cos_pic_path);
									
									// 调用设置用户头像的接口
									console.log(_this.$api)
									const result = await _this.$api.updateUserPic({picPath: cos_pic_path,uId: _this.userInfo.id})
									uni.hideLoading()
									if (_this.$showToast(result)) {
										console.log("成功")
										_this.userInfo.upic = cos_pic_path
										
									}
									
								}
							})
						}
					}
				});
				uni.setStorageSync("userInfo",this.userInfo)
			},
			
			// 退出登录
			shutLogin() {
				// websocket 断开连接
				this.$store.state.socketTask.close()
				uni.setStorageSync("userInfo","")
				uni.setStorageSync("token","")
				uni.reLaunch({
					url: '../../login/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.editor {
		width: 100%;
		height: 100%;
		background-color: #f3f3f3;

		image {
			width: 100%;
		}


		view {
			width: 100%;
			margin-bottom: 20rpx;
			box-shadow: 2px 5px 20px #eaeaea;
			padding: 10px;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;

			text {
				margin-right: 30rpx;
				color: #72abff;
			}

			image {
				width: 100rpx;
				height: 100rpx;
				vertical-align: middle;
				border-radius: 50%;
			}
		}

		view:last-child {
			display: block;
			text-align: center;
			color: red;
		}

	}
</style>
