<template>
	<q-view layout="hbox" layout-spacing="50">
		<CheckBox
			text="arm64-v8a"
			:enabled="false"
			:checked="true"
		/>
		<CheckBox
			text="x86_64（常见于 x86 64 位的 PC 模拟器）"
			:checked="hasX86"
			@sendClick="onCheckBoxClick"
		/>
		<q-view horizontal-size-policy="Expanding" />
	</q-view>
</template>

<script>
const hx = require('hbuilderx')
export default {
	props: ['manifestJson'],
	data() {
		let distribute = this.getDistribute()
		let hasX86 = distribute.deviceArchs.includes('x86_64')
		return {
			hasX86,
		}
	},

	methods: {
		getDistribute() {
			let val = this.manifestJson
			val = val['app-harmony'] = val['app-harmony'] || {}
			val = val['distribute'] = val['distribute'] || {}
			if (!val.deviceArchs) {
				val.deviceArchs = ['arm64-v8a']
			}
			return val
		},
		async onCheckBoxClick(e) {
			this.hasX86 = e.target.checked
			let distribute = this.getDistribute()
			if (this.hasX86) {
				// 勾选
				distribute.deviceArchs = ['arm64-v8a', 'x86_64']
			} else {
				// 去掉勾选
				distribute.deviceArchs = ['arm64-v8a']
			}
			this.$mitt.emit('updateJson', this.manifestJson)
		},
	},
}
</script>

<style lang='qss'>
</style>
