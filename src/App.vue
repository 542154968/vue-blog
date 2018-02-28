<template>
    <div id="app">
		<v-header ></v-header> 
            <router-view  ></router-view>
        	
        <v-footer ></v-footer>
    </div>
</template>

<script>
	import header from './components/header/header'
	import footer from './components/footer/footer'
	
export default {
    data (){
  	    return {
  	    }
    },
   
    components: {
  	    'v-header': header,
  	    'v-footer': footer,
    }
}
</script>

<style lang="stylus">
	
</style>
