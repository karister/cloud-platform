<template>
	<q-label id="JsonFormPageTitleLabel" :text='titleText'></q-label>
	<q-label :openExternalLinks="true" id="JsonFormPageDescriptionLabel" :visible="descriptionTitle" :text="descriptionTitle"></q-label>
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
	#JsonFormPageTitleLabel {
		font-weight: bold;
		font-size: 14pt;
		color: @settings.headerForeground@;
	}

	#JsonFormPageDescriptionLabel {
		color: @settings.headerDescriptionForeground@;
		font-size: 10pt;
	}
</style>

<style when="isMac">
	#JsonFormPageTitleLabel {
		font-size: 18pt;
	}

	#JsonFormPageDescriptionLabel {
		font-size: 14pt;
	}
</style>