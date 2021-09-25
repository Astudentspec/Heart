<template>
	<view class="content">

		<u-toast ref="uToast" />
		<!-- 头部 -->
		<indexHeader></indexHeader>
		<!-- <indexNav></indexNav> -->
		<!-- 导航栏 -->
		<u-tabs-swiper @change="tabsSwiper" ref="tabs" name="cate_name" :current="current" :list="list"
			:is-scroll="false" swiperWidth="778" inactive-color="#000000" active-color="#b8d38f">

			<!-- 内容区 -->
		</u-tabs-swiper>
		<swiper active-color="#326366" @transition="transition" bold="true" :current="swiper_current" class="swiper"
			@animationfinish="animationfinish">
			<swiper-item class="diary" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchend">
				<view class="prompt" :style="promp_style">~ {{move_y >= 300 ? '  松开手指刷新' : '  继续下拉'}}</view>
				<scroll-view show-scrollbar :style="content_translateY" :scroll-top="scrollTop" scroll-y="true"
					@scrolltolower="scrolltolower" @scroll="onScroll">
					
				
					
					
					<u-waterfall v-model="flower_list" class="box">
						<template v-slot:left="left">
							<!-- 这个box为了增加整体的margin-bottom 与底部拉开距离 -->
							<view class="box">
								<view @click="toArticleInfo(item.artId)" class="left maka-drgon-color"
									v-for="(item, index) in dinary_left" :key="index">
									<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->

									<image v-if="item.articlePic == '' ? false : true" :src="item.articlePic"
										mode="widthFix"></image>
									<view>{{ item.title }}</view>
									<view class="user-info">
										<image
											:src="item.isPublic == 1 ? item.upic : 'https://img2.baidu.com/it/u=2860640912,1833965317&fm=26&fmt=auto&gp=0.jpg'"
											mode="aspectFill"></image>
										<text>{{ item.isPublic == 1 ? item.username : '匿名用户' }}</text>
									</view>


								</view>
							</view>

						</template>
						<template v-slot:right="right">
							<view class="box">
								<view @click="toArticleInfo(item.artId)" class="right maka-drgon-color"
									v-for="(item, index) in dinary_right" :key="index">
									<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->

									<image v-if="item.articlePic == '' ? false : true" :src="item.articlePic"
										mode="widthFix"></image>
									<view>{{ item.title }}</view>
									<view class="user-info">
										<image
											:src="item.isPublic == 1 ? item.upic : 'https://img2.baidu.com/it/u=2860640912,1833965317&fm=26&fmt=auto&gp=0.jpg'"
											mode="aspectFill"></image>
										<text>{{ item.isPublic == 1 ? item.username : '匿名用户' }}</text>
									</view>

								</view>
							</view>

						</template>

					</u-waterfall>
					<view :style="down_line_style" class="down_line">-- 我也是有底线的 --</view>
				</scroll-view>


			</swiper-item>

			<!-- 轻聊 聊天室 -->
			<swiper-item style="background-color:#18B56;">

				<chatRoom ref="chatRoom"></chatRoom>

			</swiper-item>

		</swiper>

		<image class="up animated bounceIn" src="../../static/img/up.png" v-show="visible" @click="up(1)"></image>
		<image class="up upup animated bounceIn" src="../../static/img/upup.png" v-show="visible" @click="up(0)">
		</image>
	</view>
</template>

<script>
	import indexHeader from '../../components/indexHeader.vue'
	import indexNav from '../../components/indexNav.vue'
	import tabbar from '../../components/tabbar.vue'
	import chatRoom from '@/components/chatRoom.vue'
	import skeleton from '@/components/J-skeleton/J-skeleton.vue'
	export default {
		data() {
			return {
				title: 'Hello',
				list: [{
					cate_name: '日记'
				}, {
					cate_name: '轻聊'
				}],
				// tabs的显示以及swiper的显示
				current: 0,
				swiper_current: 0,
				tabbarShow: true,
				// 动画对象
				animationData: {},
				// 日记瀑布流左
				dinary_left: [],
				// 日记瀑布流右
				dinary_right: [],
				flower_list: [],
				// 文章请求的页数
				articlePageNum: 1,
				show: false,
				userInfo: {},
				visible: false, // 返回顶部的显示
				scrollTop: 0,
				old_scroll_top: 0,
				time: '', // 定时器,
				// 手指接触到屏幕时的位置
				startY: 0,
				move_y: 0,
				// 判断滑动是否超过了45
				is_extra: false,
				down_line_show: false,
				timeoutObj: '',
				loading: true,
				isFirst: false
			}
		},
		components: {
			indexHeader,
			indexNav,
			tabbar,
			chatRoom,
			skeleton
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo")
			this.$store.state.user_info = userInfo
			this.userInfo = userInfo
			console.log(userInfo);
			// 获取文章
			this.getArticle()

			this.connectWs()
			this.createLetters()
			uni.onNetworkStatusChange(function(res) {
				console.log("网络类型:" + res.networkType + ",网络连接:" + res.isConnected);
				if (!res.isConnected) {
					uni.showToast({
						title: "网络未连接"
					});
					return;
				}
			})

			setInterval(() => {
				this.reset(); // 检测心跳reset,防止长时间连接导致连接关闭
			}, 10000)
		},
		onShow() {
			this.show = true

		},
		onHide() {
			this.show = false
		},
		computed: {
			// 改变内容区的偏移Y
			content_translateY() {
				return "transform: translateY( " + this.move_y / 7 + "px);"
			},
			promp_style() {
				// if (this.move_y > 10) {

				// } else {
				// 	return "display:none;"
				// }
				// 字体大小必须得为整数 不然失效 但是也不会报错
				if (this.move_y / 11 >= 30) {
					return "fontSize:30rpx;"
				}
				return "fontSize:" + (this.move_y / 11).toFixed(0) + "rpx;"
			},
			down_line_style() {
				if (this.down_line_show) {
					return "display:block;"
				}

			}
		},
		watch: {
			/**
			 * 监听current属性的的变化
			 * @param {number} newValue
			 * @param {number} oldValue
			 */
			current(newValue, oldValue) {
				if (newValue === 1) {
					//隐藏底部栏
					uni.hideTabBar({
						animation: true
					})
					this.showToast("欢迎来到轻聊")

				} else {
					// 切换到首页显示底部栏
					uni.showTabBar({
						animation: true
					})
				}
			}
		},
		methods: {
			// tabs点击的时候滑块也切换
			tabsSwiper(e) {
				console.log("点击了: == " + e);
				this.swiper_current = e
				console.log(this.swiper_current);
			},
			// 滑块滑动通知标签滑动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},

			// 动画完成触发的方法
			animationfinish(e) {
				let current = e.detail.current;
				// this.$refs.tabs.setFinishCurrent(current);
				this.swiper_current = current;
				this.current = current;
			},
			// toast
			showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 1000
				})
			},
			// 文章请求
			findArticle() {
				console.log("左右数据");
				var param = {
					page: this.articlePageNum,
					pageSize: 6,
					filterUId: this.userInfo.id
				}
				// 一次请求6条数据 分别平均分给left 和right
				var data = []
				this.$request("get", "/article/findArticleByPage", param).then(
					res => {
						if (res.state == 200) {
							this.loading = false
							this.showToast("刷新成功~~")
							data = res.data
							console.log(data);
							this.articlePageNum += 1


							/**
							 *  判断data的长度是否偶数
							 * 		是: 平均分给left 和right
							 * 		否：把最后一条砍掉 再平均分给left 和right
							 */
							console.log("请求到的数据长度: " + data.length);
							var length = data.length
							console.log(length);
							if (length % 2 != 0) {
								data.pop() // 删掉最后一个元素
								this.showToast("暂无更多日记")
							}
							if (length < 6) {
								this.showToast("暂无更多日记")
							}
							// 为偶数 slice 包左不包右
							this.dinary_left = this.dinary_left.concat(data.slice(0, length / 2))
							this.dinary_right = this.dinary_right.concat(data.slice(length / 2))
							if (this.isFirst){
								console.log("第一次登陆");
								let articles = {}
								articles.left = this.dinary_left
								articles.right = this.dinary_right
								
								uni.setStorageSync("articles",articles)
								this.isFirst = false
							}
						} else {
							this.showToast("暂无更多日记")
						}

					})



			},

			toArticleInfo(artId) {
				console.log("artId:" + artId);
				this.$store.state.article_id = artId
				uni.navigateTo({
					url: '../showArticle/index',
					animationType: 'pop-in',
					animationDuration: 1000
				})
			},

			scrolltolower() {
				this.findArticle()
				console.log("scroll-view 滚动至底部50px处");
			},
			// 文章页 scroll-view 滚动时触发的方法
			onScroll(e) {
				this.old_scroll_top = e.target.scrollTop
				if (e.target.scrollTop >= 300) {
					this.visible = true
				} else {
					this.visible = false
				}
			},

			up(type) {
				this.scrollTop = this.old_scroll_top
				console.log(this.scrollTop);
				this.$nextTick(() => {
					if (type == 0) {
						this.scrollTop = 0
					} else {
						this.time = setInterval(() => {
							this.scrollTop -= 5

							if (this.scrollTop <= 0) {
								clearInterval(this.time)
							}
						}, 15)
					}


				});


				console.log("向上");
			},
			/**
			 *  下拉刷新思路
			 *  获取手指的Y轴坐标
			 * 	然后判断移动的距离 相减得出需要偏移的距离
			 * 	手指离开 如距离达到预设值 则刷新 否则回弹
			 */
			touchStart(e) {
				console.log("当前滚动条离上面的距离:  == " + this.old_scroll_top);
				console.log("偏移的距离: == " + this.move_y);
				clearInterval(this.time)
				this.startY = e.touches[0].clientY
			},
			// 手指移动触发的事件
			touchMove(e) {
				// var 
				if (this.old_scroll_top > 0) {
					return console.log("不是下拉刷新")
				}
				console.log(e.touches[0].clientY);
				if (e.touches[0].clientY - this.startY <= 0) {

					console.log(this.old_scroll_top);
					console.log("开始的:" + this.startY);
					console.log("移动过程:" + e.touches[0].clientY);
					return console.log("触顶");
				}

				console.log(this.move_y);


				if (!this.is_extra) {
					this.move_y = e.touches[0].clientY - this.startY
				}


			},
			// 手指离开事件
			touchend() {
				console.log("手指离开了");
				if (this.move_y >= 45) {
					this.findArticle()

				}
				this.move_y = 0
				this.is_extra = false
			},
			// 初始化letters
			createLetters() {
				// 创建消息缓存
				let allUserLetters = uni.getStorageSync("userLetters")
				console.log(allUserLetters);
				// 此用户是否存在于缓存之中
				let user_is_exits = false;
				if (allUserLetters == '') {
					console.log("未定义");
					const useroObj = {
						id: this.userInfo.id,
						value: []
					}
					let arr = [
						useroObj
					]
					uni.setStorageSync("userLetters", arr)
					allUserLetters = uni.getStorageSync("userLetters")
				}
				// 循环从缓存拿到的所有用户的消息
				allUserLetters.forEach((item, index) => {
					// 判断当前的用户ID是否等于我们此时登录的用户 如果是就存下他的value值

					if (item.id == this.userInfo.id) {
						this.$store.state.letters = item.value
						user_is_exits = true
					}
				})

				if (!user_is_exits) {

					const useroObj = {
						id: this.userInfo.id,
						value: []
					}
					// 如果当前缓存里没有此用户那就把letters设为空 
					/**
					 * 修复一个bug 就是点击退出登录了之后 再登录一个没有登录过的用户 
					 * 他的letters还是上个用户的 因为在判断没有该用户时 没有把letters清空
					 * 
					 */
					this.$store.state.letters = []
					allUserLetters.push(useroObj)
					uni.setStorageSync("userLetters", allUserLetters)
				}
			},
			// 连接websocket
			connectWs() {
				// 连接websock
				console.log(this.userInfo);
				this.$store.state.socketTask = uni.connectSocket({
					url: this.$ws_url + "/user/" + this.userInfo.id,
					complete: (res) => {
						res
					}
				})

				this.$store.state.socketTask.onOpen(() => {
					console.log("连接打开了");
				})

				// 监听服务端发送的消息
				/**
				 * 存 该用户和其他人私信 放在缓存中
				 */
				this.$store.state.socketTask.onMessage(res => {
					console.log("有消息");
					/** 由于只能创建一个websocket 所以群聊和私信都只能用一个
					 * 			所以我们需要判断穿过来的数据的action是否为1 如果为1就视为私信操作
					 */
					var result = JSON.parse(res.data)
					console.log(result);
					if (result.action == 1) {
						this.managerLetter(result)
					} else {
						console.log("轻聊消息");
						console.log(result);
						var obj = {
							fromUserPic: result.fromUserPic,
							msg: result.msg,
							fromUsername: result.fromUsername
						}
						console.log(obj);
						this.$store.state.chatRoom.push(obj)
						this.$nextTick(() => {
							this.$refs.chatRoom.Bottom()
							this.$refs.chatRoom.getEleHeight()
						})
					}
				})

				this.$store.state.socketTask.onClose(() => {
					console.log("关闭了");

				})

				this.$store.state.socketTask.onError(() => {
					console.log("异常了");
				})





			},
			// websocket 重连



			// 处理消息
			async managerLetter(result) {
				// 如果是测试直接return
				if (result.msg == "test") {
					return
				}
				console.log(result);
				let type = 1 // 1代表其他人发的 0代表当前用户发的
				// 判断是谁发送的消息
				if (result.fromId == this.userInfo.id) {
					type = 0
				} else {
					// 别人发给我的消息然后执行一次
					const innerAudioContext = uni.createInnerAudioContext();
					innerAudioContext.src = '/static/music/water.mp3';
					innerAudioContext.play()
				}


				// 看当前消息列是否存在
				let is_exits = false;

				// 判断是否存在然后更新
				this.$store.state.letters.forEach(item => {
					if (type == 0) {
						console.log("给我自己发的");
						// 如果是我自己发送的消息 则判断我发送的目标人是否已经在我的列表中了
						if (item.fromId === result.toId) {
							// 说明该列表已存在 替换消息即可
							item.msg = result.msg
							item.time = result.time
							// 如果存在改变true
							is_exits = true

						}
					} else {
						console.log("别人发我的");
						// 这个别人发给我的 判断我的私信列表有没有此人发过的消息 没有就创建
						if (item.fromId === result.fromId) {
							// 说明该列表已存在 替换消息即可
							item.msg = result.msg
							item.time = result.time
							// 如果存在改变true
							is_exits = true
						}
					}



				})



				console.log("私信记录存在吗: === " + is_exits);

				// 判断是不是给自己发的 需要进行转换一下
				if (type == 0) {
					// 如果是该用户自己发的 则需要把toId 改成fromId
					const fromId = result.fromId
					result.fromId = result.toId
					result.toId = fromId
					console.log(this.$api);
					// 拿到fromId 做一个查询 获取用户名和头像
					const {
						data
					} = await this.$api.findUserById(result.fromId)
					console.log(data);
					result.fromUsername = data.username
					result.fromUserPic = data.upic
				}





				// 详细展示每一条消息的对象
				const oneLetterObj = {
					fromType: type, // 1代表其他人发的 0代表当前用户发的
					msg: result.msg,
					time: result.time
				}
				console.log(result);


				// 判断是否已经存在该私信记录
				if (!is_exits) {

					// 如果该消息不存在 即为新消息 应当添加进letters 进行存储
					const letterobj = {
						...result,
						value: []
					}
					// 把该私信添加进letters
					this.$store.state.letters.unshift(letterobj);

				}

				// 需要置顶的元素
				var ele_index = 0

				// 对私信列表进行循环 判断每一项的fromId 是否等于我result的fromId
				this.$store.state.letters.forEach((item, index) => {
					console.log(item);
					// 判断我的所有目标 给对应的目标添加对象值
					if (item.fromId == result.fromId) {
						// 把当前发送过来的消息添加进了对应的目标用户的value对象数组里面
						item.value.push(oneLetterObj)
						ele_index = index // 存下当前索引
					}
					setTimeout(() => {
						this.$nextTick(() => {
							this.$store.state.letters_scroll = new Date().getTime()
						})
					}, 50)

				})
				console.log(ele_index);
				// 存值
				let add_ele = this.$store.state.letters[ele_index]
				// 删除旧的
				this.$store.state.letters.splice(ele_index, 1)
				// 再把当前的消息置顶
				this.$store.state.letters.unshift(add_ele)

				console.log(this.$store.state.letters);


				// 连接关闭时把当前登录用户的letters覆盖掉该用户在缓存里面的数据
				let allUserLetters = uni.getStorageSync("userLetters")
				// 循环从缓存拿到的所有用户的消息
				allUserLetters.forEach((item, index) => {
					// 判断当前的用户ID是否等于我们此时登录的用户 如果是就存下他的value值

					if (item.id == this.userInfo.id) {
						item.value = this.$store.state.letters
					}
				})

				// 把设置好的又保存在缓存中
				uni.setStorageSync("userLetters", allUserLetters)




			},
			// 检测心跳reset
			reset() {
				this.start(); // 启动心跳
			},
			// 启动心跳 start
			start() {
				const obj = {
					toId: 'test',
					fromId: '',
					fromUsername: '',
					fromUserPic: '',
					msg: 'test',
					time: '',
					action: 1
				}
				this.$store.state.socketTask.send({
					data: JSON.stringify(obj),
					success: res => {
						console.log("连接中");
					},
					fail: err => {
						console.log("重新连接中");
						this.connectWs()
					}
				})
			},
			getArticle(){
				if (this.userInfo.token != "") {
					// 如果缓存中没有文章
					console.log(uni.getStorageSync("articles"));
					if (uni.getStorageSync("articles") == "") {
						console.log("第一次加载没有文章信息，需要加入缓存中");
						this.isFirst = true
						this.findArticle()
						
					}else{
						// 如果不是第一次 那就把页数改为2
						this.articlePageNum = 2
						let articles = uni.getStorageSync("articles")
						console.log(articles);
						this.dinary_left = articles.left 
						this.dinary_right =  articles.right 
					}
					
				}
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
		height: 100%;


		.swiper {
			width: 100%;
			height: 86.3%;

			.diary {
				width: 100%;

				.prompt {
					position: absolute;
					width: 100%;
					padding: 10px;
					text-align: center;
					display: block;

				}

				scroll-view {
					width: 100%;
					height: 100%;
					transition: all 0.3s linear;
				}

				.u-waterfall {
					width: 100%;
					height: 100%;
					padding-right: 10rpx;
					background-color: #eeeeee;

					// 马卡龙颜色实验
					.maka-drgon-color {
						// background-color: #b8f1cc;
						background-color: white;
					}

					.box {
						margin-bottom: 40px;
					}

					.left,
					.right {
						width: 370rpx;
						margin: 10rpx 0 0;
						padding-bottom: 10rpx;




						image:nth-child(1) {
							width: 100%;
							margin-bottom: 15rpx;
							will-change: transform
						}

						view:nth-child(2) {
							width: 80%;
						}

						.user-info {
							margin-top: 15rpx;
							height: 40rpx;
							width: 240rpx;
							border-radius: 25px;
							display: flex;
							border: 1px solid black;

							image {
								width: 40rpx;
								height: 40rpx;
								border-radius: 50%;
								vertical-align: middle;
								will-change: transform;
							}

							text {
								font-size: 22rpx;
								margin: 5rpx 0 0 5rpx;
							}
						}
					}
				}

			}
		}

		.up {
			position: fixed;
			right: 50rpx;
			bottom: 300rpx;
			width: 65rpx;
			height: 65rpx;
		}

		.upup {
			width: 65rpx;
			height: 65rpx;
			bottom: 390rpx;
		}

		.down_line {
			padding: 10px;
			bottom: 5px;
			width: 100%;
			text-align: center;
			font-size: 25rpx;

			display: none;
		}
	}
</style>
