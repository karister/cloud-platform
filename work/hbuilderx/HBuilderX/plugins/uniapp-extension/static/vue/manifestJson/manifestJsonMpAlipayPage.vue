<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width: 40px;max-width: 40px"> </q-view>
		<q-view layout="vbox" layout-spacing="10">

			<q-view layout="vbox" layout-spacing="0">
				<Title titleText='支付宝小程序配置' descriptionTitle="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest.html#manifest-mp-alipay'>配置指南</a>"></Title>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input ref="mp-alipay.appid" @sendTextChanged="setVueDataInfo" inputLableText="支付宝小程序AppID"
						:text="manifestJsonValue(formItem.appid)" :dataKey="formItem.appid" :errorText="error?.[formItem.appid.join('.')]"></Input>
				</JsonelementGroup>
			</q-view>
			
			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="模块配置"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :text="i18n['properties.moduleuni-push.title']" :checked="manifestJsonValue(formItem.unipush)" :dataKey="formItem.unipush"
						:lableText="i18n['properties.module.uni-push.description']" @sendClick="setVueDataInfo">
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
					appid: ['mp-alipay', 'appid'],
					unipush: ['mp-alipay', 'unipush', 'enable'],
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