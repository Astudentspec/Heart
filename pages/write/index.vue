<template>
	<view class="content">
		<view class="container">
			<image @click="toindex()" src="../../static/img/shutdown.png"></image>
			<input @focus="ChangeInputClass()" @blur="ChangeInputClass()"
				:class="[titleClassChange === true?'titleafter':'titleBefore']" placeholder="请输入标题..."
				v-model="form.title" class="title" />
			<jinEdit :html="content" placeholder="请输入内容" @editOk="editOk" :uploadFileUrl="url" fileKeyName="file">
			</jinEdit>
		</view>
	</view>
</template>

<script>
	import jinEdit from "../../components/jin-edit/jin-edit.vue"

	export default {
		data() {
			return {
				url: 'http://yaolovelive.com:8081/upload',
				form: {
					title: ''
				},
				content: '',
				titleClassChange: false,
				// 判断是否为编辑状态
				art_id: 0
			}
		},
		components: {
			jinEdit
		},
		onShow() {
			var art_id = this.$store.state.activeArt_id
			this.art_id = art_id
			console.log("art_id: " + art_id);
			if (this.art_id != 0) {
				// 根据文章ID查询文章 并把值填入写入区里面
				this.$request('get', '/article/findArticle', {
					"artId": this.art_id
				}).then(res => {
					if (res.state != 200) {
						uni.showToast({
							title: '获取文章失败',
							icon: 'none',
							duration: 1000
						})
					} else {
						console.log(res);
						this.form.title = res.data.title
						this.content = res.data.content
						console.log(this.content);
					}
				})
			}
		},
		methods: {
			editOk(res) {


				if (this.form.title.trim() == '' || res.text.trim() == '') {
					return uni.showToast({
						icon: 'none',
						title: '标题或内容不能为空',
						duration: 1000
					})
				}

				if (res.delta.ops.length < 2) {
					this.showToast("请选择一张图片")
					return
				}

				if (this.art_id == 0) {
					console.log(res.html);
					var u_id = uni.getStorageSync('userInfo').id
					console.log(u_id);
					var article = {
						'title': this.form.title,
						'content': res.html,
						'contentText': res.text,
						'authorId': u_id,
						'isPublic': res.isPublic == true ? 1 : 0
					}
					this.$request('post', '/article/articleWrite', article).then(res => {
						if (res.state != 200) {
							uni.showToast({
								title: res.msg,
								duration: 1000
							})
						} else {
							var article = res.data
							article.articlePic = uni.getStorageSync("articleImagePath")
							this.$request('post', "/article/updateArticle", article).then(res => {
								if (res.state != 200) {
									uni.showToast({
										title: '插入失败',
										duration: 1000
									})
								} else {
									uni.showToast({
										title: res.msg,
										duration: 1000
									})
									setTimeout(() => {
										this.toindex()
									}, 1000)
								}
							})
							uni.setStorageSync("articleImagePath","")
						}
					})
				} else {
					console.log("编辑模式");
					// 修改
					var article = {
						"title": this.form.title,
						"content": res.html,
						"contentText": res.text,
						"artId": this.art_id
					}
					if (uni.getStorageSync("articleImagePath") != ''){
						article.articlePic = uni.getStorageSync("articleImagePath")
					}
					console.log(article);
					this.$request('post','/article/updateArticle',article).then(res => {
						if(res.state != 200){
							this.showToast("修改失败")
						}else{
							this.showToast("修改成功")
							setTimeout(() => {
								uni.switchTab({
									url: '../my/index',
									animationType: 'pop-in',
									animationDuration: 1000
								})
							},1000)
							// 将图片缓存清空
							uni.setStorageSync('articleImagePath', '')
							this.art_id = 0
							this.$store.state.activeArt_id = 0
						}
					})

				}

			},
			replacAll(str) {
				console.log("str:" + str);
				var result = ""
				for (let i = 0; i < str.length; i++) {
					console.log(str[i]);
					var char = ''
					if (str[i] == " ") {
						char = "&nbsp;"
					} else {
						char = str[i]
					}
					result = result + char
				}

				console.log(result);
				return result
			},
			ChangeInputClass() {
				this.titleClassChange = !this.titleClassChange
			},
			toindex() {
				this.art_id = 0
				this.$store.state.activeArt_id = 0
				uni.switchTab({
					url: '../index/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},
			showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 1000
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
		height: 90%;
		padding-top: 10%;

		.container {
			width: 100%;
			height: 95%;
			// border: 1px solid red;
			overflow: scroll;
			box-shadow: 10px 5px 30px gray;

			image {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 50rpx;
				margin-left: 20rpx;
			}


			.title {
				font-weight: bold;
				width: 96%;
				padding-bottom: 10px;
				padding-left: 4%;
				color: #d6d6d6;
				border-bottom: 1px solid #000000;
			}

			.titleafter {
				font-weight: bold;
				width: 96%;
				padding-bottom: 10px;
				padding-left: 4%;
				border-bottom: 3px solid #0000fa;
			}
		}


	}
</style>
