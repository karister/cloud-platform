<template>
	<q-label id="JsonFormSubTitleLabel" :visible="!!titleText" :text="titleText"></q-label>
	<q-label  :wordWrap="true" :openExternalLinks="true" id="JsonFormSubDescriptionLabel" :visible="!!descriptionTitle" :text='descriptionTitle'></q-label>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			titleText: {
				default: ''
			},
			descriptionTitle: {
				default: ''
			}
		}
	}
</script>

<style lang='qss'>
	#JsonFormSubTitleLabel {
		color: @settings.checkboxForeground@;
		font-size: 10pt;
		padding: 0;
	}

	#JsonFormSubDescriptionLabel {
		color: @descriptionForeground@;
		font-size: 9pt;
	}
</style>

<style when="isMac">
	#JsonFormSubTitleLabel {
		font-size: 14pt;
	}

	#JsonFormSubDescriptionLabel {
		font-size: 13pt;
	}
</style>