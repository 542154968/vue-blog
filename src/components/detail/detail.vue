<template>
	<div id="detail">
		<div class="top">
			<div class="title"><i class="fa fa-bookmark-o" aria-hidden="true"></i> {{title}}</div>
		</div>
		<div class="contain">
			<div class="markDown" v-highlight>
				<div class="view">
					<span><i class="fa fa-calendar" aria-hidden="true"></i> {{blogData.time}}</span>
					<span><i class="fa fa-eye" aria-hidden="true"></i> {{blogData.view}}</span>
					<span><i class="fa fa-pencil" aria-hidden="true"></i> {{blogData.comments}}</span>
				</div>
				<mavonEditor v-model="value" ref="editor" :subfield="false"  :toolbars="toolbars"  :default_open="preview" />
			</div>
			<div class="detail-list">
				<div class="title"><span>评论内容</span> <span @click="back">返回</span> </div>
				<div class="item" v-for="(item, index) in detailList" :key="index">
					<div class="left">
						<div class="img">
							<img src="/static/images/weixin.jpg" alt="" />
						</div>
						<div class="userName">{{item.userName}}</div>
					</div>
					<div class="right">
						<div class="item-title">
							<div class="floor">第 {{ (index+1)+(page-1)*5 }} 楼</div>
							<div class="time">{{item.time}}</div>
						</div>
						<div class="v-note-wrapper markdown-body code-github">
							<div class="v-note-panel">
								<div class="v-note-show single-show">
									<div class="v-show-content scroll-style" v-html="item.markHtml" v-highlight>
										
									</div>
								</div>
							</div>
						</div>
						<div class="item-title">
							<div class="answer" @click="answer((index+1)+(page-1)*5, item.userName)">
								回复
							</div>
						</div>
					</div>
				</div>
				<v-chat :chatId="selfId" :chatType="selfType" ref="chat"></v-chat>
				<el-pagination
				  	small
				  	:page-size = "limit"
				  	:current-page = "page"
				  	@current-change="goPage"
				  	layout="prev, pager, next"
				  	:total="allPage">
				</el-pagination>
			</div>
			
		</div>
		
	</div>
</template>

<script>
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	import chat from "../chat/chat"
	
	export default {
		beforeRouteEnter: (to, from, next) => {
			 from.fullPath === '/' ? next( function(vm){
				 					alert(1)
									vm.formList = false;
								 })
							   : next()
		},
		data (){
			return {
				formList: true,
				baseUrl: this.$store.state.base.url,
				title: "",
				preview: "preview",
				value: "",
				toolbars: {
					subfield: false,
					readmodel: true
				},
				blogData: {},
				detailList: [],
				selfId: this.$route.query.id,
				selfType: "detail",
				limit: 5,
				allPage: 0,
				page: 1,
				atWho: ""
			}
		},
		created (){
			this.getData()
			console.log(this.$route)
		},
		methods: {
			back: function(){
				this.formList === false ? this.$router.push('/list') : this.$router.go(-1);
			},
			getData: function(){
				let that = this;
				that.$ajax.get(that.baseUrl+'getBlogDetail', {params:{id: that.$route.query.id}}).then(function(response){
					// console.log(JSON.stringify(response))
					that.blogData = response.data.detail[0]
					that.detailList = response.data.detailList
					that.title = response.data.detail[0].title
					that.value = response.data.detail[1].detail
					that.allPage = response.data.count
					window.scroll(0,0)
					
				}).catch(function(err){
					// console.log(err)
					
				})
			},
			goPage: function(val){
				let that = this;
				that.page = val;
				let data= {
					limit: this.limit,
					page: val
				}
				that.$ajax.get(that.baseUrl+'detailPages', {params:{id: that.$route.query.id, page: data.page, limit: data.limit}}).then(function(response){
					that.detailList = response.data
				}).catch(function(err){
					// console.log(err)
					
				})
			},
			answer: function(id, userName){
				let val = {
					text: '**回复: '+userName+'('+id+' 楼)'+'**'
				} 
				this.$store.commit('changeBoardValue', val)
				this.$refs.chat.addAt()
				window.scroll(0,document.body.scrollHeight)
			},
		},
		components: {
			mavonEditor	,
			"v-chat": chat
		}
	}
</script>

<style lang="stylus" >
	@import './../../assets/base.styl'
	#detail
		width: 100%
		min-width: 1300px
		min-height: 1000px
		.top
			width: 96%
			min-width: 1300px
			height: 60px
			background: $mainColor
			line-height: 60px
			padding: 0px 2%
			color: #fff
		.contain
			width: 1300px
			margin: 0 auto
			.markDown
				position: relative
				width: 1300px
				.view
					width: 900px
					padding: 0px 10px
					position: absolute
					height: 42px
					line-height: 42px
					top: 0px
					left: 0px
					z-index: 1501
					span
						padding-right: 20px
						color: #999
						font-size: 12px
						i
							color: #666	
			.detail-list, .detail-list .title
				width: 100%
				min-width: 1300px
				margin: 0 auto	
			.detail-list
				float: left	
				border: 1px solid #dcdcdc
				margin-top: 40px 
				margin-bottom: 40px
				box-shadow: 0 0 2px #ccc
				.chat
					border: none
				.title
					border-bottom: 1px solid #dcdcdc
					span
						display: block
						position: relative
						font-size: 18px
						color: #666
						padding: 20px
						&:before
							content: ""
							position: absolute
							width: 4px
							height: 30px
							left: 0px
							top: 15px
							background: $mainColor	
				.item
					width: 1260px
					padding: 20px
					float: left
					border-bottom: 1px solid #dcdcdc
					&:last-child
						border-bottom: none
					.left
						width: 100px
						float: left
						&:hover .img img
							transform: scale(1.5)
						.img
							width: 60px
							margin: 10px auto 20px
							border-radius: 50%
							overflow: hidden
							img
								width: 100%	
								transition: all 0.5s
						.userName
							text-align: center
							color: #333
							font-size: 14px	
					.right
						float: left
						width: 1140px
						margin-left: 20px	
						.item-title
							width: 100%		
							height: 30px
							line-height: 30px
							.time, .floor
								float: left
								color: #999
								margin-right: 20px
								font-size: 13px	
							.answer
								float: left	
								font-size: 12px
								color: #999
								line-height: 18px
								cursor: pointer
								transition: all 0.3s
								line-height: 30px
								&:hover
									color: $mainColor
						.v-note-wrapper
							min-height: 55px			
							.v-note-panel
								box-shadow: 0 0 0 transparent			
								.v-show-content 
									padding: 0px
				.el-pagination--small
					background: #fbfbfb
					border: none
					width: 96%		
					padding: 20px 2% 	
					.btn-next, .btn-prev, .el-pager .number
						background: #fbfbfb
					.el-pager
						.number
							color: #666
							border: none
						.number.active
							color: $mainColor						
									
</style>