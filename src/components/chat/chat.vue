<template>
	<div class="chat">
		<div class="user">
			<label >
				<span>昵称： </span>
				<input v-model="userName" placeholder="输入你的昵称"/>
			</label>
			<label >
				<span>邮箱： </span>
				<input type="text" v-model="email" placeholder="输入你的邮箱， 我会保密哒"/>
			</label>
			<button @click="sub">发表</button>
		
		</div>
		<div class="mark" v-highlight>
			<mavonEditor v-model="value" ref="editor" placeholder="输入的内容不能小于5个字符不能超过300个字符"  @imgAdd="$imgAdd" @imgDel="$imgDel"/>
		</div>
		
	</div>
</template>

<script>
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	export default{
		props: {
			chatType: {
				type: String,
				default: "board"
			},
			chatId: {
				default: ""
			}
		},
		data (){
			return {
				userName: "",
				email: "",
				value: "",
				baseUrl: this.$store.state.base.url
			}
		},
		created: function(){
		},
		methods: {
			showFiles: function(){
				let fie = this.$refs.x.files[0]
				let that = this;
				if(fie){
					var reader = new FileReader();
					reader.readAsDataURL(fie)
					reader.onloadend = function(){
						let imgUrl = this.result;
						that.$ajax.post(
							that.baseUrl+'sendImg', 
							{base64: imgUrl} 
						).then(function(response){
							if(response.status == 200){
								that.imgUrl = that.baseUrl+response.data.success
							}
						})
					}
				}
			},
			sub: function(){
				let that = this;
				let data = {
					userName: this.userName,
					email: this.email,
					type: this.chatType,
					id: this.chatId,
					detail: this.value,
					markHtml: this.$refs.editor.$refs.vShowContent.innerHTML
					
				}
				if(this.$blog.isEmpty(data.userName) == false){
					that.$message.error('您的昵称不能为空！');
					return false
				}else if (this.$blog.isEmail(data.email) == false){
					that.$message.error('请输入正确的邮箱！');
					return false
				}else if(data.detail === "" || data.detail.length<5 || data.detail.length> 300 || data.detail == "输入的内容不能小于5个字符不能超过300个字符"){
					that.$message.error("输入的内容不能小于5个字符不能超过300个字符")
					return false
				}else {
					if(that.$blog.isMe(data.userName) == true ){
						if(data.email == "542154968@qq.com"){
							
						}else {
							that.$message.error("不能用二货博主的称呼！")
							return false
						}
						
					}else {}
					that.$ajax.post(that.baseUrl+'board', data)
								.then(function(response){
									that.userName = "";
									that.email = "";
									that.value = "";
									that.$refs.editor.$refs.vShowContent.innerHTML = "";
								  	that.$message({
							          	message: '发表成功！麻烦您自行刷新查看 哇哈哈哈',
							          	type: 'success'
							      	});
							      	
								})
								.catch(function(err){
								  	that.$message.error('发表失败');
								})
					
				}
				
				
			},
			$imgAdd(filename, $file){
				var that = this;
	            if($file){
					var reader = new FileReader();
					reader.readAsDataURL($file)
					reader.onloadend = function(){
						let imgUrl = this.result;
						that.$ajax.post(
							that.baseUrl+'sendImg',  
							{base64: imgUrl} 
						).then(function(response){
							if(response.status == 200){
								let u = that.baseUrl+response.data.success
								// that.$refs.editor.$imgUpdateByUrl(filename, u)
								that.$refs.editor.$img2Url(filename, u)
							}
						})
					}
				}
	        },
	        $imgDel(pos){
	            delete this.img_file[pos];
	        },
	        addAt: function(){
				this.value = this.$store.state.base.boardAt+'\n'+this.value
			}
		},
		computed: {
			
		},
		components: {
			mavonEditor	
		}
		
	}
</script>

<style lang="stylus" scoped>
	@import './../../assets/base.styl'
	.chat
		clear: both
		width: 1260px
		margin: 0 auto
		background: #fbfbfb
		border: 1px solid #dcdcdc
		border-top: none
		padding: 20px
		.user
			width: 1260px
			margin-bottom: 20px
			label
				padding-right: 20px
				span
					font-size: 13px
					color: #666
				input
					width: 200px	
					height: 32px
					line-height: 32px
					border: 1px solid #dcdcdc
					padding: 0 10px
					border-radius: 4px
					transition: all 0.5s
					&:hover, &:focus
						border-color: $mainColor
						box-shadow: 0 0 4px $mainColor
			$btn(#ccc, $mainColor)			
			button
				border-radius: 4px
				float: right
				padding: 10px 19px
			
				
				
</style>