<template>
	<div class="write">
		<div class="top">
			<div class="description">
				编写博客
			</div>
			<div class="title">
				<el-select v-model="type" placeholder="请选择文章类型">
				    <el-option
				        v-for="item in selectList"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				    </el-option>
				</el-select>
				<input v-model="title" placeholder="请输入文章标题"/>
			</div>
		</div>
		
		<mavonEditor v-model="value" ref="editor"  @imgAdd="$imgAdd" @imgDel="$imgDel"/>
		<div class="upImg">
			<input type="file" ref="x"  @change="showFiles()"/>
			<img :src="imgUrl" alt="" />
		</div>
		<div class="description">
			<textarea v-model="description" rows="" cols="" placeholder="请输入描述"></textarea>
		</div>
		<div class="block">
		  <span class="demonstration">推荐等级</span>
		  <el-rate
		    v-model="star"
		    :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
		  </el-rate>
		</div>
		<div class="bottom">
			<button class="send" @click="sub()">发表</button>
		</div>
		
	</div>
</template>

<script>
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	
	export default {
		data (){
			return {
				value: '',
				title: '',
				type: '',
				imgUrl: '',
				img_file: {},
				inHtml: '',
				files: '',
				star: 0,
				baseUrl: this.$store.state.base.url,
				description: '',
				selectList: [
					{
			            value: 'blog',
			            label: '博客'
			        },
			        {
			            value: 'share',
			            label: '分享'
			        }
				] 
			}
		},
		computed: {
			
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
					type: this.type,
					title: this.title,
					description: this.description,
					detail: this.value,
					cover: this.imgUrl,
					markHtml: this.$refs.editor.$refs.vShowContent.innerHTML,
					star: this.star
				}
				// 验证
				if(this.$blog.isEmpty(data.title) == false){
					that.$message.error('文章标题不能为空！');
					return false
				}else if (this.$blog.isEmpty(data.type) == false){
					that.$message.error('文章类型不能为空！');
					return false
				}else if (this.$blog.isEmpty(data.markHtml) == false){
					that.$message.error('文章内容不能为空！');
					return false
				}else if (this.$blog.isEmpty(data.cover) == false){
					that.$message.error('封面图片不能为空！');
					return false
				}else {
					that.$ajax.post(that.baseUrl+'sendBlog', data)
							  .then(function(response){
							  	that.$message({
						          message: '发表成功！',
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
	        }
		},
		components: {
			mavonEditor	
		}
	}
</script>

<style lang="stylus" scoped >
@import './../../assets/base.styl'
	.write
		width: 100%
		min-width:1300px
		margin:0 auto
		min-height: 1200px
		.top
			.description
				width: 96%
				min-width:1300px
				font-size: 26px
				color: #333
				padding: 30px 2%
			.title
				width: 100%
				min-width: 1300px
				margin: 0 auto
				input
					float: left
					width: 96%
					min-width:1300px
					height: 50px
					line-height: 50px
					padding: 0 2%
					border:1px solid #e5e5e5
					border-bottom: none	
					border-left: none
					border-right: none
				.el-select 
					float: left
					width: 150px
					height: 50px
					line-height: 50px
						
		.v-note-wrapper
			min-height: 800px
		.bottom
			width: 96%
			padding: 0 2%
			min-width: 1300px
			margin:30px auto
			button
				padding: 10px 20px!important
			$btn(#ececec, $mainColor)
		.upImg, .block
			width: 96%
			padding: 0 2%
			margin-top: 30px
			min-height: 30px
			img
				height: 150px
		.description
			width: 96%
			padding: 0 2%
			margin-top: 20px
			margin-bottom: 20px
			textarea
				width: 300px
				min-height: 60px
				
					
				
</style>