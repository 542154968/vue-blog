<template>
	<div class="header" :style="{background: 'rgba(0, 0, 0,'+ scroll +')', boxShadow: '0 0 5px rgba(0, 0, 0,'+ scroll +')'}">
		<div class="nav">
			<router-link to="/index">首页</router-link>
			<router-link :to="{name: 'blog'} ">日志</router-link>
			<router-link :to="{name: 'share'} ">分享</router-link>
			<router-link to="/board">留言板</router-link>
			<router-link to="/aboutMe">关于我</router-link>
		</div>
	</div>
</template>

<script>
	export default{
		data () {
			return {
				scroll: 0
			}
		},
		mounted () {
			addEventListener('scroll', this.showScroll)
		},
		methods: {
			showScroll: function(){
				let sc = 0;
				if(document.documentElement && document.documentElement.scrollTop){
					sc = document.documentElement.scrollTop
				}else if(document.body){
					sc = document.body.scrollTop
				}
				var proportion = sc/400
				if(proportion >= 1){
					this.scroll = 1
				}else if(proportion <= 0){
					this.scroll = 0
				}else {
					this.scroll = Number(proportion).toFixed(2)
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
@import './../../assets/base.styl'
	.header
		position: fixed
		top: 0px
		left: 0px
		right: 0px
		z-index: 2000
		display: flex
		justify-content: flex-end
		width: 100%
		height: 60px
		background: rgba(0, 0, 0, 1)
		
		.nav
			flex: 0 0 600px
			display: flex
			line-height: 60px
			a
				flex: 1
				text-align: center
				color: #fff
				transition: all 0.5s
				overflow: hidden
				position: relative
				text-shadow: 0 0 1px #000
				&:before
					content: ""
					width: 100%
					height: 4px
					background: transparent
					position: absolute
					bottom: 0px
					left: 0px
					transition: all 0.5s
				&:hover, &.router-link-active
					&:before
						background: $mainColor
					
			
</style>