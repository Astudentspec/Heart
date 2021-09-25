<template>
	<view class="commentItem">
		<view class="comment animated bounceIn" v-for="(res, index) in commentList" :key="res.cid">
			<view class="left">
				<image :src="res.upic" mode="aspectFill"></image>
			</view>
			<view class="right">
				<view class="top">
					<view class="">
						{{res.username}}
					</view>
					<view class="like">
						<view class="num">{{ res.likeNum }}</view>
						<u-icon v-if="!res.isLike" name="thumb-up" :size="50" color="#9a9a9a" @click="getLike(res.cid,index)">
						</u-icon>
						<u-icon v-if="res.isLike" name="thumb-up-fill" :size="50" @click="getLike(res.cid,index)"></u-icon>
					</view>

				</view>
				<view class="content">{{ res.content }}</view>
				<view class="reply-box">
					<view class="all-reply" @tap="toAllReply(res)" v-if="res.replyCount != 0 ">
						共{{ res.replyCount }}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view>
				</view>
				<view class="bottom">
					{{ res.createdTime }}
					<view class="reply" @tap="toAllReply(res)">回复</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/api/index.js'
	export default {
		name: "comment",
		data() {
			return {
				
			};
		},
		props: [
			"commentList"
		],
		methods: {
			// 跳转到全部回复
			toAllReply(commentInfo) {
				console.log(commentInfo);
				// 把commmentInfo 存入store
				console.log("点击了跳转");
				this.$store.state.replyCommentInfo = commentInfo
				uni.navigateTo({
					url: '/pages/reply/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},
			// 点赞
			async getLike(id,index) {
				console.log(this.commentList);
				this.commentList[index].isLike = !this.commentList[index].isLike;
				console.log(this.$store.state.user_info);
				const like_obj = {
					likeType: 1,
					uId: this.$store.state.user_info.id,
					objId: id
				}
				if (this.commentList[index].isLike == true) {
					// 请求接口添加赞
					let data = await api.addLike(like_obj)
					if (this.$showToast(data)) {
						this.commentList[index].likeNum++;
					}
				} else {
					let data = await api.deleteLike(like_obj)
					if (this.$showToast(data)) {
						this.commentList[index].likeNum--;
					}
					
					// 请求接口取消赞
				}
				
				
			},
		}
	};
</script>

<style lang="scss" scoped>
	.commentItem {
		padding-bottom: 20px;
	}

	.comment {
		display: flex;
		padding: 30rpx;
		margin: 0 0 0 -30rpx;

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					color: #5677fc;
				}

				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;

					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.highlight {
					color: #5677fc;

					.num {
						color: #5677fc;
					}
				}
			}

			.content {
				margin-bottom: 10rpx;
			}

			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;

				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;

					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}

				.all-reply {
					font-size: 26rpx;
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;

					.more {
						margin-left: 6rpx;
					}
				}
			}

			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
