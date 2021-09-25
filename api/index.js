/**
 * API 请求
 */


import request from '../common/request.js'

class api {
	// 登录
	async login(data) {

		const res = await request("post", '/user/login', data)

		return res
	}
	// 发送验证码
	async getEmailCode(email){
		const res = await request("post", "/user/sendEmail", { email: email })
		
		return res
	}
	// 邮箱注册
	async emailRegister(data){
		const res = await request("post","/user/emailRegister", data)
		
		return res
	}
	// 邮箱登录
	async emailLogin(data) {
	
		const res = await request("post", '/user/emailLogin', data)
	
		return res
	}
	
	// 根据用户ID查询用户
	async findUserById(data) {
	
		const res = await request("get", "/user/findUserById/" + data)
	
		return res
	}
	
	// 写树洞
	async writeTreeHole(data){
		
		const res = await request("post","/treeHole/write",data)
		
		return res
	}
	
	// 查询树洞
	async findTreeHole(data){
		
		const res = await request("post","/treeHole/findTreeHole",data)
		console.log(res);
		return res
	} 
	
	// 查询个人的树洞数量
	async findTreeHoleCountByUid(data){
		
		const res = await request("get","/treeHole/findTreeHoleCount/" + data )
		console.log(res);
		return res
	} 
	
	// 查询个人的树洞信息
	async findTreeHoleInfoByUid(data){
		
		const res = await request("get","/treeHole/findTreeHoleByUid/" + data )
		console.log(res);
		return res
	}
	 
	// 根据树洞ID查询树洞评论
	async findCommentByTid(data){
		
		const res = await request("get","/treeHole/findCommentByTId/" + data )
		console.log(res);
		return res
	}  
	
	// 根据树洞ID写评论
	async addCommentByTreeId(data){
		
		const res = await request("post","/comment/addComment/",data )
		console.log(res);
		return res
	}  
	
	// 根据用户ID修改用户名
	async updateUsername(data){
		
		const res = await request("post","/user/updateUsername/",data )
		console.log(res);
		return res
	} 
	
	// 根据用户ID修改密码
	async updatePassword(data){
		
		const res = await request("post","/user/updatePassword/",data )
		console.log(res);
		return res
	} 
	// 更改用户头像
	async updateUserPic(data){
		
		const res = await request("post","/user/updateUserPic",data )
		console.log(res);
		return res
	} 
	// 赞
	async addLike(data){
		
		const res = await request("post","/like/addLike",data )
		console.log(res);
		return res
	} 
	// 取消赞
	async deleteLike(data){
		
		const res = await request("post","/like/deleteLike",data )
		console.log(res);
		return res
	} 
	
}




export default new api()
