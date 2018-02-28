let base ={
	state: {
		url: 'http://192.168.4.212:8868/',
		// url: 'http://192.168.1.104:8868/',
		type: '',
		boardAt: ''
	},
	mutations: {
	    changeBoardValue (state, val) {
	      state.type = val.text
	      state.boardAt = val.text
	    }
    }
}


export default base
