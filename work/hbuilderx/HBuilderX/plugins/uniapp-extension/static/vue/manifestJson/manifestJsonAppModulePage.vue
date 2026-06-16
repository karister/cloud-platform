<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width:40px; max-width:40px;"> </q-view>
		<q-view layout="vbox" layout-spacing="15">
			<Tab :platfroms="platfroms">
				<template v-for="(platfrom) in platfroms" v-slot:[platfrom.name]>
					<q-view layout="hbox" layout-spacing="20">
						<JsonFormTitle :titleText="`${platfrom.name}-云打包强制包含的模块`"></JsonFormTitle>
						<q-view horizontal-size-policy="Expanding"></q-view>
						<Button btnText="添加模块" @sendBtnclick="settingClick(platfrom)"></Button>
					</q-view>
					<q-view layout="vbox" layout-spacing="8">
						<!-- 已包含模块 -->
						<SubTitle :titleText="`${platfrom.name}-模块A`"></SubTitle>
						<SubTitle :titleText="`${platfrom.name}-模块B`"></SubTitle>
					</q-view>
					<JsonFormTitle titleText="内置组件和API涉及的三方SDK配置"></JsonFormTitle>
					<q-view layout="vbox" layout-spacing="8">
						<JsonelementGroup>
							<CheckBox :useDefault="false" :checkedValue="manifestJsonValue(['web','sdkConfigs','maps','google','key'])" unCheckedValue="deleteParent"
								:text="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.title']" @sendClick="setVueDataInfo"
								:checked="manifestJsonValueCheckbox(['web','sdkConfigs','maps','google','key'])" :dataKey="['web','sdkConfigs','maps','google','key']">
								<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.properties.key.title']"
									:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.properties.key.description']"
									:text="manifestJsonValue(['web','sdkConfigs','maps','google','key'])" :dataKey="['web','sdkConfigs','maps','google','key']"
									:errorText="error?.['web.sdkConfigs.maps.google.key']"></Input>
							</CheckBox>
						</JsonelementGroup>
					</q-view>
				</template>
			</Tab>
			<q-view vertical-size-policy="Expanding"></q-view>
		</q-view>
		<q-view layout="vbox" style="min-width:40px; max-width:40px;"> </q-view>
	</NavigationScrollView>
</template>

<script>
	export default {
		data() {
			return {
				manifestJson: {},
				workspaceFolder: {},
				error: {},
				platfroms: [{
						name: 'Android',
						modules: [{
							id:'uni-canvas-a',
							name: '模块A'
						}, {
							id:'uni-canva-b',
							name: '模块B'
						}]
					},
					{
						name: 'iOS'
					},
					{
						name: 'Harmony'
					},
				]
			}
		},
		computed: {

		},
		methods: {
			async settingClick(platform) {
				await this.$mitt.emit('showModeulsDialog', {
					platform
				})
			}
		}
	}
</script>


<style lang='qss'>
</style>