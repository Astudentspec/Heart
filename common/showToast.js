const showToast = function(result) {
	console.log(typeof result); // 输入类型
	// 判断类型
	if (typeof result === 'string') {
		return uni.showToast({
			title: result,
			icon: 'none',
			duration: 1000
		})
	}
	console.log(result);
	uni.showToast({
		title: result.msg,
		icon: 'none',
		duration: 1000
	})
	console.log(result);
	if (result.state != 200) {
		return false;
	} else {
		return true;
	}
}

export default showToast
