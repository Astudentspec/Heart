<template>
	<view class="container">
		<view class="return">
			<image @click="returnShowArticle()" src="../static/img/return.png" mode=""></image>

			<view>{{ content }}</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: 'returnOperate',
		data() {
			return {

			}
		},
		props: [
			"content"
		],
		methods: {
			returnShowArticle() {
				// 关闭当前页  跳转到文章详情
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
	}

	.container {
		position: fixed;
		top: 0;
		padding-top: 20rpx;
		width: 100%;
		height: 70rpx;
		background-color:  white;
		z-index: 999;
		box-shadow: 1px 1px 200px  #f4f4f4;
	}

	.return {
		width: 100%;
		background-color:white;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-left: 15rpx;
			vertical-align: middle;
			float: left;
		}
		view{
			text-align: center;
			padding-right: 55rpx;
		}

	}
</style>
