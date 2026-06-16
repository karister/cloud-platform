<template>
	<q-checkbox :ref="checkboxRef" id='JsonFormElementCheckBox' :text="text" :checked="!!checked" @clicked="click" :data-key="dataKey" :data-value="dataValue" :enabled="enabled"> </q-checkbox>
	<q-label :openExternalLinks="true" style="margin-left: 20px;" id="JsonFormElementCheckBoxLabel" :visible="lableText" :text='lableText'></q-label>
	<q-view layout="vbox" style="margin-left: 40px;margin-top: 5px;" :visible="!!checked && !!this.$slots.default">
		<slot>
		</slot>
	</q-view>
</template>

<script>
	export default {
		inject: ['getScrollView'],
		data() {
			return {
				checkboxRef: `checkboxRef-${+new Date()}`
			}
		},
		emits: ['sendClick'],
		props: {
			checked: {
				default: false
			},
			enabled: {
				default: true
			},
			dataKey: {
				default: []
			},
			dataValue: {
				default: ''
			},
			lableText: {
				default: ''
			},
			text: {
				default: ''
			},
			checkedValue: {
				default: undefined
			},
			unCheckedValue: {
				default: undefined
			},
			useDefault: {
				default: true
			}
		},
		methods: {
			setFocus() {
				this.$refs[this.checkboxRef].$el.setFocus()
				const scroll = this.getScrollView()
				if(scroll){
					try {
						scroll.$el.scrollTo(this.$refs[this.checkboxRef])
					} catch (error) {
					}
				}
			},
			async click(e) {
				e.target.isCheckBox = true
				if (e.target.checked) {
					if (this.useDefault) {
						e.target.text = e.target.checked
					} else {
						e.target.text = this.checkedValue || ''
					}
				} else {
					if (this.useDefault) {
						e.target.text = e.target.checked
					} else {
						e.target.text = this.unCheckedValue
					}
				}
				this.$emit('sendClick', e);
			}
		}
	}
</script>


<style lang='qss'>
	#JsonFormElementCheckBoxLabel {
		color: @descriptionForeground@;
		font-size: 9pt;
	}

	#JsonFormElementCheckBox {
		color: @settings.checkboxForeground@;
		font-size: 10pt;
		padding: 0;
	}

	#JsonFormElementCheckBox::indicator {
		width: 16px;
		height: 16px;
	}

	#JsonFormElementCheckBox::indicator:unchecked {
		image: url(@icon.folder@checkbox-unchecked.png);
	}

	#JsonFormElementCheckBox::indicator:checked {
		image: url(@icon.folder@checkbox-checked.png);
	}

	#JsonFormElementCheckBox::indicator:disabled {
		image: url(@icon.folder@checkbox-checked-disabled.png);
	}
</style>

<style when="isMac">
	#JsonFormElementCheckBoxLabel {
		font-size: 13pt;
	}

	#JsonFormElementCheckBox {
		font-size: 14pt;
	}
</style>