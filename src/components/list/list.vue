<template>
	<div class="list">
		<div class="banner">
			<img src="../../../static/images/bgImg2.jpg" :style="{top: -scroll*200 +'px'}"/>
		</div>
		<v-logList :boxWidth="wi" :pageType="type" :logTitle="logTitle"></v-logList>
	</div>
</template>

<script>
	import logList from '../logList/logList'
	export default{
		data (){
			return {
				wi: '1040px',
				logTitle: "",
				type: this.$route.query.pageType,
				scroll: 0
			}
		},
		mounted () {
			addEventListener('scroll', this.showScroll)
		},
		watch: {
			'$route': 'scrollTop'
		},
		methods: {
			reLoad: function(){
				var type = this.$route.query.pageType;
				if(type == "share"){
					this.logTitle = "分享列表"
				}else if(type == "blog"){
					this.logTitle = "日志列表"
				}	
				this.type =  this.$route.query.pageType
			},
			showScroll: function(){
				let sc = 0;
				if(document.documentElement && document.documentElement.scrollTop){
					sc = document.documentElement.scrollTop
				}else if(document.body){
					sc = document.body.scrollTop
				}
				let proportion = sc/400
				if(proportion >= 1){
					this.scroll = 1
				}else if(proportion <= 0){
					this.scroll = 0
				}else {
					this.scroll = Number(proportion).toFixed(2)
				}
			},
			scrollTop: function(){
				window.scroll(0,0)
			}
		},
		components: {
  	    	'v-logList': logList,
    	}
	}
</script>

<style lang="stylus" scoped>
	@import './../../assets/base.styl'
	.list
		.banner
			height: 400px
			width: 100%
			min-width: 1300px
			margin: 0 auto
			overflow: hidden
			position: relative
			img
				position: absolute
				width: 100%
				min-width: 1300px
				top: 0px
				left: 0px
</style>