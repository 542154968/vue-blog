<template>
	<div class="carousel">
		<el-carousel indicator-position="">
            <el-carousel-item v-for="item in imgs" :key="item">
             	<img :src="item" alt="" />
    		</el-carousel-item>
        </el-carousel>
	</div>
</template>

<script>
	export default{
		data (){
			return {
				imgs: [
					
					'/static/images/bgImg1.jpg',
					'/static/images/bgImg2.jpg',
					'/static/images/bgImg3.jpg',
					'/static/images/bgImg4.jpg'
				]
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.el-carousel__container
		position: relative
	.el-carousel__container, .carousel, .el-carousel, .el-carousel__container, .el-carousel__item
		min-width: 1300px
		height: 400px
		width: 100%
		overflow: hidden
	.carousel img{
		min-width: 1300px
		width: 100%;
		
	}
</style>