<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width: 40px;max-width: 40px"> </q-view>
		<q-view layout="vbox" layout-spacing="10">

			<q-view layout="vbox" layout-spacing="0">
				<Title :titleText='i18n.appHarmonyConfig' descriptionTitle="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-harmony.html'>配置指南</a>"></Title>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input ref="app-harmony.distribute.bundleName" @sendTextChanged="setVueDataInfo" inputLableText='包名' :text="manifestJsonValue(formItem.bundleName)" :dataKey="formItem.bundleName"
						:errorText="error?.[formItem.bundleName.join('.')]">></Input>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="'支持的设备类型'"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<HarmonyDeviceTypes :manifestJson="manifestJson" />
				</JsonelementGroup>
			</q-view>

			<q-view v-if="isDom2" layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="'支持的 CPU 类型'" descriptionTitle="此处设置仅用于发行打包，调试运行时会根据连接的设备自动调整"></JsonFormTitle>
			</q-view>

			<q-view v-if="isDom2" layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<HarmonyDeviceArchs :manifestJson="manifestJson" />
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle
					titleText="targetSdkVersion"
					:descriptionTitle="i18n['properties.app-harmony.distribute.targetSdkVersion.description']"
				/>
			</q-view>
			<JsonelementGroup>
				<Input
					@sendTextChanged="setVueDataInfo"
					:placeholderText="placeholderTargetSdkVersion"
					:text="manifestJsonValue(formItem.targetSdkVersion)"
					:dataKey="formItem.targetSdkVersion"
					:removeEmpty="true"
					:errorText="targetSdkVersionError"
				/>
			</JsonelementGroup>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle
					titleText="compatibleSdkVersion"
					:descriptionTitle="i18n['properties.app-harmony.distribute.compatibleSdkVersion.description']"
				/>
			</q-view>
			<JsonelementGroup>
				<Input
					@sendTextChanged="setVueDataInfo"
					:placeholderText="placeholderCompatibleSdkVersion"
					:text="manifestJsonValue(formItem.compatibleSdkVersion)"
					:dataKey="formItem.compatibleSdkVersion"
					:removeEmpty="true"
					:errorText="compatibleSdkVersionError"
				/>
			</JsonelementGroup>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['app-harmonyDistributeCertSignatureGuideTitle']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<HarmonySigningConfigs :manifestJson="manifestJson" />
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['properties.app-harmony.distribute.icons.title']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText="i18n['properties.app-harmony.distribute.icons.foreground.title']" :btnText='i18n.browse'
						:inputLableSubText="i18n['properties.app-harmony.distribute.icons.foreground.description']" :text="manifestJsonValue(formItem.foreground)" :dataKey="formItem.foreground"
						:errorText="error?.[formItem.foreground.join('.')]">></Input>
				</JsonelementGroup>
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText="i18n['properties.app-harmony.distribute.icons.background.title']" :btnText='i18n.browse'
						:inputLableSubText="i18n['properties.app-harmony.distribute.icons.background.description']" :text="manifestJsonValue(formItem.background)" :dataKey="formItem.background"
						:errorText="error?.[formItem.background.join('.')]">></Input>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle :titleText="i18n['properties.app-harmony.distribute.splashScreens.title']"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText="i18n['properties.app-harmony.distribute.splashScreens.startWindowBackground.title']"
						:btnText='i18n.browse' :inputLableSubText="i18n['properties.app-harmony.distribute.splashScreens.startWindowBackground.description']"
						:text="manifestJsonValue(formItem.startWindowBackground)" :dataKey="formItem.startWindowBackground" :errorText="error?.[formItem.startWindowBackground.join('.')]">>
					</Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText="i18n['properties.app-harmony.distribute.splashScreens.startWindowIcon.title']"
						:btnText='i18n.browse' :inputLableSubText="i18n['properties.app-harmony.distribute.splashScreens.startWindowIcon.description']"
						:text="manifestJsonValue(formItem.startWindowIcon)" :dataKey="formItem.startWindowIcon" :errorText="error?.[formItem.startWindowIcon.join('.')]">></Input>
				</JsonelementGroup>
			</q-view>
			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="可选模块配置" descriptionTitle="编译器会 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-modules.html'>[摇树]</a> 自动添加需要的模块，但以下模块需手动选择provider或配置三方SDK参数。"></JsonFormTitle>
			</q-view>
			<q-view layout="vbox" layout-spacing="0">
<!-- 				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-facialVerify（实人认证）"
						:lableText="`金融级实人认证，身份证和人脸活体匹配检测 <a style='color:#298bdb' href='hxsso2:://https://dev.dcloud.net.cn/auth/dcloud/callback?return_url=https%25253A%25252F%25252Fdev.dcloud.net.cn%25252Funicloud%25252Fauth%25253Faction%25253Dfrv%252526appid%25253D${manifestJson.appid}'>[开通配置]</a> <a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/uniCloud/frv/intro.html'>[实人认证配置指南]</a>`"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniFacialRecognitionVerify)" :dataKey="formItem.modulesUniFacialRecognitionVerify">
					</CheckBox>
				</JsonelementGroup -->>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-location（定位）"
						lableText="在鸿蒙应用中使用定位功能需配置此模块 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/api/get-location.html'>[定位配置指南]</a>" @sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniLocation)" :dataKey="formItem.modulesUniLocation">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="系统定位" lableText="由手机厂商提供定位服务（无需商业授权）" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniLocationSystem)" :dataKey="formItem.modulesUniLocationSystem">
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-map（地图）"
						lableText="在鸿蒙应用中使用地图组件需配置此模块 <a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-maps.html'>[地图配置指南]</a>" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.modulesUniMap)" :dataKey="formItem.modulesUniMap">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="腾讯地图" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniMapTencent)" :dataKey="formItem.modulesUniMapTencent">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="key"
								inputLableSubText="腾讯地图应用key，腾讯地图在鸿蒙端使用WebService方式实现，申请key时需注意勾选WebServiceAPI，<a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/component/map.html'>[详情]</a>"
								:text="manifestJsonValue(formItem.modulesUniMapTencentKey)" :dataKey="formItem.modulesUniMapTencentKey"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-oauth（登录鉴权）"
						lableText="在鸿蒙应用中使用登录功能需配置此模块 <a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-oauth.html'>[登录鉴权配置指南]</a>" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.modulesUniOauth)" :dataKey="formItem.modulesUniOauth">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="华为登录" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniOauthHuawei)" :dataKey="formItem.modulesUniOauthHuawei">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="client_id"
								inputLableSubText="华为的 client_id，<a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-oauth-huawei.html'>[详情]</a>"
								:text="manifestJsonValue(formItem.modulesUniOauthHuaweiClientId)" :dataKey="formItem.modulesUniOauthHuaweiClientId"></Input>
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="微信登录" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniOauthWeixin)" :dataKey="formItem.modulesUniOauthWeixin">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="appid"
								inputLableSubText="微信登录的appid，<a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-oauth-weixin.html'>[详情]</a>"
								:text="manifestJsonValue(formItem.modulesUniOauthWeixinAppid)" :dataKey="formItem.modulesUniOauthWeixinAppid"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-payment（支付）"
						lableText="在鸿蒙应用中使用支付功能需配置此模块 <a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-payment.html'>[支付配置指南]</a>" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.modulesUniPayment)" :dataKey="formItem.modulesUniPayment">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="支付宝支付" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentAlipay)" :dataKey="formItem.modulesUniPaymentAlipay">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="微信支付" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentWxpay)" :dataKey="formItem.modulesUniPaymentWxpay">
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>

				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-share（分享）"
						lableText="在鸿蒙应用中使用分享功能需配置此模块 <a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-share.html'>[分享配置指南]</a>" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.modulesUniShare)" :dataKey="formItem.modulesUniShare">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="微信分享" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniShareWeixin)" :dataKey="formItem.modulesUniShareWeixin">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="appid"
								inputLableSubText="微信登录的appid，<a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/tutorial/app-oauth-weixin.html'>[详情]</a>"
								:text="manifestJsonValue(formItem.modulesUniShareWeixinAppid)" :dataKey="formItem.modulesUniShareWeixinAppid"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
<!-- 				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-push（支持全端的消息推送服务）"
						:lableText="`<b> uniPush是DCloud联合个推公司推出的集成性统一推送服务，使用前需 </b><a style='color:#298bdb' href='hxhttps://dev.dcloud.net.cn/uni/push?appid=${manifestJson.appid}&type=0&token=\${token}&v=2.0'>[申请开通]</a>`"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniPush)" :dataKey="formItem.modulesUniPush">
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-verify（一键登录）"
						lableText="用户无需输入手机号，无需短信验证，免密一键登录 <a style='color:#298bdb' href='https://unicloud.dcloud.net.cn/pages/uni-login/app-config'>[开通配置]</a> <a style='color:#298bdb' href='https://uniapp.dcloud.io/univerify'>[一键登录配置指南]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniVerify)" :dataKey="formItem.modulesUniVerify">
					</CheckBox>
				</JsonelementGroup> -->
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="<a style='color:#298bdb' href=https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#permission>权限配置指南</a>"></JsonFormTitle>
			</q-view>
			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="<a style='color:#298bdb' href=https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#moreconfig>更多配置指南</a>"></JsonFormTitle>
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
					bundleName: ['app-harmony', 'distribute', 'bundleName'],
					foreground: ['app-harmony', 'distribute', 'icons', 'foreground'],
					background: ['app-harmony', 'distribute', 'icons', 'background'],
					startWindowBackground: ['app-harmony', 'distribute', 'splashScreens', 'startWindowBackground'],
					startWindowIcon: ['app-harmony', 'distribute', 'splashScreens', 'startWindowIcon'],
					modulesUniMap: ['app-harmony', 'distribute', 'modules', 'uni-map'],
					modulesUniMapTencent: ['app-harmony', 'distribute', 'modules', 'uni-map', 'tencent'],
					modulesUniMapTencentKey: ['app-harmony', 'distribute', 'modules', 'uni-map', 'tencent', 'key'],
					// modulesUniVerify: ['app-harmony', 'distribute', 'modules', 'uni-verify'],
					modulesUniOauth: ['app-harmony', 'distribute', 'modules', 'uni-oauth'],
					modulesUniOauthHuawei: ['app-harmony', 'distribute', 'modules', 'uni-oauth', 'huawei'],
					modulesUniOauthHuaweiClientId: ['app-harmony', 'distribute', 'modules', 'uni-oauth', 'huawei', 'client_id'],
					modulesUniOauthWeixin: ['app-harmony', 'distribute', 'modules', 'uni-oauth', 'weixin'],
					modulesUniOauthWeixinAppid: ['app-harmony', 'distribute', 'modules', 'uni-oauth', 'weixin', 'appid'],
					modulesUniPayment: ['app-harmony', 'distribute', 'modules', 'uni-payment'],
					modulesUniPaymentAlipay: ['app-harmony', 'distribute', 'modules', 'uni-payment', 'alipay'],
					modulesUniPaymentWxpay: ['app-harmony', 'distribute', 'modules', 'uni-payment', 'wxpay'],
					modulesUniShare: ['app-harmony', 'distribute', 'modules', 'uni-share'],
					modulesUniShareWeixin: ['app-harmony', 'distribute', 'modules', 'uni-share', 'weixin'],
					modulesUniShareWeixinAppid: ['app-harmony', 'distribute', 'modules', 'uni-share', 'weixin', 'appid'],
					// modulesUniPush: ['app-harmony', 'distribute', 'modules', 'uni-push'],
					// modulesUniFacialRecognitionVerify: ['app-harmony', 'distribute', 'modules', 'uni-facialVerify'],
					modulesUniLocation: ['app-harmony', 'distribute', 'modules', 'uni-location'],
					modulesUniLocationSystem: ['app-harmony', 'distribute', 'modules', 'uni-location', 'system'],
					targetSdkVersion: ['app-harmony', 'distribute', 'targetSdkVersion'],
					compatibleSdkVersion: ['app-harmony', 'distribute', 'compatibleSdkVersion'],
				},
				manifestJson: {},
				workspaceFolder: {},
				error: {}
			}
		},
		computed: {
			isDom2() {
				return !!(this.manifestJson['uni-app-x']?.vapor)
			},

			placeholderTargetSdkVersion() {
				return this.i18n['properties.app-harmony.distribute.targetSdkVersion.placeholder']
			},
			targetSdkVersionError() {
				let v = this.manifestJsonValue(this.formItem.targetSdkVersion)
				if (v.length == 0) return ''
				let m = v.match(/^\d\.\d\.\d\((\d+)\)$/)
				if (!m) return this.i18n['properties.app-harmony.distribute.targetSdkVersion.error-format']
				return ''
			},

			placeholderCompatibleSdkVersion() {
				return this.isDom2
					? this.i18n['properties.app-harmony.distribute.compatibleSdkVersion.placeholder-vapor']
					: this.i18n['properties.app-harmony.distribute.compatibleSdkVersion.placeholder']
			},
			compatibleSdkVersionError() {
				let v = this.manifestJsonValue(this.formItem.compatibleSdkVersion)
				if (v.length == 0) return ''
				let m = v.match(/^\d\.\d\.\d\((\d+)\)$/)
				if (!m) return this.i18n['properties.app-harmony.distribute.compatibleSdkVersion.error-format']
				if (this.isDom2) {
					if (m[1] < 20) return this.i18n['properties.app-harmony.distribute.compatibleSdkVersion.error-min-vapor']
				} else {
					if (m[1] < 13) return this.i18n['properties.app-harmony.distribute.compatibleSdkVersion.error-min']
				}
				return ''
			}
		}
	}
</script>

<style lang='qss'>
	* {}
</style>