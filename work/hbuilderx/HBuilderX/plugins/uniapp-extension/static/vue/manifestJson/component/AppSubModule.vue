<template>
	<JsonelementGroup v-for="(subModule) in subModules">
		<CheckBox :useDefault="false" :checkedValue="checkedDefaultValue(subModule)" unCheckedValue="deleteSelf" :text="`${subModule?.id} ${subModule?.title}`" @sendClick="updateData"
			:checked="manifestJsonValueCheckbox([...dataKey,subModule?.id])" :dataKey="[...dataKey,subModule?.id]">
			<q-view layout="vbox" v-if="subModule.parameters">
				<q-view layout="vbox" v-for="(parameter) in subModule.parameters">
					<Input @sendTextChanged="updateData" :inputLableText="parameter.title" :inputLableSubText="parameter.des" :text="manifestJsonValue([...dataKey,subModule.id,parameter.key])"
						:dataKey="[...dataKey,subModule.id,parameter.key]">
					</Input>
				</q-view>
			</q-view>
			<q-view layout="vbox" v-if="subModule.platforms">
				<q-view layout="vbox" v-if="subModule.showPlatforms">
					<JsonFormItem descriptionTitle="支持的平台（至少选一项）">
						<q-view layout="vbox" layout-spacing="8" id="checkBoxBorder">
							<CheckBox v-for="(platform) in subModule.platforms" :text="platform.platform"
								:checked="manifestJsonValueCheckbox([...dataKey,subModule.id,'__platform__'],platform.platform,true)" :dataKey="[...dataKey,subModule.id,,'__platform__']"
								@sendClick="updateDataCheckbox" :dataValue="platform.platform">
							</CheckBox>
						</q-view>
					</JsonFormItem>
				</q-view>
				<q-view layout="vbox" layout-spacing="0" v-for="(platform) in subModule.platforms">
					<q-view layout="vbox" layout-spacing="0" v-for="(platformParameter) in platform.parameters">
						<Input @sendTextChanged="updateData" :inputLableText="platformParameter.title" :inputLableSubText="platformParameter.des"
							:text="manifestJsonValue([...dataKey,subModule.id,platformParameter.key])" :dataKey="[...dataKey,subModule.id,platformParameter.key]">
						</Input>
					</q-view>
				</q-view>
			</q-view>
			<q-view layout="vbox">
				<AppSubModule v-if="subModule.subModules && subModule.subModules.length" @setVueDataInfo="updateData" :subModules="subModule.subModules" :manifestJson="manifestJson"
					:dataKey="[...dataKey,subModule.id]" />
			</q-view>
		</CheckBox>
	</JsonelementGroup>
</template>


<script>
	export default {
		data() {
			return {}
		},
		computed: {
			checkedDefaultValue() {
				return (subModules) => {
					if (subModules.showPlatforms) {
						return {
							__platform__: subModules.__platform__
						}
					}
					return {}
				}
			}
		},
		emits: ['setVueDataInfo', 'setVueDataInfoCheckBoxArray'],
		props: ['subModules', 'manifestJson', 'dataKey'],
		methods: {
			updateData(e) {
				this.$emit('setVueDataInfo', e);
			},
			updateDataCheckbox(e) {
				this.$emit('setVueDataInfoCheckBoxArray', e);
			},

		},
		mounted() {},
	}
</script>


<style lang='qss'>

</style>