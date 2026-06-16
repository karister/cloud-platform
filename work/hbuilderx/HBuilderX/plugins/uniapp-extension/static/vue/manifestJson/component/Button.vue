<template>
	<q-button :visible="btnText" id="Button" horizontal-size-policy="Preferred" vertical-size-policy="Preferred" :enabled='enabled' :text='btnText' @clicked="btnClick"
		:data-key="dataKey"></q-button>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		emits: ['sendBtnclick'],
		props: {
			dataKey: {
				default: []
			},
			btnText: {
				default: ''
			},
			enabled: {
				default: true
			}

		},
		methods: {
			async btnClick(e) {
				this.$emit('sendBtnclick', e);
			}
		},
	}
</script>

<style lang='qss'>
	#Button {
		color: @button.foreground@;
		background-color: @button.background@;
		border: none;
		padding: 5px 10px 5px 10px;
		font-size: 10pt;
	}

	#Button:hover {
		background-color: @button.hoverBackground@;
	}
</style>


<style when="isMac">
	#Button {
		font-size: 14pt;
	}
</style>