<template>
	<div id="logList" >
		<div class="log-top" :style="{width: boxWidth}">
			<span class="title">{{logTitle || pageTitle}}</span>
			<div class="more" v-show="showMore">
				<button @click="goMore()">查看更多</button>
			</div>
		</div>
		<div class="rowList" :style="{width: boxWidth}">
			<div class="item" v-for="item in logList" @click = "showDetail(item.id)" ref="item" :key="item.id">
				<div class="imgContain">
					<img :src="item.cover" alt="" />
				</div>
				<div class="title" :title="item.title">
					{{item.title}}
				</div>
				<div class="sundry">
					<div class="time">
						<span>{{item.time}}</span>
						
					</div>
					<div class="view">
						<i class="fa fa-eye" aria-hidden="true"></i>
						<span>{{item.view}}</span>
					</div>
				</div>	
			</div>
		</div>
		<el-pagination
			v-show="!showMore"
		  	small
		  	:page-size = "limit"
		  	:current-page = "pageLimit"
		  	@current-change="goPage"
		 	layout="prev, pager, next"
		  	:total="allPage">
		</el-pagination>
	</div>
</template>

<script>
	export default{
		props:{
			limit: {
				type: Number,
				default: 30,
			},
			logTitle: {
				type: String,
			},
			boxWidth: {
				type: String
			},
			pageType: {
				type: String,
				default: 'blog'
			}
		},
		data (){
			return {
				logList:[],
				showMore: !this.boxWidth,
				baseUrl: this.$store.state.base.url,
				pageTitle: "",
				pageLimit: 20,
				allPage: 0,
				page: 1
			}
		},
		watch: {
			"$route": "getData"
		},
		created: function(){
			this.getData()
		},
		methods: {
			getData: function(){
				let that = this;
				
				let data= {
					limit: this.limit,
					skip: 0,
					type: this.pageType,
					sort:  -1
				}
				let type = that.changeTitle()
				if(type){
					data.type = type
				}
				this.$ajax.get(that.baseUrl+'list', {params: data} ).then(function(response){
					that.logList = response.data.list
					that.allPage = response.data.count
				})
			},
			showDetail: function(id){
				let type =  this.changeTitle()
				if(type == undefined){
					type = 'blog'
				}
				this.$router.push({path: '/list/'+type+'/detail/', query: {id: id}})
			},
			goMore: function(){
				this.$router.push({name: 'blog'})
			},
			changeTitle: function(){
				let type = this.$route.name
				if(type){
					if(type == "share"){
						this.pageTitle = "分享列表"
					}else if(type == "blog"){
						this.pageTitle = "日志列表"
					}
				}else {}
				return type
			},
			goPage: function(val){
				let that = this;
				let type =  this.changeTitle();
				let data= {
					limit: this.pageLimit,
					type: type,
					skip: (val-1)*this.pageLimit,
					sort: -1
				}
				if(!that.showMore == false){  // 避免首页因为page变化而再次请求
					return false
				}
				this.$ajax.get(that.baseUrl+'list', {params: data} ).then(function(response){
					that.logList = response.data.list
				})
			}
		}
		
	}
</script>

<style lang="stylus" >
	@import './../../assets/base.styl'
	#logList
		width: 1300px
		margin: 30px auto
		.log-top
			width: 1300px
			height: 50px
			line-height: 50px
			.title
				font-size: 26px
				color: #333
			.more
				float: right
				button
					border: none!important
				$btn(#ececec, $mainColor)
		.rowList
			width: 1300px
			display: flex
			flex-wrap: wrap 
			.item
				flex: 0 0 238px
				margin: 10px
				min-height: 100px
				border-radius: 4px
				border: 1px solid #ccc
				overflow: hidden
				transition: all 0.3s
				cursor: pointer
				&:hover
					box-shadow: 0 0 10px #999
				&:hover .imgContain img
					transform: scale(1.2)
				&:hover .sundry .view
					color: $mainColor			
				.imgContain
					overflow: hidden
					width: 100%
					border-radius: 4px 4px 0 0
				.imgContain, .imgContain img
					width: 100%
					height: 240px
					border: none
					outline: none
					margin: 0
					float: left
					transition:all 5s
					img
						width: auto
				.title, .sundry	
					clear: both
					padding: 10px 
					font-size: 14px
					color: #666
					transition: all 0.3s
				.title	
					font-size: 16px
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				.sundry
					padding-top: 0px
					border-radius: 0 0 4px 4px
					.time
						color: #666
						font-size: 12px
						transition: all 0.3s
					.view
						color: #999
						margin-top: 5px	
						transition: all 0.3s
						span
							font-size: 12px
						&:hover 
							color: $mainColor	
		.el-pagination--small
			background: #fff
			border-top: none
			width: 100%		
			padding: 20px 0 	
			.btn-next, .btn-prev, .el-pager .number
				background: #fbfbfb
			.el-pager
				.number
					color: #666
					border: none
				.number.active
					color: $mainColor	
			
									
</style>