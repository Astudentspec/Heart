<template>
	<view class="content" >
		<view v-show="my_globa_show" class="header animated bounceIn" :style="headerStyle">
			<image :style="headerImageAndTextStyle" :src="userInfo.upic === undefined  ? '../../static/img/notLogin.gif' :userInfo.upic " mode="">
			</image>
			<text :style="headerImageAndTextStyle"  class="user_name">{{ userInfo.username }}</text>
			<view @click="clickEdit()">设置</view>
		</view>
		<view class="blur">

			<view class="bottom">
				<image v-show="my_globa_show" class="animated bounceIn"
					:src="userInfo.upic === undefined  ? '../../static/img/notLogin.gif' :userInfo.upic "
					mode="aspectFill">
				</image>
				<view v-show="my_globa_show" class="user_name animated bounceInLeft">
					{{ userInfo.username === undefined ? '未登录' : userInfo.username }}
				</view>
				<view v-show="my_globa_show" class="animated bounceInLeft">日记 · {{ dinary_count }}条</view>
				<view v-show="my_globa_show" class="animated bounceInLeft">树洞 · {{ tree_hole_count }}条</view>

				<!-- 日记内容区 8/11 改造成swiper -->
				<view class="explain">日记</view>
				<swiper previous-margin="100rpx" next-margin="100rpx" :circular="true" @change="dinaryChange">
					<swiper-item v-for="(item,index) in articleInfo.data" :key="item.artId">

						<view v-show="my_globa_show" class="sub_diray">
							<image mode="aspectFill" :src="item.articlePic"></image>
							<view class="title">{{ item.title }}</view>
							<view :class="activeArtId == item.artId ? 'clickDetail': 'notClick' "
								@click="showOperate(item.artId)">
								<view v-show="activeArtId == item.artId" class="operate animated bounceInDown">
									<image @click="operate(1)" src="../../static/img/bianji.png"></image>
									<image @click="operate(2)" src="../../static/img/delete.png"></image>
									<image @click="operate(3)" src="../../static/img/lookArticle.png"></image>
								</view>
							</view>
						</view>


					</swiper-item>

				</swiper>

				<!-- 添加显示个人树洞区 -->
				<view class="explain">树洞</view>
				<swiper class="treeswiper" previous-margin="100rpx" @change="treeHoleChange" next-margin="100rpx"
					:circular="true">
					<swiper-item class="swiper-item" v-for="(item,index) in treeHoles" :key="item.t_id">

						<view v-show="my_globa_show" class="tree_hole animated bounceIn"
							:class="[index == tree_hole_current ? 'swiper_item_active tree_hole': 'tree_hole']">
							<view class="title">{{ item.title }}</view>
							<u-parse class="tree_content" :html="item.content"></u-parse>
							<image v-if="index == tree_hole_current" @tap="showComment(item.tid)"
								src="../../static/img/commentIcon.png"></image>
						</view>


					</swiper-item>

				</swiper>



				<u-modal @confirm="toOperate()" :mask-close-able="true" v-model="modalShow" :content="operateInfo">
				</u-modal>

			</view>



			<u-toast ref="uToast" />
			<image v-if="notfoundImageShow" class="notFound" src="../../static/img/notFoundAticle.jpg"></image>
		</view>


		<!-- 弹出评论 -->
		<u-popup v-model="popupShow" mode="bottom" class="popupComment">
			<view class="down">
				<image @tap="popupShow = false" src="../../static/img/down.png" mode=""></image>
				<view v-if="commentList.length == 0 ? true : false ">暂无评论</view>
			</view>

			<view class="comment_content">
				<comment :commentList="commentList"></comment>

			</view>
		</u-popup>


	</view>
</template>

<script>
	import api from '@/api/index.js'
	import comment from "@/components/comment.vue"
	export default {
		data() {
			return {
				/**
				 * dinary_count 日记条数
				 * tree_hole_count 树洞条数
				 * showEdit 设置框显示
				 * tree_hole_current 树洞的滑块
				 * dinary_current 日记滑块
				 */
				userInfo: {},
				editForm: {},
				articleInfo: [],
				dinary_count: 0,
				tree_hole_count: 0,
				notfoundImageShow: false,
				my_globa_show: true,
				activeArtId: 0,
				modalShow: false,
				operateInfo: '',
				operate_type: 0,
				treeHoles: [],
				tree_hole_current: 0,
				dinary_current: 0,
				popupShow: false,
				commentList: [],
				action: '/user/uploadUserPic',
				fileList: [],
				form_data: {},
				// 页面滚动距离
				headerTransilete: false
			}
		},
		onShow() {
			this.action = this.$base_url + this.action
			console.log(this.action);
			this.showEdit = false
			this.my_globa_show = true
			this.userInfo = uni.getStorageSync("userInfo")
			console.log(this.userInfo);
			this.getArticle()
			this.getTreeHoleCount()
			this.getTreeHole()

		},
		// 当前页面隐藏
		onHide() {
			console.log("my页面隐藏:");
			this.my_globa_show = false
		},
		components: {
			comment
		},
		computed: {
			headerStyle(){
				if (this.headerTransilete){
					return "background: rgba(89, 98, 91, " + 0.7 + ");"
				}else{
					return "background: rgba(89, 98, 91, " + 0.1 + ");"
				}
			},
			headerImageAndTextStyle(){
				console.log(this.scrollTop);
				if (this.headerTransilete){
					return "transform: translateY(0px);"
				}else{
					return "transform: translateY(-40px);"
				}
			}
		},
		methods: {
			shutLogin() {
				var title = ''
				if (uni.getStorageSync("userInfo") == '') {
					title = '前往登录...'
				} else {
					title = '正在退出...'
				}
				uni.setStorageSync("token", "")
				uni.setStorageSync("userInfo", "")
				uni.reLaunch({
					url: '../login/index',
					animationType: 'pop-in',
					duration: 1000
				})
				this.articleInfo = []
				this.count = 0
			},
			// 请求日记函数
			getArticle() {
				// 加载用户写的日记
				console.log("调用了article方法");
				var that = this
				var id = 0
				if (this.userInfo != '') {
					id = this.userInfo.id
				}
				this.$request('get', "/article/findArticleByAuthorId", {
					"id": id
				}).then(res => {

					if (res.state == 200) {
						that.notfoundImageShow = false
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
						console.log(res.data)
						that.articleInfo = res.data
						that.dinary_count = res.data.articleCount
					}


				}).catch(error => {
					if (error != null) {
						console.log(error);
						console.log("获取文章失败");
					}

				})
			},

			showOperate(art_id) {
				console.log("art_id:" + art_id);
				if (this.activeArtId != 0) {
					// 说明是激活状态
					this.activeArtId = 0
				} else {
					this.activeArtId = art_id
					console.log("展示操作时获取的文章ID:" + this.activeArtId);
				}

			},
			// 操作
			operate(operate_num) {

				if (operate_num == 1) {
					console.log("编辑");
					this.operate_type = operate_num
					this.operateInfo = '您确定要编辑吗?'
					this.modalShow = true
					this.$store.state.activeArt_id = this.activeArtId
				} else if (operate_num == 2) {
					this.operate_type = operate_num
					console.log("删除");
					this.operateInfo = '您确定要删除吗?'
					this.modalShow = true
					this.$store.state.activeArt_id = this.activeArtId
				} else {
					this.$store.state.article_id = this.activeArtId
					uni.navigateTo({
						url: '../showArticle/index',
						animationType: 'pop-in',
						animationDuration: 1000
					})
				}


			},
			toOperate() {
				console.log("点击了模态框:" + this.activeArtId)
				if (this.operate_type == 1) {
					uni.showLoading({
						title: "正在前往...."
					})
					setTimeout(() => {
						uni.hideLoading()
						// 把当前正在操作的文章ID 传给全局变量
						uni.navigateTo({
							url: '../write/index',
							animationType: 'pop-in',
							animationDuration: 1000
						})
					}, 1000)
					console.log("前往编辑...");
				} else {
					console.log("删除");
					this.$request('post', '/article/deleteArtcle', {
						"artId": this.$store.state.activeArt_id
					}).then(res => {
						if (res.state != 200) {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 1000
							})
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 1000
							})
							setTimeout(() => {
								this.getArticle()
							}, 500)

						}
					})
				}
			},
			/**
			 * 获取树洞数量
			 */
			async getTreeHoleCount() {
				const result = await api.findTreeHoleCountByUid(this.userInfo.id)
				if (this.$showToast(result)) {
					this.tree_hole_count = result.data
				}
			},
			async getTreeHole() {
				const result = await api.findTreeHoleInfoByUid(this.userInfo.id)
				console.log(result);
				if (this.$showToast(result)) {
					this.treeHoles = result.data
					this.dataIsEmpty()
				}
			},
			treeHoleChange(e) {
				this.headerTransilete = true
				this.tree_hole_current = e.detail.current
				console.log(this.tree_hole_current);
			},
			dinaryChange(e) {
				this.headerTransilete = true
				console.log(e);
				this.dinary_current = e.detail.current
				console.log(this.dinary_current);
			},
			/**
			 * 判断是否存在 树洞和日记
			 */
			dataIsEmpty() {
				console.log("日记的长度:  " + this.articleInfo.length);
				console.log("树洞的长度:  " + this.treeHoles.length);
				if (this.articleInfo.length == 0 && this.treeHoles.length == 0) {
					console.log("都没有");
					this.notfoundImageShow = true
				}
			},
			showComment(id) {
				console.log("当前点击的是: " + id);
				this.tid = id
				this.popupShow = true
				this.getComments(id)

			},
			async getComments(id) {
				/**
				 * 根据ID查询评论
				 */
				console.log(id);
				const result = await api.findCommentByTid(id);
				console.log(result.data);
				if (this.$showToast(result)) {
					this.commentList = result.data
				} else {
					this.commentList = []
				}
			},
			// 点击设置去往设置页面
			clickEdit(){
				uni.navigateTo({
					url: "./editor/editor",
					animationType: "slide-in-left",
					animationDuration: 1000
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		text-align: center;
		background-image: url(../../static/img/my_back.jpg);

		.notFound {
			width: 500rpx;
			height: 500rpx;
			position: fixed;
			top: 40%;
			right: 16%;
			border-radius: 15px;
		}

		.blur {
			padding-top: 10%;
			width: 100%;
			height: 95%;
			background-color: rgba(255, 255, 255, 0.5);



		}



		.modal {
			width: 80%;
			height: 500rpx;
			padding: 10px;
			margin-left: 10%;
			border-radius: 25px;
			box-shadow: 10px 10px 5px #888888;
			position: fixed;
			top: 30%;
			background-color: white;
		}

		.header {
			z-index: 99;
			position: fixed;
			top: 0;
			width: 100%;
			padding: 50px 0 20px 0;
			text-align: center;
			background: rgba(89, 98, 91, 0.1);
			backdrop-filter: blur(5px);
			transition: all 2s linear;

			view {
				width: 120rpx;
				height: 35rpx;
				border: 1px solid black;
				border-radius: 25px;
				font-size: 30rpx;
				float: right;
				margin: 10rpx 15rpx 0 0;
				padding-bottom: 3px;
				text-align: center;
				
			}

			image {
				border-radius: 50%;
				width: 50rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-left: 40px;
				transform: translateY(-40px);
				transition: all 2s linear;
			}

			text {
				color: white;
				display: inline-block;
				margin-left: 30rpx;
				transform: translateY(-40px);
				transition: all 2s linear;
			}
		}

		.bottom {
			width: 100%;
			padding-bottom: 60px;
			overflow: scroll;

			image {
				width: 200rpx;
				height: 200rpx;
			}


			image:nth-child(1) {
				margin-top: 10px;
				border-radius: 50%;
			}

			view:nth-child(2) {
				color: white;
			}

			view:nth-child(3) {
				color: black;
				margin-bottom: 30px;
			}

			.sub_diray {
				text-align: left;
				width: 80%;
				padding: 10px;
				margin: 35rpx auto;
				background: rgba(247, 246, 248, 0.6);
				backdrop-filter: blur(5px);
				border-radius: 15px;
				display: flex;
				justify-content: space-between;
				transition: all 1s linear;

				.title {
					font-size: 27rpx;
					font-weight: bold;
					width: 200rpx;
					height: 80rpx;
					overflow: scroll;
					color: #070707;
					margin-top: 40rpx;
				}

				image:nth-child(1) {
					width: 120rpx;
					height: 100rpx;
					border-radius: 15px;
					vertical-align: middle;
				}

				view:nth-child(3) {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					// image{
					// 	width: 50rpx;
					// 	height: 50rpx;
					// }
				}


				.operate {
					margin: 50rpx 0 0 -50rpx;
					width: 150rpx;
					display: flex;

					.tree_hole_look {
						margin-left: 60rpx;
					}

					image {
						width: 40rpx;
						height: 40rpx;
						margin-left: 10rpx;
					}

					image:nth-child(2),
					image:nth-child(3) {
						margin-top: 20rpx;
					}

				}

				.notClick {
					background-color: #FF8850;
				}

				.clickDetail {
					background-color: #99DE9F;
				}


			}


		}

		.explain {
			margin-top: 30rpx;
		}

		.treeswiper {
			height: 550rpx;
		}

		.tree_hole {
			text-align: center;
			width: 80%;
			height: 480rpx;
			padding: 10px;
			margin: 35rpx auto;
			background-color: rgba(208, 138, 138, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 15px;
			transition: all 1s linear;

			view {
				margin-bottom: 30rpx;
			}

			.tree_content {
				text-align: left;
				height: 350rpx;
				overflow: scroll;
			}


			image {
				margin-top: -35rpx;
				width: 50rpx;
				height: 50rpx;
			}
		}


		// 激活的滑块
		.swiper_item_active {
			margin-top: 10rpx;
			height: 260;
			background-color: rgba(208, 138, 138, 1);
		}


		.popupComment {
			.comment_content {
				text-align: left;
				max-height: 600rpx;
				overflow: scroll;
			}

			.down {
				text-align: center;

				image {
					width: 60rpx;
					height: 50rpx;
				}
			}

		}

	}
</style>
