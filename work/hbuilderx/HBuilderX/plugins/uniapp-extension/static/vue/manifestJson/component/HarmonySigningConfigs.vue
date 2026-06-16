<template>
	<q-view layout="hbox">
		<q-view layout="hbox">
			<q-label id="JsonFormTitleLabel" :text="defaultConfig" style="margin-left:10px" />
			<q-button id="QPushButton" text='配置' @clicked="onBtnDefaultConfig" horizontal-size-policy="Maximum" />
			<q-label id="JsonFormTitleLabel" :text="releaseConfig" style="margin-left:20px" />
			<q-button id="QPushButton" text='配置' @clicked="onBtnReleaseConfig" horizontal-size-policy="Maximum" />
			<q-view horizontal-size-policy="Preferred" stretch-factor="1" />
		</q-view>
	</q-view>
</template>

<script>
const hx = require('hbuilderx')
export default {
	props: ['manifestJson'],
	data() {
		return {
		}
	},

	inject: ['projectPath', 'app-harmony'],

	computed: {
		defaultConfig() {
			return this.manifestJson?.['app-harmony']?.distribute.signingConfigs?.default ? '调试证书已配置' : '调试证书未配置'
		},
		releaseConfig() {
			return this.manifestJson?.['app-harmony']?.distribute.signingConfigs?.release ? '发布证书已配置' : '发布证书未配置'
		},
	},

	methods: {
		async onBtnDefaultConfig() {
			let projectPath = this.projectPath
			let { showHarmonySigningConfigsDialog } = this['app-harmony']
			showHarmonySigningConfigsDialog({
				projectPath,
				certType: 'default'
			})
		},
		async onBtnReleaseConfig() {
			let projectPath = this.projectPath
			let { showHarmonySigningConfigsDialog } = this['app-harmony']
			showHarmonySigningConfigsDialog({
				projectPath,
				certType: 'release'
			})
		},
	},
}
</script>

<style lang='qss'>
</style>
