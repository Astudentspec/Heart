<template>
	<!-- 发表评论 -->
	<view class="pub_comment">
		<textarea  :focus="inputFocus" v-model="pub_comment" @focus="inputFocus = true" @blur="input_blur()"
			 :class="[inputFocus == true ? 'activeInput': '']" type="text" value="" :placeholder="by_reply_username" />
		<text @click="cancel()">取消</text>
		<text @click="publish()">发表</text>
	</view>
</template>

<script>
	import api from "@/api/index.js"
	export default {
		name: "publishComment",
		data() {
			return {
				inputFocus: false,
				pub_comment: '',
				by_reply_username: "请友善回复！"
			}
		},
		props: [
			"comment_type", // 1代表评论 2代表回复 3代表回复的回复
			"art_id", // 文章ID
			"comment_id", // 评论ID
			"reply_id", // 被回复的ID
			"to_r_id",
			"t_id" // 树洞ID 
		],

		methods: {
			publish() {
				uni.showLoading({
					title: '发表中',
					mask: true
				});
				var u_id = uni.getStorageSync("userInfo").id
				var art_id = this.$store.state.article_id
				var that = this
				/**
				 * 判断评论类型
				 * 再判断是对什么进行评论
				 */
				if (this.comment_type == 1) {
					console.log("发表评论");
					var comment = {
						content: this.pub_comment,
						uId: u_id
					}
					
					if (this.t_id != undefined) {
						console.log("发表树洞评论");
						console.log(this.t_id);
						comment.tId = this.t_id
						const result = api.addCommentByTreeId(comment)
						this.$showToast(result)
					} else {
						console.log("发表文章评论");
						comment.artId = art_id
						console.log(comment);
						this.$request('post', "/comment/addComment", comment).then(res => {
							console.log(res);
							if (res.state != 200) {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 1000
								})
							} else {
								uni.showToast({
									title: "评论成功",
									icon: 'none',
									duration: 1000
								})
							}
						})

					}



				} else {
					var param = {
						content: this.pub_comment,
						uId: u_id,
						commentId: this.comment_id
					}
					if (this.comment_type == 3) {
						param.toRId = parseInt(this.to_r_id)
					}
					console.log("要进行的操作是回复" + this.art_id + "文章" + "评论ID为:" + this.comment_id);

					this.$request('post', '/reply/addReply', param).then(res => {
						if (res.state != 200) {
							that.showToast(res.msg)
						}
					})
				}
				setTimeout(() => {
					this.$emit("shuaxin") // 调用父组件的方法


					this.pub_comment = ''
					this.inputFocus = false
					uni.hideLoading()
				}, 1000)

			},
			input_blur() {
				if (this.pub_comment == '') {
					this.inputFocus = false
				}
			},
			showToast(title) {
				uni.showToast({
					title: title,
					icon: 'none',
					duration: 1000
				})
			},
			cancel() {
				this.pub_comment = ''
				this.inputFocus = false
				if (this.comment_type == 3) {
					this.comment_type = 2 // 类型变回回复评论
				}
				this.by_reply_username = '请友善评论！'
				
			}
		}

	}
</script>

<style lang="scss" scoped>
	.pub_comment {
		width: 100%;
		padding-bottom: 50rpx;
		position: fixed;
		bottom: 0;
		padding: 5px;
		display: flex;
		background-color: white;
		justify-content: space-between;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;

		textarea {
			flex: 5;
			height: 60rpx;
			flex-wrap: wrap;
			transition: height 1s;
		}

		.activeInput {
			height: 200rpx;
		}

		text {
			margin-top: 2px;
			text-align: center;
			flex: 1;
			font-size: 26rpx;
			color: black;
			padding: 5rpx;
			display: inline-block;
			margin-right: 25rpx;
		}
	}
</style>
