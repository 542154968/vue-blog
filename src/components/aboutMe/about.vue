<template>
	<div class="aboutMe">
		<div class="img">
			<img src="/static/images/bgImg3.jpg" alt="" />
		</div>
		<div class="about">
			<div class="name">二狗</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				has: true
			}
		},
		mounted: function(){
			// console.log( this.$router )
		},
		// beforeRouteEnter (to, from, next) {
		// 	console.log( to );
		// 	console.log(from)
		// 	if( from.path == '/' ){
		// 		next('/')
		// 		alert(1)
		// 	}else{
		// 		next()
		// 	}
			
		// // 在渲染该组件的对应路由被 confirm 前调用
		// // 不！能！获取组件实例 `this`
		// // 因为当守卫执行前，组件实例还没被创建
		// },
		// beforeRouteLeave(to, from, next){
		// 	console.log(  to );
		// 	console.log(  from );
		// 	if( typeof to === 'undefined' ){
		// 		next('/')
		// 	}
		// 	//console.log(from)
		// },
		methods: {
		}
	}
</script>

<style lang="stylus" scoped>
	.aboutMe
		min-height: 1100px
		position: relative
		width: 100%
		min-width: 1300px
		margin: 0 auto
		.img
			width: 100%
			min-width: 1300px
			z-index: 5
			overflow: hidden
			img
				display: block
				width: 100%
				filter: blur(4px)
		.about
			position: absolute
			top: 30%
			width: 100%
			min-width: 1300px
			color: #fff
			font-size: 26px
			margin: 0 auto	
			text-align: center	
</style>