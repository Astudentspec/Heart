<template>
	<!-- 全新功能 - 树洞 -->
	<view class="tree_hole">

		<swiper :current="current" @change="change">
			<swiper-item class="index" previous-margin="100px" next-margin="100px" duration="1000">
				<view>
					<image src="../../static/img/createdTreeHole.png" mode=""></image>
					<text>树洞</text>
					<image src="../../static/img/createdTreeHole.png" mode=""></image>
				</view>
				<image @click="tree_show" src="../../static/img/treeHoleBack.png" mode="aspectFill"></image>
				<image :class="[ animated_show == true ? 'splitBall hide' : 'splitBall' ]  "
					src="../../static/img/spitball.png"></image>
			</swiper-item>
			<swiper-item class="write">
				<view>
					<input type="text" placeholder="请输入标题" v-model="form.title" />
					<editor id="editor" placeholder="请输入内容(字数不限制)" @input="editorInput" />
					<u-button class="u-button" size="small" @tap="submit(1)">匿名</u-button>
					<u-button class="u-button" size="small" @tap="submit(2)">公开</u-button>
				</view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				form: {
					title: '',
					content: ''
				},
				current: 0, // 滑块
				animated_show: false
			}
		},
		methods: {
			async submit(state) {
				console.log(uni.getStorageSync("userInfo"));
				console.log(this.form.content.detail.html);
				if (this.form.title.trim() == '' || this.form.content.detail.html.trim() == '') {
					return uni.showToast({
						title: "内容或标题不能为空",
						duration: 1000,
						icon: 'none'
					})
				} else {
					var data = {
						title: this.form.title,
						content: this.form.content.detail.html,
						uId: uni.getStorageSync("userInfo").id,
						isPublic: true
					}
					if (state == 1) {
						data.isPublic = false
					} else {
						data.isPublic = true
					}

					const res = await api.writeTreeHole(data)
					if (this.$showToast(res)) {
						/**
						 * 滑块滑到树洞位置
						 * 添加动画效果
						 * 关闭动画
						 */
						console.log("成功");
						this.current = 0
						setTimeout(() => {
							this.animated_show = true
							setTimeout(() => {
								this.animated_show = false
							}, 5000)
						}, 1000)
						
					}

				}
				this.form.title = ''
				this.form.content = ''
			},
			change(e) {
				this.current = e.detail.current
			},
			tree_show() {
				uni.navigateTo({
					url: './show',
					animationType: 'slide-in-bottom',
					animationDuration: 500
				})
			},
			editorInput(e){
				this.form.content = e
				console.log(e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.tree_hole {
		width: 100%;
		height: 95%;
		padding-top: 10%;
		background-color: #faf9f9;

		swiper {
			width: 100%;
			height: 100%;

			.index {
				width: 100%;
				height: 100%;

				view {
					width: 100%;
					text-align: center;
					font-size: 30rpx;
					position: absolute;
					top: 50rpx;

					image:nth-child(1) {
						width: 90rpx;
						height: 90rpx;
						position: absolute;
						left: 100rpx;
					}

					image:nth-child(3) {
						width: 90rpx;
						height: 90rpx;
						position: absolute;
						right: 100rpx;
					}
				}

				image:nth-child(2) {
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: -1;
				}

				.splitBall {
					width: 300rpx;
					height: 300rpx;
					position: absolute;
					left: 30%;
					bottom: -300rpx;
					z-index: 100;
					opacity: 1;
					border-radius: 50%;
					transform: rotate(70deg);
					transition: 1s all;
				}
			}

			.write {
				view {

					input,
					editor {
						text-align: left;
						width: 100%;
						padding: 10px;
						border-bottom: 1px solid gray;
					}
				}
			}
		}

		.hide {
			animation: hide 2s ease-in 1;
		}


		@keyframes hide {
			0% {
				left: 30%;
				bottom: -150rpx;
				transform: rotate(0deg);
			}

			50% {
				width: 200rpx;
				height: 200rpx;
				left: 20%;
			}

			100% {
				width: 60rpx;
				height: 60rpx;
				left: 35%;
				bottom: 650rpx;
				transform: rotate(3600deg);
			}

		}

		.u-button {
			padding: 10px;
			margin-bottom: 30rpx;
		}
	}
</style>
