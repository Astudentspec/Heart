<template>
	<view id="indexNav">

		<!-- <u-tabs-swiper ref="tabs" :list="list" :is-scroll="false"></u-tabs-swiper> -->
	</view>
</template>

<script>
	export default {
		name: "indexNav",
		data() {
			return {
				list: [{
					name: '待收货'
				}, {
					name: '待付款'
				}, {
					name: '待评价',
					count: 5
				}]
			};
		}
	}
</script>

<style lang="scss" scoped>

</style>
