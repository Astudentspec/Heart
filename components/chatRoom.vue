<template>
	<view class="chatRoom">
		<!-- 聊天内容展示区 -->
		<scroll-view @scroll="scroll" :scroll-into-view="scrollIntoView" ref="chatRoom" scroll-y="true"
			:scroll-top="scroll_top" :scroll-with-animation="true" :show-scrollbar="true">

			<view class="msgs">
				<view v-for="item,index in this.$store.state.chatRoom" :id="'msg' + index"
					:class="[item.fromUsername == fromUsername ? 'my_class' : '' ]">
					<image :src="item.fromUserPic" v-if="item.fromUsername != fromUsername"></image>
					<text>{{ item.msg }}</text>
					<image :src="item.fromUserPic" v-if="item.fromUsername == fromUsername"></image>
				</view>
			</view>

		</scroll-view>
		<view class="bottom">
			<input v-model="message.msg" type="text" placeholder="一起聊天吧" />
			<image @tap="send" src="../static/img/send.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "chatRoom",
		data() {
			return {
				message: {
					fromUserPic: '',
					msg: '',
					time: '2019-1-9',
					action: 2,
					fromUsername: ''
				},
				scroll_top: 0,
				fromUsername: '',
				infos: [],
				conn_state: false,
				scrollIntoView: ''
			};
		},
		methods: {
			send() {
				this.message.fromUserPic = uni.getStorageSync("userInfo").upic
				this.message.fromUsername = uni.getStorageSync("userInfo").username
				this.fromUsername = uni.getStorageSync("userInfo").username
				// 发送消息调用 socketTask
				this.$store.state.socketTask.send({
					data: JSON.stringify(this.message)
				})
				this.message.msg = ''
			},
			getEleHeight() {
				const query = uni.createSelectorQuery().in(this);
				let height = 0
				query.select('.msgs').boundingClientRect(data => {
					height = data.height
				}).exec();
				console.log("当前元素高度: -- " + height );
			},

			show(msg) {
				uni.showToast({
					title: msg,
					duration: 1000,
					icon: 'none'
				})
			},
			// 消息置底
			Bottom() {
				console.log("触底");
				setTimeout(() => {
					this.scrollIntoView = "msg" + (this.$store.state.chatRoom.length - 1)

				}, 100)
				console.log(this.scrollIntoView);
			},
			scroll(){}
		}
	}
</script>

<style lang="scss" scoped>
	.chatRoom {
		height: 100%;
		background-color: #f8f8f8;

		scroll-view {
			width: 100%;
			height: 85%;
			padding-right: 100rpx;

			.msgs {
				width: 100%;

				view {
					width: 90%;
					padding: 10px;
					text-align: left;
					margin: auto;
					margin-top: 15px;

					image {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
					}

					text {
						border-radius: 25px;
						background-color: #eaeaea;
						font-size: 24rpx;
						padding: 10px;
						margin-left: 15rpx;
						max-width: 220rpx;
						// text-align: center;
					}
				}


				.my_class {
					text-align: right;
					margin-right: 15rpx;

					text {
						background-color: #05ff8a;
						margin-right: 15rpx;
					}
				}

			}
		}





		// 底部输入框
		.bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 10px;
			display: flex;
			justify-content: space-between;
			background-color: #f8f8f8;

			input {
				width: 650rpx;
				border-radius: 25px;
				padding: 10rpx;
				background-color: #FFFFFF;
			}

			image {
				margin: 10rpx 30rpx 0 0;
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
</style>
