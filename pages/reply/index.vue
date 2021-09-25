<template>
	<view class="wrap">
		<returnOperate :content="returnContent"></returnOperate>
		<!-- 被回复的评论 -->
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo">
						<image :src="comment.upic" mode=""></image>
					</view>
					<view class="user-info">
						<view class="name">{{ comment.username }}</view>
						<view class="date">{{ comment.createdTime }}</view>
					</view>
				</view>
			</view>
			<view class="content">{{ comment.content }}</view>
		</view>
		<!-- 全部的回复 -->
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.replyCount }}）</view>
			<view class="item animated bounceIn" hover-class="itemHover" hover-stay-time="1000"
				v-for="(item, index) in replyList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo">
								<image v-if="item.toRId == 0 " :src="item.upic" mode=""></image>
								<image v-if="item.toRId != 0 " :src="item.replyUpic" mode=""></image>

							</view>
							<view class="user-info">
								<view class="name">{{ item.toRId == 0 ? item.username: item.replyUsername }}</view>
								<view class="date">{{ item.createdTime }}</view>
							</view>
						</view>

						<!-- 点赞 -->
						<view class="right">
							<view class="num">{{ item.likeNum }}</view>
							<u-icon v-if="!item.isLike" name="thumb-up" class="like" :size="50" color="#9a9a9a"
								@click="getLike(item.rid,index)"></u-icon>
							<u-icon v-if="item.isLike" name="thumb-up-fill" class="like" :size="50"
								@click="getLike(item.rid,index)"></u-icon>
						</view>

					</view>
					<view class="reply" v-if="item.toRId != 0 ">
						<view class="username">{{ item.byreplyUsername }}</view>
						<view class="text">{{ item.byreplyContent }}</view>
					</view>
					<view class="content">{{ item.toRId == 0 ? item.content: item.replyContent }}</view>
				</view>
				<view class="replyFont" @click="replyToreply(item.username,item.rid,item.replyReplyId)">回复</view>
			</view>
		</view>

		<!-- 发表评论组件 -->
		<publishComment ref="publishComment" v-on:shuaxin="getReply()" :to_r_id="to_r_id" :comment_type="type"
			:art_id="art_id" :comment_id="c_id"></publishComment>
	</view>
</template>

<script>
	import returnOperate from "../../components/returnOperate.vue"
	import publishComment from "../../components/publishComment.vue"
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				replyList: [],
				comment: {},
				returnContent: '回复',
				art_id: 0,
				c_id: 0,
				type: 2,
				to_r_id: 0,
				userInfo: {}
			};
		},
		onLoad() {

			this.userInfo = uni.getStorageSync("userInfo")
			this.getReply()
		},
		onShow() {
			// 获取当前文章ID
			var art_id = this.$store.state.article_id
			this.art_id = art_id
			// 获取当前评论ID
		},
		components: {
			returnOperate,
			publishComment
		},
		methods: {
			// 回复列表
			getReply() {
				console.log("调用了父组件Reply方法");

				var commentInfo = this.$store.state.replyCommentInfo
				console.log(commentInfo);
				this.comment = commentInfo
				this.c_id = commentInfo.cid
				console.log(this.userInfo.id);
				this.$request('get', '/reply/replys/' + this.c_id + "/" + this.userInfo.id).then(res => {

					var compare_after = res.data.sort(this.$compare("createdTime")) // 对拿到的数据进行时间排序 降序执行

					if (res.state == 200) {
						for (var index in compare_after) {
							compare_after[index].createdTime = this.$dateFormat(compare_after[index].createdTime)
						}
						this.replyList = compare_after
						console.log("下面是replyList");
						console.log(this.replyList);
					}

				})
			},
			// 点击了回复
			replyToreply(username, rid, replyRid) {

				if (rid != undefined) {
					console.log("点击了:" + rid);
					this.to_r_id = rid
					this.type = 3
					this.$refs.publishComment.inputFocus = true
				} else {
					console.log("点击了:" + replyRid);
					this.to_r_id = replyRid
					this.type = 3
					this.$refs.publishComment.inputFocus = true
				}
				this.$refs.publishComment.by_reply_username = "您将回复 > " + username
			},

			// 点赞
			async getLike(id, index) {
				console.log("id: " + id + " 索引: " + index);
				this.replyList[index].isLike = !this.replyList[index].isLike;

				const like_obj = {
					likeType: 3,
					uId: this.userInfo.id,
					objId: id
				}

				if (this.replyList[index].isLike == true) {
				
					// 调用接口对回复进行赞
					let data = await api.addLike(like_obj)
					if (this.$showToast(data)) {
						this.replyList[index].likeNum++;
					}
				} else {
			
					// 调用接口对回复取消赞
					let data = await api.deleteLike(like_obj)
					if (this.$showToast(data)) {
						this.replyList[index].likeNum--;
					}
				}

			},

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}

	.wrap {
		padding: 120rpx 0 100rpx 0;
	}

	.comment {
		padding: 30rpx;
		font-size: 32rpx;
		background-color: #ffffff;

		.top {
			display: flex;
			justify-content: space-between;
		}

		.left {
			display: flex;

			.heart-photo {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.user-info {
				margin-left: 10rpx;

				.name {
					color: #5677fc;
					font-size: 28rpx;
					margin-bottom: 4rpx;
				}

				.date {
					font-size: 20rpx;
					color: $u-light-color;
				}
			}
		}

		.right {
			display: flex;
			font-size: 20rpx;
			align-items: center;
			color: #9a9a9a;

			.like {
				margin-left: 6rpx;
			}

			.num {
				font-size: 26rpx;
				color: #9a9a9a;
			}
		}

		.highlight {
			color: #5677fc;

			.num {
				color: #5677fc;
			}
		}
	}

	.all-reply {
		margin-top: 10rpx;
		padding-top: 20rpx;
		background-color: #ffffff;

		.all-reply-top {
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: solid 4rpx #5677fc;
			font-size: 30rpx;
			font-weight: bold;
		}

		.item {
			border-bottom: solid 2rpx $u-border-color;

			.replyFont {
				color: #5677fc;
				font-size: 18rpx;
				width: 96%;
				text-align: right;

			}
		}

		.reply {
			padding: 20rpx;
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			margin: 10rpx 0;

			.username {
				font-size: 24rpx;
				color: #7a7a7a;
			}
		}
	}
</style>
