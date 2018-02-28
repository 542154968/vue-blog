<template>
	<div class="logList">
		<div class="log-top">
			<span class="title">最新分享</span>
			<div class="more">
				<button @click="goMore()">查看更多</button>
			</div>
		</div>
		<div class="contain">
			<div class="item" v-for="item in logList"  @click = "showDetail(item.id)" ref="item" :key="item.id"> 
				<div class="top">
					<div class="img">
						<img :src="item.cover" alt="" />
					</div>
					<div class="information">
						<div class="title">
							<span class="title-msg" :title="item.title" >{{item.title}}</span>
						</div>
						<div class="type">
							 <el-rate
							  v-model="item.star"
							  disabled
							  text-color="#ff9900"
							  >
							</el-rate>
						</div>
						<div class="time">
							<span class="tag">时间: </span>
							<span class="msg">{{item.time}}</span>
						</div>
						
						<div class="view">
							<span class="tag"><i class="fa fa-eye" aria-hidden="true"></i></span>
							<span class="msg">{{item.view}}</span>
						</div>
						<div class="detail">
							<div class="top">
								分享原因
								
							</div>
							<div class="detail-contain">
								<div class="detail-contain-msg">
									{{item.description}}
								</div>
								<div class="detail-contain-button" @click="showId(item.id)">
									<span>查看详情</span>
								</div>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			limit: Number,
			default: 4,
			required: true
		},
		data (){
			return {
				logList:[],
				baseUrl: this.$store.state.base.url,
				value1: 0,
			}
		},
		created: function(){
			let data= {
				limit: 4,
				skip: 0,
				type: 'share',
				sort: -1
			}
			this.getData(data)
		},
		methods: {
			getData: function(data){
				let that = this;
				this.$ajax.get(that.baseUrl+'list', {params: data} ).then(function(response){

					that.logList = response.data.list
					
				})
			},
			showDetail: function(id){
				this.$router.push({path: '/list/share/detail/', query: {id: id}})
			},
			goMore: function(){
				this.$router.push({name: 'share'})
			},
		}
	}
</script>

<style lang="stylus" scoped>
	@import './../../assets/base.styl'
	.logList
		clear: both
		.contain
			$basic()
			display: flex
			flex-wrap: wrap
			.item
				flex: 0 0 590px
				height: 250px
				margin: 10px
				transition: all 0.5s
				padding: 20px
				border-radius: 4px
				cursor: pointer
				&:hover
					box-shadow: 0 0 20px #ccc
					
				.top
					.img
						float: left
						width: 300px
						height: 250px
						overflow: hidden
						margin-right: 20px
						img	
							height: 100%
					.information
						float: left
						width: 270px
						.tag
							color: #999
							padding-right: 10px	
							font-size: 14px
						.msg
							color: #666	
							font-size: 14px	
						.title
							position: relative
							width: 100%
							margin-bottom: 15px	
							font-size: 18px	
							line-height: 20px	
							color: #333
							.title-msg
								display: block
								width: 100%
								$textElip()
							&:before
								position: absolute
								content: ""
								top: 0px
								left: -10px
								height: 100%
								z-index: 50
								width: 4px
								height: 20px
								background: $mainColor
						.type, .time
							width: 100%
							margin-bottom: 15px	
							font-size: 14px
							$textElip()
						.type
							.msg
								margin-right: 10px	
						.view
							margin-bottom: 15px
							.tag	
								padding-right: 0px
								margin-right: 0px
								font-size: 12px
							.msg
								font-size: 12px	
						.detail
							width: 100%
							.top
								position: relative
								color: #999
								font-size: 14px!important
								&:before
									position: absolute
									content: ""
									top: 0px
									left: -10px
									height: 100%
									z-index: 50
									width: 4px
									height: 100%
									background: $mainColor
							.detail-contain
								position: relative
								height: 108px
								overflow: hidden
								margin: 5px 0px 0px
								width: 100%
								&:hover .detail-contain-button span
									bottom: 0px	
								.detail-contain-msg
									font-size: 12px
									line-height: 16px
									height: 108px
									color: #666
								.detail-contain-button
									position: absolute
									width: 100%
									height: 108px
									top: 0px
									left: 0px
									background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))
									span
										cursor: pointer
										position: absolute
										bottom: -65px
										display: block
										margin: 0 auto
										font-size: 14px
										left: 0px
										width: 100%
										height: 32px
										line-height: 32px
										font-size: 14px
										text-align: center
										background: rgba(0,0,0 0.7)
										color: #fff
										border-radius: 5px 5px 0 0 
										transition: all 0.5s
										&:hover
											text-shadow: 0 0 1px #fff
								
								
												
</style>