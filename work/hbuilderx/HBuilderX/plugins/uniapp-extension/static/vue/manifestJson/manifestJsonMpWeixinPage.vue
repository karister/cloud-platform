<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width: 40px;max-width: 40px"> </q-view>
		<q-view layout="vbox" layout-spacing="10">

			<q-view layout="vbox" layout-spacing="0">
				<Title :titleText='i18n.mpWeixinConfig' :descriptionTitle="i18n.mpWeixinConfigSubTitle"></Title>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input ref="mp-weixin.appid" @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.mp-weixin.properties.appid.title']"
						:text="manifestJsonValue(formItem.appid)" :dataKey="formItem.appid" :errorText="error?.[formItem.appid.join('.')]"></Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.mp-weixin.properties.setting.properties.es6.title']" :checked="manifestJsonValue(formItem.es6)"
						:dataKey="formItem.es6" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.mp-weixin.properties.setting.properties.postcss.title']" :checked="manifestJsonValue(formItem.postcss)"
						:dataKey="formItem.postcss" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.mp-weixin.properties.setting.properties.minified.title']" :checked="manifestJsonValue(formItem.minified)"
						:dataKey="formItem.minified" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :text="i18n['properties.mp-weixin.properties.setting.properties.urlcheck.title']" :checked="manifestJsonValue(formItem.urlCheck)"
						:dataKey="formItem.urlCheck" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['mp-weixin.permission.title']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :useDefault="false" checkedValue="" unCheckedValue="deleteParent" :text="i18n['properties.mp-weixin.properties.permission.properties.scope.userlocation.title']"
						:checked="manifestJsonValueCheckbox(formItem.userLocation)" :dataKey="formItem.userLocation"
						@sendClick="setVueDataInfo">
						<Input @sendTextChanged="setVueDataInfo" :inputLableText="i18n['properties.mp-weixin.properties.permission.properties.scope.userlocation.properties.desc.title']"
							:inputLableSubText="i18n['properties.mp-weixin.properties.permission.properties.scope.userlocation.properties.desc.description']"
							:text="manifestJsonValue(formItem.userLocation)" :dataKey="formItem.userLocation"
							:errorText="error?.[formItem.userLocation.join('.')]"></Input>
					</CheckBox>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['mp-weixin.moduleConfigure.title']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :text="i18n['properties.moduleuni-push.title']" :checked="manifestJsonValue(formItem.unipush)" :dataKey="formItem.unipush"
						:lableText="i18n['properties.module.uni-push.description']" @sendClick="setVueDataInfo">
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :text="i18n['properties.properties.secureNetwork.properties.enable.title']" :checked="manifestJsonValue(formItem.secureNetwork)"
						:dataKey="formItem.secureNetwork" :lableText="i18n['properties.properties.secureNetwork.properties.enable.description']" @sendClick="setVueDataInfo">
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
					appid: ['mp-weixin', 'appid'],
					es6: ['mp-weixin', 'setting', 'es6'],
					postcss: ['mp-weixin', 'setting', 'postcss'],
					minified: ['mp-weixin', 'setting', 'minified'],
					urlCheck: ['mp-weixin', 'setting', 'urlCheck'],
					userLocation: ['mp-weixin', 'permission', 'scope.userLocation', 'desc'],
					unipush: ['mp-weixin', 'unipush', 'enable'],
					secureNetwork: ['mp-weixin', 'secureNetwork', 'enable']
				},
				manifestJson: {},
				workspaceFolder: {},
				error: {}
			}
		}
	}
</script>

<style lang='qss'>
	* {}
</style>