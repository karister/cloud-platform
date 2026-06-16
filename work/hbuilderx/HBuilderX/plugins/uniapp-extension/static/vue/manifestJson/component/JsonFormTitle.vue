<template>
	<q-label :openExternalLinks="true" id="JsonFormTitle" :text="titleText"></q-label>
	<q-label :wordWrap="true" :openExternalLinks="true" id="JsonFormDescriptionLabel" :visible="!!descriptionTitle" :text="descriptionTitle"></q-label>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: ['titleText', 'descriptionTitle']
	}
</script>

<style lang='qss'>
	#JsonFormTitle {
		color: @settings.checkboxForeground@;
		font-weight: bold;
		font-size: 11pt;
	}

	#JsonFormDescriptionLabel {
		color: @descriptionForeground@;
		font-size: 9pt;
	}
</style>
<style when="isMac">
	#JsonFormTitle {
		font-size: 15pt;
	}
	
	#JsonFormDescriptionLabel {
		font-size: 13pt;
	}
</style>