<template>
	<div class="eg">
		<div>例子</div>
		<router-link to = "book">book</router-link>
		<router-link to = "music">music</router-link>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data (){
			return {}
		}
		
	}
</script>

<style lang="stylus" >
	.eg
		margin-top: 200px
	.router-link-active
		color: red
</style>