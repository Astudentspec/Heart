<template>
	<view class="tab_bar">
		<view class="iconfont icon-shipin">
		</view>
		<view class="iconfont icon-miao"></view>
		<view class="iconfont icon-wode">
		</view>
	</view>
</template>

<script>
	export default {
		name: "tabbar",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.tab_bar {
		padding: 10px;
		position: fixed;
		bottom: 0px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: white;
		opacity: 0.8;

		view {
			opacity: 1;
			font-size: 45rpx;
			display: flex;
			flex-direction: column;
			text-align: center;
			flex: 1;
		}
	}
</style>
