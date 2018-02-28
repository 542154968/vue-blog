let blog = (function(){
	let obj = {
		// 验证是否为空值
		isEmpty: function(data){
			if(data == '' || data == undefined ){
				return false
			}else {
				return true
			}
		},
		isEmail: function (str){
			let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
			return reg.test(str);
		},
		isMe: function(str){
			let reg = /我 |^我$| 我/
			return reg.test(str)
		}
	}
	return obj
})()
export default blog