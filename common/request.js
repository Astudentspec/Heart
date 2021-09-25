const request = function(method, url, data) { //prams 为我们需要调用的接口API的参数 下面会贴具体代码

	/**
	 * 设立拦截器
	 * 获取token 如有token 即 放行请求 如没有则进行拦截
	 */
	let token = uni.getStorageSync('userInfo').token;
	console.log(token);
	var is_login = false
	if (token) {
		console.log("登录了");
		is_login = true
	}
	console.log("当前登录状态:  " + is_login);

	// 发布时的后端接口地址
	let base_url = "http://yaolovelive.com:8081"
	// 开发阶段后端接口地址
	// let base_url = "http://192.168.1.112:8081"
	let req_url = base_url + url; //请求的网络地址和局地的api地址组合
	console.log(req_url);

	var cookie;
	//因为我们的GET和POST请求结构不同这里我们做处理，大家根据自己后台接口所需结构灵活做调整吧
	var headerData = {
		'Content-type': 'application/x-www-form-urlencoded',
		'token': uni.getStorageSync('token')
	}

	console.log(data)

	console.log(url.includes("/user/"));
	if (url.includes("/user/") || is_login) {
		return new Promise(async (resolve, reject) => {
			return await uni.request({
				url: req_url,
				data: data,
				method: method,
				sslVerify: false,
				header: headerData,
				withCredentials: true,
				success: (res) => {
					console.log(res);
					resolve(res.data);
				},
				fail: (err) => {
					console.log(err)
					reject(err);
					uni.hideLoading()
				}
			});
		})
	}

	/**
	 * 未登录 返回一个空promise
	 */
	return new Promise(async (resolve, reject) => {

	})
}

export default request
