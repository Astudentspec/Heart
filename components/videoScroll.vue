<template>
	<view class="vidwoScroll">
		
	</view>
</template>

<script>
	export default {
		name: "videoScroll",
		data() {
			return {
				
			}
		},
		components: {
			indexHeader
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.vidwoScroll {
		width: 100%;
		height: 100%;
		z-index: -1;

		.big_swiper {
			width: 100%;
			height: 100%;

			.swiper-item {
				width: 100%;
				height: 100%;
			}

			.s_x {
				width: 100%;
				height: 100%;

				.swiper-item {
					width: 100%;
					height: 100%;
					
				}
			}
		}
	}
</style>
