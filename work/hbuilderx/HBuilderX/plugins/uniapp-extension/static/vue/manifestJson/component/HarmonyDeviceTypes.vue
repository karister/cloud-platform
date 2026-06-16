<template>
	<q-view layout="hbox" layout-spacing="20">
		<CheckBox
			v-for="type in Object.keys(allTypes)"
			:text="allTypes[type]"
			:checked="deviceTypes.includes(type)"
			:dataKey="type"
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
		let allTypes = {
			phone: '手机',
			tablet: '平板',
			'2in1': 'PC/2in1',
			tv: '智慧屏',
			wearable: '智能手表',
			car: '车机',
		}
		let distribute = this.getDistribute()
		let deviceTypes = [...distribute.deviceTypes]
		return {
			allTypes,
			deviceTypes,
		}
	},

	methods: {
		getDistribute() {
			let val = this.manifestJson
			val = val['app-harmony'] = val['app-harmony'] || {}
			val = val['distribute'] = val['distribute'] || {}
			if (!val.deviceTypes) {
				val.deviceTypes = ['phone']
			}
			return val
		},
		async onCheckBoxClick(e) {
			let type = e.target["data-key"]
			let distribute = this.getDistribute()
			let index = distribute.deviceTypes.indexOf(type)
			if (e.target.checked) {
				// 勾选
				if (index < 0) {
					distribute.deviceTypes.push(type)
					this.deviceTypes = [...distribute.deviceTypes]
				}
			} else {
				// 去掉勾选
				if (index >= 0) {
					distribute.deviceTypes.splice(index, 1)
					this.deviceTypes = [...distribute.deviceTypes]
					// 保留至少一个勾选
					if (distribute.deviceTypes.length == 0) {
						await this.updateUi()
						distribute.deviceTypes.push(type)
						this.deviceTypes = [...distribute.deviceTypes]
						await this.updateUi()
					}
				}
			}
			this.$mitt.emit('updateJson', this.manifestJson)
		},
	},
}
</script>

<style lang='qss'>
</style>
