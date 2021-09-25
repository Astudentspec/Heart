<template>
	<view class="header">
		<image src="../static/img/search1.jpg" mode=""></image>
		<input disabled=true @click="clickInput()" type="text" placeholder="请输入搜索内容" />
		<image @click="ToWrtie()" src="../static/img/writeIcon.png" mode=""></image>
	</view>
</template>

<script>
	export default {
		name: "indexHeader",
		data() {
			return {
				icon: '\e61d'
			};
		},
		methods: {
			// 点击输入框跳转到搜索
			clickInput() {
				// uni.hideKeyboard();//隐藏软键盘  
				console.log("跳转到search")
				uni.navigateTo({
					url: "/pages/indexsearch/index",
					animationType: "pop-in",
					animationDuration: 1000
				})
			},
			ToWrtie() {
				uni.redirectTo({
					url: '/pages/write/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		background-image: url(../static/img/headerBack.jpg);
		width: 100%;

		padding: 20rpx 0 20rpx 0 ;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;

		input {
			flex: 3;
			border-radius: 25px;
			border: 2px solid #f2debd;
			font-weight: 500;
			height: 35rpx;
			width: 200rpx;
			padding-left: 5px;
			font-size: 22rpx;
			padding: 5px;
			opacity: 1;
			// display: inline-block;
		}

		image {
			// flex: 1;
			border-radius: 25px;
			margin: 5rpx 50rpx 0 50rpx;
			width: 55rpx;
			height: 55rpx;
		}
	}
</style>
