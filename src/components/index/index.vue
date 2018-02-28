<template>
	<div class="index">
		<v-carousel></v-carousel>
		<div class="banner5421">
			<div class="contain">
				<div class="item">
					<i class="fa fa-qq" aria-hidden="true"></i>
					<span>我的QQ</span>
					<div class="img">
						<img src="/static/images/QQ.png" alt="" />
					</div>
				</div>
				<div class="item">
					<i class="fa fa-weixin" aria-hidden="true"></i>
					<span >我的微信</span>
					<div class="img">
						<img src="/static/images/weixin.jpg" alt="" />
					</div>	
				</div>
			</div>
		</div>
		<v-logList :limit="5" :logTitle="ti" keep-alive></v-logList>
		<v-share :limit="4" keep-alive></v-share>
		<router-view></router-view>
	</div>
</template>

<script>
	import shareList from '../share/shareList'
	import carousel from '../carousel/carousel'
	import logList from '../logList/logList'
	export default{
		data (){
			return {
				ti: "最新日志",
			}
		},
		components: {
  	    	'v-carousel': carousel,
  	    	'v-logList': logList,
  	    	'v-share': shareList
    	},
		beforeCreate: function(){
			// console.log( 'beforecreated' )
		},
		created: function(){
			// console.log( 'created' )
		},
		beforeMount: function(){
			// console.log( 'beforemount' )
		},
		mounted: function(){
			// console.log( 'mounted' )
		},
		 methods: {
			
		}
	}
</script>

<style lang="stylus">
	@import './../../assets/base.styl'
	.index
		.banner5421
			background: #f5f5f5
			width: 100%
			min-width: 1300px
			padding: 20px 0px
			height: 130px
			border-bottom: 1px solid #ececec
			.contain
				width: 1300px
				margin: 0 auto
				.item
					float: left
					width: 50%
					height: 130px
					overflow: hidden
					position: relative
					transition: all 0.5s
					&:hover i
					
						color: #fff
						text-shadow: 0 0 10px $mainColor	
						left: 120px
					&:hover .img
						right: 120px	
						transform: scale(1)	
					&:hover span
						color: $mainColor
						left: 125px		
					i
					span
						font-size: 60px
						position: absolute
						top: 35px 
						left: 275px
						z-index: 50
						transition: all 0.5s
					span
						top: 100px
						left: 300px
						font-size: 14px
						color: #f5f5f5
						transition: all 0.5s
					.img
						width: 120px
						height: 120px
						position: absolute
						right: -130px
						top: 7px
						z-index: 50
						transition: all 0.5s
						transform: scale(0)
						img
							width: 100%
							height: 100%
				
								
</style>
