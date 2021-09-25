<template>
	<view class="content">
		<view class="header">
			<image @click="returnIndex()" src="../../static/img/return.png"></image>
			<input v-model="search_content" confirm-type="search" @confirm="doSearch()" placeholder="请输入搜索内容" />
			<text @click="cancel()">取消</text>
		</view>
		<view class="history" v-if="historyShow">
			<view>搜索历史</view>
			<view>
				<text @click="search_content = item" v-for="item in hisytory">{{ item }}</text>
			</view>
		</view>
		<!-- 搜索结果 -->
		<view v-show="!historyShow" class="search_result">
			<view @click="showArticle(item.artId)" class="item" v-for="item in article_info" :key="item.artId">
				<view class="">
					{{ item.title }}
				</view>

				<view class="">
					<view :class="[item.articlePic == ''?picNone: '']">{{ item.contentText }}</view>
					<image v-if="!item.articlePic == ''" :src="item.articlePic" mode="aspectFill"></image>
				</view>
				<view class="create_time">
					{{ item.createTime }}
				</view>
			</view>
			<!-- 			<view class="item">
				<view class="">
					dsdasd
				</view>

				<view class="">
					<view>asdasdasd</view>
					<image src="https://img2.baidu.com/it/u=1852546487,3301595200&fm=11&fmt=auto&gp=0.jpg" mode=""></image>
				</view>

				<view class="create_time">
					<text>dasds</text>
				</view>
			</view> -->
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 是否显示历史记录
				historyShow: true,
				search_content: "",
				article_info: [],
				hisytory: []
			}
		},

		onShow() {
			this.hisytory = uni.getStorageSync("search_hisory")
		},
		methods: {
			returnIndex() {
				console.log("返回")
				uni.switchTab({
					url: "/pages/index/index",
					animationType: "pop-in",
					animationDuration: 1000
				})
			},
			// 按下回车键触发
			doSearch() {
				uni.showLoading({
					title: '搜索中'
				})
				this.historyShow = false
				var history;
				if (uni.getStorageSync("search_hisory") == "") {
					console.log("未定义");
					history = []
					history.push(this.search_content)
				} else {
					history = uni.getStorageSync("search_hisory")
					if (history.indexOf(this.search_content) == -1) {
						history.push(this.search_content)
					}
				}

				uni.setStorageSync("search_hisory", history)
				console.log(this.search_content);
				this.$request("get", "/article/searchArticle", {
					"search": this.search_content
				}).then(res => {
					uni.hideLoading()
					if (res.state == 200) {
						uni.showToast({
							title: "搜索成功",
							icon: 'none',
							duration: 1000
						})
						this.article_info = res.data
						console.log(this.article_info);
					} else {
						uni.showToast({
							title: "查无此询",
							icon: 'none',
							duration: 1000
						})
					}
				})
			},
			cancel() {
				if (this.historyShow == true) {
					this.returnIndex()
				} else {
					this.search_content = ''
					this.historyShow = !this.historyShow
				}
			},
			showArticle(artId){
				this.$store.state.article_id = artId
				uni.navigateTo({
					url: '../showArticle/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 95.5%;

		padding-top: 60rpx;
		background-color: #f9f3f4;

		.header {

			background-color: #f9f3f4;
			opacity: 0.7;
			width: 100%;
			height: 4.5%;
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;
			margin-bottom: 5rpx;

			input {
				flex: 2;
				border-radius: 25px;
				border: 2px solid #CCCCCC;
				font-weight: 500;
				height: 45rpx;
				padding-left: 5px;
				font-size: 22rpx;
				padding: 5px;
				opacity: 1;
				// display: inline-block;
			}

			image {
				// flex: 1;
				border-radius: 25px;
				margin: 15rpx 30rpx 5rpx 20rpx;
				width: 55rpx;
				height: 55rpx;
			}

			text {
				margin: 15rpx 0 0 10rpx;
			}
		}

		.history {
			width: 100%;
			margin: 30% 0 0 2%;

			view:nth-child(1) {
				width: 100rpx;
				padding: 10rpx;
				border-bottom: 1px solid gray;
				font-size: 25rpx;
			}

			view:nth-child(2) {
				width: 60%;

				text {
					padding: 10px;
					display: inline-block;
					margin: 10rpx 10rpx 0 0;
					background-color: #fdfdfd;
					font-size: 22rpx;
					color: BLACK;
					border-radius: 10px;
					text-align: center;
				}
			}

		}

		.search_result {
			width: 100%;
			height: 94%;
			overflow: scroll-y;
			position: relative;

			.item {
				margin-top: 30rpx;
				background-color: white;
				width: 100%;
				padding: 10px;

				view:nth-child(1) {
					margin-top: 10rpx;
					font-weight: bold;
					width: 95%;
					font-size: 28rpx;
				}

				view:nth-child(2) {
					font-size: 27rpx;
					display: flex;

					view {

						width: 70%;
						height: 80rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。

						-webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
						-webkit-line-clamp: 2; //这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。

					}

					.picNone {
						width: 100%;
						width: 70%;
						height: 80rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。

						-webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
						-webkit-line-clamp: 2; //这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
					}

					image {
						margin-left: 35rpx;
						width: 150rpx;
						height: 150rpx;
						border-radius: 15px;
						vertical-align: top;
						object-fit: scale-down;

					}
				}

				.create_time {
					justify-content: space-between;
					margin-top: -30rpx;
					font-size: 20rpx;
					color: #c8c8c8;
				}
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
</style>
