<template>
	<div id="board">
		<div class="top-img">
			<img src="/static/images/bgImg2.jpg" alt="" />
		</div>
		<div class="board-contain">
			<div class="welcome">
				<span>欢迎你嘿嘿嘿</span>
			</div>
			<div class="list">
				<div class="item" v-for="item in boardList"  :key="item.id">
					<div class="left">
						<img src="/static/images/zjl.jpg" alt="" />
					</div>
					<div class="right">
						<div class="top">
							<div class="name"><i class="fa fa-user" aria-hidden="true"></i> {{item.userName}}</div>
							
							<div class="floor"><i class="fa fa-building" aria-hidden="true"></i> {{item.id}}楼</div>
							
						</div>
						<div class="v-note-wrapper markdown-body code-github">
							<div class="v-note-panel">
								<div class="v-note-show single-show">
									<div class="v-show-content scroll-style" v-html="item.markHtml" v-highlight>
										
									</div>
								</div>
							</div>
						</div>
						<div class="bottom">
							<div class="time"><i class="fa fa-calendar" aria-hidden="true"></i> {{item.time}}</div>
							<div class="answer" @click="answer(item.id, item.userName)">回复</div>
						</div>
					</div>
				</div>
			</div>
			<v-chat ref="chat"></v-chat>
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
</template>

<script>
	import chat from "../chat/chat"
	export default {
		data (){
			return {
				limit: 5,
				boardList: null,
				baseUrl: this.$store.state.base.url,
				allPage: 0,
				page: 1,
				atWho: ""
			}
		},
		created: function(){
			let data= {
					limit: this.limit,
					type: 'board',
					sort:  -1,
					page: 1
				}
			this.getData(data);
		},
		methods: {
			getData: function(data){
				let that = this;
				this.$ajax.get(that.baseUrl+'boardList', {params: data} ).then(function(response){
					// console.log(JSON.stringify(response.data))
					that.boardList = response.data.item
					that.allPage = response.data.count
					that.$nextTick(function(){
						window.scroll(0,0)
					})
					
				})
			},
			goPage: function(val){
				let data= {
					limit: this.limit,
					type: 'board',
					sort:  -1,
					page: val
				}
				this.getData(data);
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
			'v-chat': chat
		}
	}
</script>

<style lang="stylus" >
	@import './../../assets/base.styl'
	#board
		.top-img
			width: 100%
			min-width: 1300px
			margin: 0 auto
			height: 400px
			overflow: hidden
			img
				width: 100%
				margin-top: -800px
		.board-contain
			margin: 50px auto
			width: 1300px
			border-radius: 4px
			box-shadow: 0 0 40px #ccc
			
			.welcome, .list
				width: 1300px
				margin: 0 auto
				height: 200px
				background: #fbfbfb	
				line-height: 200px
				color: #666
				border: 1px solid #dcdcdc
			.welcome
				border-bottom: none;
				text-align: center	
			.list
				min-height: 600px
				height: auto
				line-height: normal	
				border-bottom: none
				background: #fbfbfb
				float: left
				.item
					float: left
					padding: 20px
					min-height: 190px
					width: 1260px
					border-bottom: 1px solid #dcdcdc
					.left
						float: left
						width: 100px
						img
							width: 100%
					.right
						float: left
						width: 1140px
						margin-left: 20px
						.top, .bottom
							width: 100%
							height: 17px
							margin-bottom: 20px
							.name, .time, .floor
								float: left
								margin-right: 20px
								font-size: 13px	
								color: #999
								i
									padding-right: 2px	
						.bottom
							.answer
								float: left	
								font-size: 12px
								color: #666
								line-height: 18px
								cursor: pointer
								transition: all 0.3s
								&:hover
									color: $mainColor	
						.v-note-wrapper
							min-height: 116px			
							.v-note-panel
								box-shadow: 0 0 0 transparent			
								.v-show-content 
									padding: 0px			
						.bottom
							margin-bottom: 0px								
			.el-pagination--small
				background: #fbfbfb
				border: 1px solid #dcdcdc
				border-top: none
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