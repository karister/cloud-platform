<template>
	<q-radio-group layout="hbox" layout-spacing="6">
		<q-radio v-for="(item) in items" id="JsonFormElementRadioButton" :text="item.name" :data-value="item.value" :data-key="dataKey" :checked="`${checkValue == item.value}`" @clicked="setType"></q-radio>
	</q-radio-group>
</template>

<script>
	export default {
		data() {
			return {
				checkValue: this.defaultValue
			}
		},
		emits: ['sendClick'],
		props: {
			defaultValue: {
				default: ''
			},
			dataKey: {
				default: []
			},
			items: {
				default: []
			}
		},
		emits: ['checkChange'],
		methods: {
			setType(e) {
				const v = e.target['data-value']
				e.target.text = v
				this.checkValue  = v
				this.$emit('checkChange', e);
			}
		}
	}
</script>


<style lang='qss'>
	#JsonFormElementRadioButton {
		color: @settings.checkboxForeground@;
		font-size: 10pt;
		padding: 0;
	}
	
	#JsonFormElementRadioButton::indicator:unchecked {
	    image: url(@icon.folder@radio-unchecked.png);
	}
	
	#JsonFormElementRadioButton::indicator:checked {
	    image: url(@icon.folder@radio-checked.png);
	}
	
	#JsonFormElementRadioButton::indicator:disabled {
	    image: url(@icon.folder@radio-checked-disabled.png);
	}
</style>

<style when="isMac">
	#JsonFormElementRadioButton {
		font-size: 14pt;
	}
</style>