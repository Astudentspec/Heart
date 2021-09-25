<template>
	<view class="tree_show">
		<returnOperate :content="return_content"></returnOperate>

		<!-- 展示树洞的部分 -->
		<swiper previous-margin="50px" next-margin="50px" :current="current" @change="change" :circular="true"
			:interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in list" :key="index">
				<view :class="current == index ? 'swiper_item_active ' : '' ">
					<view class="title">~ {{ item.title }} ~</view>
					<u-parse class="content" :html="item.content"></u-parse>

				</view>
				<image @tap="showComment(item.tid)" :class="[index == current ? 'commentIcon-active' : '']"
					src="../../static/img/commentIcon.png" mode=""></image>
			</swiper-item>
		</swiper>

		<!-- 刷新 -->
		<view class="flush">
			<image :class="[rotate == true ? 'img-rotate' : '' ]" @click="flush" src="../../static/img/flush.png"
				mode=""></image>
			换一组
		</view>

		<!-- 弹出层评论 -->
		<u-popup v-model="popupShow" mode="bottom" class="popupComment">
			<view class="down">
				<image @tap="popupShow = false" src="../../static/img/down.png" mode=""></image>
				<view v-if="commentList.length == 0 ? true : false ">暂无评论</view>
			</view>

			<scroll-view class="commentList" scroll-y="true">
				<comment :commentList="commentList"></comment>
			</scroll-view>
			<publishComment comment_type="1" :t_id="tid" v-on:shuaxin="getComments()"></publishComment>
		</u-popup>

	</view>
</template>

<script>
	import returnOperate from '@/components/returnOperate.vue'
	import api from "@/api/index.js"
	import comment from "@/components/comment.vue"
	import publishComment from "@/components/publishComment.vue"
	export default {
		data() {
			return {
				return_content: '树洞详情',
				current: 0,
				page: 1,
				pageSize: 100,
				rotate: false,
				list: [],
				popupShow: false,
				tid: -1,
				commentList: []
			}
		},
		components: {
			returnOperate,
			comment,
			publishComment
		},
		onLoad() {
			this.findTreeHole()
		},
		methods: {
			change(e) {
				console.log(this.popupShow);
				this.current = e.detail.current
				console.log(e);
			},
			/**
			 * 刷新 
			 * 设置rotate为true
			 * 获取数据后设置rotate为false
			 */
			flush() {
				console.log("刷新");
				this.rotate = true

				setTimeout(() => {
					this.rotate = false
				}, 1000)
				this.findTreeHole()
			},
			// 分页查询树洞
			async findTreeHole() {
				var data = {
					page: this.page,
					pageSize: this.pageSize,
					uId: uni.getStorageSync("userInfo").id
				}
				console.log(data);
				const res = await api.findTreeHole(data)
				console.log(res);
				if (this.$showToast(res)) {
					this.list = res.data
					this.page = this.page + 1 // 查询一次加一页
				}
			},
			showComment(id) {
				console.log("当前点击的是: " + id);
				this.tid = id
				this.popupShow = true
				this.getComments()

			},

			async getComments() {
				/**
				 * 根据ID查询评论
				 */
				console.log(this.tid);
				const result = await api.findCommentByTid(this.tid);
				console.log(result.data);
				if (this.$showToast(result)) {
					this.commentList = result.data
				} else {
					this.commentList = []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 11%;
	}

	.tree_show {
		padding-top: 15%;
		height: 92.9%;
		background-image: url(../../static/img/treeHoleBack.jpg);
		background-size: cover;
	}



	.popupComment {

		.commentList {
			max-height: 600rpx;
			padding: 10rpx 0 60rpx 5rpx;
		}

		.down {
			text-align: center;
			margin-bottom: 30rpx;
			image {
				width: 60rpx;
				height: 50rpx;
			}
		}

	}




	swiper {
		margin-top: 60rpx;
		height: 600rpx;

		swiper-item {
			height: 300rpx;

			&>view {
				padding: 10px;
				position: relative;
				top: 30rpx;
				width: 90%;
				height: 80%;
				background-color: rgba(183, 241, 204, 0.4);
				transition: top 0.5s linear, height 0.5s linear;

				.title {
					text-align: center;
				}

				.content {
					margin-top: 30rpx;
					margin-bottom: 50px;
					height: 78%;
					overflow: auto;
				}

			}

			image {
				width: 30rpx;
				height: 30rpx;
				position: absolute;
				right: 30rpx;
				bottom: 55rpx;
				transition: all 1s linear;
			}
		}
	}

	.flush {
		margin-top: 20rpx;
		text-align: center;

		image {
			width: 60rpx;
			height: 60rpx;
			vertical-align: middle;
			margin-right: 10rpx;
		}

		.img-rotate {
			transform: rotate(720deg);
			transition: all 0.5s linear;
		}
	}

	.swiper_item_active {
		height: 90%;
		top: 0;
		background-color: rgba(183, 241, 204, 0.5);
		backdrop-filter: blur(20px);
		transition: top 0.5s linear, height 0.5s linear;
	}

	.commentIcon-active {
		color: black;
		width: 40rpx;
		height: 40rpx;
		bottom: 30rpx;
	}
</style>
