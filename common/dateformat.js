const dateFormat =  function(date) {
	var create_date = new Date(date)
	var time_now = new Date()
	console.log("现在的时间:" + time_now.getTime());

	var s1 = create_date.getTime(),
		s2 = time_now.getTime();
	var total = (s2 - s1) / 1000;
	console.log("total" + total);


	var day = parseInt(total / (24 * 60 * 60)); //计算天数
	var afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
	var hour = parseInt(afterDay / (60 * 60)); //计算小时数
	var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
	var min = parseInt(afterHour / 60); //计算整数分
	var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数

	var result = day + '天' + hour + '时' + min + '分' + afterMin + '秒'

	var total_hour = (day * 24) + hour

	console.log("总小时:" + total_hour);
	console.log(result);

	if (total_hour >= 48) {
		console.log("发布时间大于48小时");
		return date
	} else if (total_hour > 24) {
		console.log("发布时间小于48小时大于24小时");
		return '咋天'
	} else if (total_hour >= 1) {
		console.log("发布时间小于24小时");
		return hour + "小时之前"
	} else {
		if (min < 5) {
			return "刚刚"
		}
		return min + "分钟之前"
	}
}

export default dateFormat