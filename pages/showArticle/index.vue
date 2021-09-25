<template>
	<view class="content">
		<returnOperate :content="returnContent"></returnOperate>
		<view class="bottom">
			<view class="title">{{ articleDetailInfo.title }}</view>
			<view class="user_info">
				<image @click="showInfo"
					:src="articleDetailInfo.isPublic == 1 ? articleDetailInfo.upic : 'https://img2.baidu.com/it/u=2860640912,1833965317&fm=26&fmt=auto&gp=0.jpg'"
					mode="aspectFill"></image>
				<text>{{ articleDetailInfo.isPublic == 1 ? articleDetailInfo.username : '匿名用户' }}</text>
			</view>
			<u-parse :html="articleDetailInfo.content"></u-parse>
			<view class="buttom">
				发布于: {{ dateShow }}
			</view>
			<!-- 评论 -->
			<view v-if="commentList.length != 0 " class="comment_font animated rotateInDownLeft">
				评论区:
			</view>
			<comment :commentList="commentList"></comment>

		</view>
		
		<!-- 弹出用户的信息和私信的按钮 -->
		<u-popup  v-model="userInfoShow" mode="bottom">
			<view class="popup">
				<image :src="articleDetailInfo.upic" mode=""></image>
				<text>{{ articleDetailInfo.username }}</text>
				<text @click="clickLetter(articleDetailInfo.uid)">私信</text>
			</view>
		</u-popup>
		
		<!-- 发表评论 -->
		<publishComment :comment_type="type" v-on:shuaxin="getComments()"></publishComment>
		
	
	</view>
</template>

<script>
	import comment from '../../components/comment.vue'
	import returnOperate from "../../components/returnOperate.vue"
	import publishComment from "../../components/publishComment.vue"
	export default {
		data() {
			return {
				articleDetailInfo: {},
				dateShow: '',
				// 评论列表
				commentList: [],
				returnContent: '日记详情',
				inputFocus: false,
				type: 1,
				art_id: 0,
				userInfoShow:false,
				userInfo: {}
			}
		},
		components: {
			comment,
			returnOperate,
			publishComment
		},
		onShow() {
			console.log("加载.....");
			var art_id = this.$store.state.article_id
			this.userInfo = uni.getStorageSync("userInfo")
			this.art_id = art_id
			this.getArticleDetail(art_id)
			this.getComments(art_id)
		},
		methods: {
			// 获取文章详情
			getArticleDetail(art_id) {
				this.$request('get', '/article/articleDetails', {
					"artId": art_id
				}).then(res => {
					if (res.state != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 1000
						})
					} else {
						this.articleDetailInfo = res.data
						var date = this.$dateFormat(res.data.createTime)
						this.dateShow = date
					}
				})
			},

			returnIndex() {
				uni.switchTab({
					url: '../index/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},
			// 获取评论
			getComments() {

				// 获取评论列表
				this.$request("get", "/comment/comments/" + this.art_id + "/" + this.userInfo.id).then(res => {
					this.commentList = []
					var compare_after = res.data.sort(this.$compare("createdTime")) // 对拿到的数据进行时间排序 降序执行
					for (var index in compare_after) {
						console.log(index);
						if (compare_after[index] == []) {
							console.log("评论为空");
							return
						} else {
							compare_after[index].createdTime = this.$dateFormat(compare_after[index].createdTime)
						}
					}
					this.commentList = compare_after
					console.log(this.commentList);
				})
			},
			input_blur() {
				if (this.pub_comment == '') {
					this.inputFocus = false
				}
			},
			// 点击头像弹出个人信息
			showInfo() {
				console.log(this.articleDetailInfo);
				this.userInfoShow = true
			},
			// 点击了私信
			clickLetter(id){
				let is_exist = false
				// 把当前聊天的目标用户切换为当前要私信的用户
				this.$store.state.targetUserId = id
				// 拿着此用户ID在letters查询有没有跟该用户的聊天记录 有的话就直接跳转到聊天 没有就创建一个新对话然后放到letters
				this.$store.state.letters.forEach(item => {
					if (item.fromId == id) {
						console.log("已存在");
						return is_exist = true
					}
				})
				// 如果不存在就创建
				if (!is_exist) {
					const letterObj = {
						fromId: id + "",
						fromUserPic: this.articleDetailInfo.upic,
						fromUsername: this.articleDetailInfo.username,
						msg: "",
						toId: this.userInfo.id,
						value: []
					}
					console.log(letterObj);
					this.$store.state.letters.unshift(letterObj)
				}
				
				uni.navigateTo({
					url: "../letter/show/show",
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},
			

		}
	}
</script>

<style lang="scss" scoped>
	.content {

		.bottom {
			background-color: white;
			padding: 15% 4% 70rpx 4%;



			.title {
				font-weight: bold;
				font-size: 35rpx;
			}

			.buttom {
				font-size: 25rpx;
				color: gray;
			}

			view {
				width: 100%;
				margin-top: 50rpx;
			}

			.user_info {
				image {
					width: 60rpx;
					height: 60rpx;
					vertical-align: middle;
					margin-right: 10rpx;
					border-radius: 50%;
				}
			}


		}

	}
	
	.popup{
		display: flex;
		padding: 10px;
		width: 100%;
		image{
			width: 50rpx;
			height: 50rpx;
			vertical-align: middle;
		}
		
		text{
			margin-left: 30rpx;
		}
		text:nth-child(3){
			text-align: center;
			width: 90rpx;
			padding: 5px;
			border: 1px solid black;
			border-radius: 25px;
			position: absolute;
			right: 30rpx;
			margin-top: -10rpx;
		}
	}
</style>
