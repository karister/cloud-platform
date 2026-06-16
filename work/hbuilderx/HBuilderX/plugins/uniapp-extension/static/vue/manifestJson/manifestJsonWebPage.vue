<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width: 40px;max-width: 40px"> </q-view>
		<q-view layout="vbox" layout-spacing="10">

			<q-view layout="vbox" layout-spacing="0">
				<Title :titleText="i18n.webConfig" :descriptionTitle="i18n.webConfigSubTitle"></Title>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.title.title']" :inputLableSubText="i18n['properties.h5.properties.title.description']"
						:text="manifestJsonValue(formItem.title)" :dataKey="formItem.title" :errorText="error?.[formItem.title.join('.')]"></Input>
				</JsonelementGroup>

<!-- 				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnTemplateClick" :inputLableText="i18n['properties.h5.properties.template.title']" :btnText='i18n.browse'
						:inputLableSubText="i18n['properties.h5.properties.template.description']" :text="manifestJsonValue(formItem.template)" :dataKey="formItem.template" :errorText="error?.[formItem.template.join('.')]"></Input>
				</JsonelementGroup> -->

				<JsonelementGroup>
					<Select :items="routerItems" placeholderText="请选择路由模式" @editTextChanged="setVueDataInfo" :editable="false" :currentText="manifestJsonValue(formItem.routerMode)"
						@currentIndexChanged="setVueDataInfo" :dataKey="formItem.routerMode" :inputLableText="i18n['properties.h5.properties.router.properties.mode.title']"
						:inputLableSubText="i18n['properties.h5.properties.router.properties.mode.description']"></Select>
				</JsonelementGroup>

				<JsonelementGroup>
					<Input ref="web.router.base" @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.router.properties.base.title']"
						:inputLableSubText="i18n['properties.h5.properties.router.properties.base.description']" :text="manifestJsonValue(formItem.routerBase)" :dataKey="formItem.routerBase" :errorText="error?.[formItem.routerBase.join('.')]"></Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.h5.properties.devserver.properties.https.title']" :checked="manifestJsonValueCheckbox(formItem.devServerHttps)"
						:dataKey="formItem.devServerHttps" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<Input ref="web.devServer.port" @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.devserver.properties.port.title']"
						:inputLableSubText="i18n['properties.h5.properties.devserver.properties.port.description']" :text="manifestJsonValue(formItem.devServerPort)" :dataKey="formItem.devServerPort" :errorText="error?.[formItem.devServerPort.join('.')]"></Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.h5.properties.optimization.properties.treeshaking.properties.enable.title']"
						:checked="manifestJsonValue(formItem.optimizationTreeShaking)" :dataKey="formItem.optimizationTreeShaking"
						:lableText="i18n['properties.h5.properties.optimization.properties.treeshaking.properties.enable.description']" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.moduleuni-push.title']" :checked="manifestJsonValue(formItem.unipush)" :dataKey="formItem.unipush"
						:lableText="i18n['properties.module.uni-push.description']" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['properties.h5.properties.sdkconfigs.properties.maps.title']"
					:descriptionTitle="i18n['properties.h5.properties.sdkconfigs.properties.maps.description']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="manifestJsonValue(formItem.mapsTencent)" unCheckedValue="deleteParent"
						:text="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.qqmap.title']" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.mapsTencent)" :dataKey="formItem.mapsTencent">
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.qqmap.properties.key.title']"
							:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.qqmap.properties.key.description']"
							:text="manifestJsonValue(formItem.mapsTencent)" :dataKey="formItem.mapsTencent"
							:errorText="error?.[formItem.mapsTencent.join('.')]"></Input>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="manifestJsonValue(formItem.mapsGoogle)" unCheckedValue="deleteParent"
						:text="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.title']" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.mapsGoogle)" :dataKey="formItem.mapsGoogle">
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.properties.key.title']"
							:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.google.properties.key.description']"
							:text="manifestJsonValue(formItem.mapsGoogle)" :dataKey="formItem.mapsGoogle"
							:errorText="error?.[formItem.mapsGoogle.join('.')]"></Input>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="manifestJsonValue(formItem.mapsAmap)" unCheckedValue="deleteParent"
						:text="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.title']" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.mapsAmap)" :dataKey="formItem.mapsAmap">
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.key.title']"
							:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.key.description']"
							:text="manifestJsonValue(formItem.mapsAmap)" :dataKey="formItem.mapsAmap"
							:errorText="error?.[formItem.mapsAmap.join('.')]"></Input>
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.securityJsCode.title']"
							:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.securityJsCode.description']"
							:text="manifestJsonValue(formItem.mapsAmapSecurityJsCode)" :dataKey="formItem.mapsAmapSecurityJsCode"
							:errorText="error?.[formItem.mapsAmapSecurityJsCode.join('.')]"></Input>
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.serviceHost.title']"
							:inputLableSubText="i18n['properties.h5.properties.sdkconfigs.properties.maps.properties.amap.properties.serviceHost.description']"
							:text="manifestJsonValue(formItem.mapsAmapServiceHost)" :dataKey="formItem.mapsAmapServiceHost"
							:errorText="error?.[formItem.mapsAmapServiceHost.join('.')]"></Input>
					</CheckBox>
				</JsonelementGroup>
			</q-view>
			<q-view vertical-size-policy="Expanding"></q-view>
		</q-view>
		<q-view layout="vbox" style="min-width:40px; max-width:40px;"> </q-view>
	</NavigationScrollView>
</template>

<script>
	export default {
		data() {
			return {
				formItem: {
					title: ['web', 'title'],
					template: ['web', 'template'],
					routerMode: ['web','router','mode'],
					routerBase: ['web','router','base'],
					devServerHttps: ['web','devServer','https'],
					devServerPort: ['web','devServer','port'],
					optimizationTreeShaking: ['web','optimization','treeShaking','enable'],
					unipush: ['web','unipush','enable'],
					mapsTencent: ['web','sdkConfigs','maps','tencent','key'],
					mapsGoogle: ['web','sdkConfigs','maps','google','key'],
					mapsAmap: ['web','sdkConfigs','maps','amap','key'],
					mapsAmapSecurityJsCode: ['web','sdkConfigs','maps','amap','securityJsCode'],
					mapsAmapServiceHost: ['web','sdkConfigs','maps','amap','serviceHost'],
				},
				manifestJson: {},
				workspaceFolder: {},
				error: {},
				routerItems: [{
						label: 'hash',
						data: "hash",
					},
					{
						label: 'history',
						data: "history"
					},
				]
			}
		},
		methods: {}
	}
</script>

<style lang='qss'>
	* {}
</style>