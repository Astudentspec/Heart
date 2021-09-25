<template>
	<view class="letter">
		<view class="header">
			<view>
				消息列表
			</view>
		</view>
		<view @longpress="longPress(index)" v-for="item,index in $store.state.letters" @click="toChat(item.fromId)"
			:key="index">
			<image :src="item.fromUserPic" mode=""></image>
			<view>
				<text>
					{{ item.fromUsername }}
				</text>
				<text>{{ item.msg }}</text>

			</view>
			<view>
				{{ item.time }}
			</view>

		</view>
		
	


	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: [],
				deleteIndex: -1, // 索引值
				letters: []
			}
		},
		methods: {
			// 跳转到聊天框
			toChat(id) {
				console.log(id);
				this.$store.state.targetUserId = id
				uni.navigateTo({
					url: "./show/show",
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},
			// 长按触发
			longPress(index) {
				console.log("你对 " + index + "进行了长按");
				this.deleteIndex = index
			},
			delete(){
				console.log(this.deleteIndex);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		width: 100%;
		padding: 30px 0;
		background-color: #FFFFFF;
		border: 0;
		text-align: center;
		display: flex;
		justify-content: space-between;


		.add {
			border-radius: 0;
			width: 50rpx;
			height: 50rpx;
			margin: -10rpx 40rpx 0 0;
		}
	}


	.letter {
		width: 100%;
		height: 100%;
		background-color: #f4f4f4;

		&>view {
			width: 100%;
			background-color: #FFFFFF;
			margin-top: 2px;
			padding: 10px;
			display: flex;

			image {
				width: 75rpx;
				height: 75rpx;
				border-radius: 50%;
			}

			view:nth-child(2) {
				width: 60%;
				display: flex;
				flex-direction: column;
				margin: -7rpx 0 0 20rpx;


				text {
					font-size: 25rpx;
				}

				text:nth-child(2) {
					width: 80%;
					word-break: break-all;
					/*允许在单词内换行*/
					text-overflow: ellipsis;
					/*显示省略符号来代表被修剪的文本*/
					overflow: hidden;
					white-space: nowrap;
					/*不换行 控制单行文本*/
				}
			}

			view:nth-child(3) {
				text-align: center;
				width: 30%;
				font-size: 20rpx;
				color: #d6d6d6;
			}

		}

	}
</style>
