<template>
	<div class="footer">
		<div class="item">
			<div class="contain">
				<span>李二狗</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data (){
			return {
				
			}
		}
	}
</script>

<style lang="stylus" scoped>
	@import './../../assets/base.styl'
	.footer, .footer .item
		width: 100%
		min-width: 1300px
		margin: 0 auto
		background: #242424
		border-top: 4px solid $mainColor
	.footer
		min-height: 50px	
		clear: both
		.item
			border: none
			text-align: center
			min-height: 32px
			span
				line-height: 32px
				color: #959595
</style>