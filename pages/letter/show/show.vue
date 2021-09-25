<template>
	<view class="letterShow" id="letterShow">
		<!-- 返回 -->
		<view class="container">
			<view class="return">
				<image @click="returnLetter" src="../../../static/img/return.png" mode=""></image>

				<view>{{ chatRecord.fromUsername }}</view>

			</view>
		</view>

		<scroll-view class="scrollView" scroll-y="true" show-scrollbar="true" scroll-with-animation="true"
			:scroll-top="scroll_top">
			<view :class="[ item.fromType != 1 ? 'right' : 'left'] " v-for="(item,index) in chatRecord.value"
				:key="index" :id="`msg${index}`">
				<image v-if="item.fromType === 1" :src="chatRecord.fromUserPic"></image>
				<text>{{ item.msg }}</text>


				<image v-if="item.fromType != 1" :src="userInfo.upic " mode=""></image>
			</view>
		</scroll-view>


		<view class="input">
			<input type="text" v-model="message.msg" placeholder="开始聊天吧" />
			<image src="../../../static/img/send.png" @click="send"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatRecord: [],
				userInfo: {},
				message: {
					toId: '',
					fromId: '',
					fromUsername: '',
					fromUserPic: '',
					msg: '',
					time: '',
					action: 1
				}
			}
		},
		components: {

		},
		computed: {
			// scrollIntoView(){
			// 	console.log("定位: " + this.$store.state.letters_num);
			// 	// setTimeout(() => {

			// 	// },100)
			// 	return "msg" + this.$store.state.letters_num
			// },
			scroll_top() {
				return this.$store.state.letters_scroll
			}
		},
		onLoad() {
			this.init()
			this.userInfo = uni.getStorageSync("userInfo")
			this.message.fromUsername = this.userInfo.username
			this.message.fromUserPic = this.userInfo.upic
			this.message.fromId = this.userInfo.id
			this.message.toId = this.$store.state.targetUserId
			// 获取到最后一条消息的信息
			// const selector = `#msg-${this.chatRecord.value.length-1}`
			// this.$nextTick(() => {
			// 	// this.setPageScrollTo(selector)
			// 	this.$store.state.letterScrollTop = new Date().getTime()
			// })

		},
		onPageScroll(e) {
			console.log(e);
		},
		methods: {
			init() {
				// 查找到对应的聊天记录
				this.$store.state.letters.forEach(item => {
					if (item.fromId == this.$store.state.targetUserId) {
						this.chatRecord = item
					}
				})
				console.log(this.chatRecord);
			},
			send() {
				// 获取时间
				this.message.time = this.getLoacalTime()

				this.$store.state.socketTask.send({
					data: JSON.stringify(this.message)
				})
				this.message.msg = ''
			},
			getLoacalTime() {
				let ret;
				let fmt = "YYYY-mm-dd HH:MM"
				let date = new Date()
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				console.log(fmt);
				return fmt;
			},
			// 定位底部的思路为获取最后一条消息的top位置然后再加当前的高度
			// 设置页面滚动位置
			setPageScrollTo(selector) {
				let view = uni.createSelectorQuery().in(this).select(selector);
				console.log(view);
				view.boundingClientRect((res) => {
					console.log(res);
					uni.pageScrollTo({
						scrollTop: res.top - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
						duration: 0
					});
				}).exec();
			},

			// 返回到消息列表
			returnLetter() {
				console.log("纳尼");
				uni.switchTab({
					url: '../letter',
					animationDuration: 1000,
					animationType: 'pop-in'
				})
			},
			// 消息置底
			Bottom() {
				console.log("触底");
				console.log(this.$store.state.chatRoom.length - 1);
				this.scrollIntoView = "msg" + (this.$store.state.chatRoom.length - 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.letterShow {
		height: 90%;
		padding: 10% 0 10% 0;
		background-color: #f4f4f4;

	}

	.scrollView {
		width: 100%;
		height: 95%;
		background-color: #f4f4f4;
	}


	view {
		width: 100%;
		// background-color: #f4f4f4;
		margin-bottom: 2vh;

		image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			margin-right: 30rpx;
			vertical-align: middle;
		}

		text {
			display: inline-block;
			max-width: 260rpx;
			margin-top: 10rpx;
			padding: 10px;
			background-color: #f1f1f1;
			border-radius: 10px;
			font-size: 25rpx;
			text-align: left;

		}

	}



	.right {
		text-align: right;

		image {
			margin-left: 30rpx;
		}

		text {
			background-color: #05ff8a;
		}
	}

	.left {
		text-align: left;

		image {
			margin-right: 30rpx;
		}
	}

	.input {
		width: 100%;
		padding: 10px;
		background-color: #f4f4f4;
		position: fixed;
		bottom: -2vh;
		display: flex;
		justify-content: space-between;

		input {
			width: 620rpx;
			padding: 10px;
			border-radius: 10px;
			background-color: #FFFFFF;
			font-size: 23rpx;
		}

		image {
			margin: 15rpx;
			margin-right: 30rpx;
			width: 50rpx;
			height: 50rpx;
		}
	}

	// 返回的css
	.container {
		position: fixed;
		top: 0;
		width: 100%;
		height: 70rpx;
		background-color: white;
		z-index: 999;
		box-shadow: 1px 1px 200px#f4f4f4;
	}


	.return {
		width: 100%;
		padding-top: 10rpx;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-left: 15rpx;
			vertical-align: middle;
			float: left;
		}

		view {
			text-align: center;
			margin-left: -70rpx;
		}

	}
</style>
