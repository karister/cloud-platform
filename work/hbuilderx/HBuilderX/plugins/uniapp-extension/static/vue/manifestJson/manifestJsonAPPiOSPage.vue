<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width:40px; max-width:40px;"> </q-view>
		<q-view layout="vbox" layout-spacing="10">
			<q-view layout="vbox" layout-spacing="0">
				<Title titleText='iOS App配置' descriptionTitle="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html'>配置指南</a>"></Title>
			</q-view>

			<q-view layout="vbox">
				<!-- 布局使用 -->
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="图标配置"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.iconsIosappstoreDescription' inputLableSubText='' :btnText='i18n.browse'
						:text="manifestJsonValue(formItem.appstore)" :dataKey="formItem.appstore" :errorText="error?.[formItem.appstore.join('.')]"></Input>
				</JsonelementGroup>
			</q-view>


			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="启动界面配置"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensIosStoryBoardTitle'
						inputLableSubText="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#splashscreen'>[详情]</a>" :btnText='i18n.browse'
						:text="manifestJsonValue(formItem.iosStoryboard)" :dataKey="formItem.iosStoryboard" dataFilters="*.zip" :errorText="error?.[formItem.iosStoryboard.join('.')]"></Input>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="可选模块配置"
					descriptionTitle="编译器会 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-modules.html'>[摇树]</a> 自动添加需要的模块，但以下模块需手动选择provider或配置三方SDK参数。">
				</JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-location（定位）"
						lableText="应用中使用定位功能需要配置以下Provider <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#modulesLocation'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniLocation)" :dataKey="formItem.modulesUniLocation">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="系统定位" lableText="由设备厂商提供定位服务（无需商业授权）" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniLocationSystem)" :dataKey="formItem.modulesUniLocationSystem">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="腾讯定位" @sendClick="setVueDataInfo"
							lableText="由<a style='color:#298bdb' href='https://lbs.qq.com/'>[腾讯位置服务]</a>提供定位服务（需商业授权） <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#locationTencent'>[详情]</a>"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniLocationTencent)" :dataKey="formItem.modulesUniLocationTencent">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="key" inputLableSubText="腾讯位置服务后台申请的Key" :text="manifestJsonValue(formItem.modulesUniLocationTencentKey)"
								:dataKey="formItem.modulesUniLocationTencentKey"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-map（地图）" lableText="应用中使用地图功能需配置" @sendClick="setVueDataInfo"
						:checked="manifestJsonValueCheckbox(formItem.modulesUniMap)" :dataKey="formItem.modulesUniMap">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="腾讯地图" @sendClick="setVueDataInfo"
							lableText="由<a style='color:#298bdb' href='https://lbs.qq.com/'>[腾讯位置服务]</a>提供地图功能（需商业授权） <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#mapTencent'>[详情]</a>"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniMapTencent)" :dataKey="formItem.modulesUniMapTencent">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="key" inputLableSubText="腾讯位置服务后台申请的Key" :text="manifestJsonValue(formItem.modulesUniMapTencentKey)"
								:dataKey="formItem.modulesUniMapTencentKey"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-payment（支付）"
						lableText="应用中使用支付功能需配置以下Provider <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#modulesPayment'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniPayment)" :dataKey="formItem.modulesUniPayment">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="支付宝支付" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentAlipay)" :dataKey="formItem.modulesUniPaymentAlipay">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="微信支付"
							lableText="由<a style='color:#298bdb' href='https://open.weixin.qq.com/'>[微信开放平台]</a>提供支付功能。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#paymentWeixin'>[详情]</a>"
							@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentWxpay)" :dataKey="formItem.modulesUniPaymentWxpay">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="APPID" inputLableSubText="微信开放平台申请的应用ID（AppID）" :text="manifestJsonValue(formItem.modulesUniPaymentWxpayAppid)"
								:dataKey="formItem.modulesUniPaymentWxpayAppid"></Input>
							<Input @sendTextChanged="setVueDataInfo" inputLableText="Universal Links" inputLableSubText="通用链接（Universal Links），需与微信开放平台申请应用下配置的“Universal Links”值一致"
								:text="manifestJsonValue(formItem.modulesUniPaymentWxpayUniversalLink)" :dataKey="formItem.modulesUniPaymentWxpayUniversalLink"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-barcode-scanning（相机组件扫码）"
						lableText="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/component/camera.html'>[camera]</a>相机组件支持扫码模式（mode属性设置为scanCode）时需勾选此模块 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#modulesscan'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesuniBarcodeScanning)" :dataKey="formItem.modulesuniBarcodeScanning">
					</CheckBox>
				</JsonelementGroup>
			</q-view>

			<JsonFormTitle titleText="URL Schemes"></JsonFormTitle>

			<JsonelementGroup>
				<Input @sendTextChanged="setVueDataInfo"
					inputLableSubText="注册 URL Scheme 实现在其它App中打开当前App，多个 scheme 使用“,”分割，如：myapp,mytest。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#urlSchemes'>详情</a>"
					:text="manifestJsonValue(formItem.UrlSchemes)" :dataKey="formItem.UrlSchemes" :errorText="error?.[formItem.UrlSchemes.join('.')]">
				</Input>
			</JsonelementGroup>

			<JsonFormTitle titleText="关联域（Associated Domains）"></JsonFormTitle>

			<JsonelementGroup>
				<Input @sendTextChanged="setVueDataInfo2"
					inputLableSubText="用于配置通用链接域名，通用链接域名格式为：applinks:域名，多个域名使用','号分割，例如：applinks:demo.dcloud.net.cn,applinks:demo2.dcloud.net.cn。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#associatedDomains'>详情</a>"
					:text="arrayToString(manifestJsonValue(formItem.associatedDomains))" :dataKey="formItem.associatedDomains" :errorText="error?.[formItem.associatedDomains.join('.')]">
				</Input>
			</JsonelementGroup>

			<JsonFormTitle titleText="应用访问白名单"></JsonFormTitle>

			<JsonelementGroup>
				<Input @sendTextChanged="setVueDataInfo"
					inputLableSubText="允许当前App访问（查询是否安装、直接打开）的其它App白名单列表，填写其它App注册的scheme，多个scheme使用','号分割，例如：BaiduSSO,qqmusic。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#urlschemewhitelist'>详情</a>"
					:text="manifestJsonValue(formItem.urlschemewhitelist)" :dataKey="formItem.urlschemewhitelist" :errorText="error?.[formItem.urlschemewhitelist.join('.')]">
				</Input>
			</JsonelementGroup>

			<JsonFormTitle titleText="后台运行能力"></JsonFormTitle>

			<JsonelementGroup>
				<Input @sendTextChanged="setVueDataInfo"
					inputLableSubText="应用后台播放音乐（audio）、定位（location）等功能，多项使用','号分割，例如：audio,location。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#backgroundModes'>详情</a>"
					:text="manifestJsonValue(formItem.UIBackgroundModes)" :dataKey="formItem.UIBackgroundModes" :errorText="error?.[formItem.UIBackgroundModes.join('.')]">
				</Input>
			</JsonelementGroup>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="隐私信息访问的许可描述"
					descriptionTitle="Appstore审核要求App在调用如下涉及隐私的API时必须说明调用原因，该原因描述会弹框给最终手机用户以便手机用户确认是否给予隐私访问许可。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-ios.html#usageDescription'>详情</a>">
				</JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup v-for="(item) in privacyDescriptionList">
					<Input @sendTextChanged="setVueDataInfo" :inputLableText="item.inputLableText" :inputLableSubText="item.inputLableSubText" :text="manifestJsonValue(item.key)" :dataKey="item.key"
						:errorText="error?.[item.key.join('.')]">
					</Input>
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
					UrlSchemes: ['app-ios', 'distribute', 'urltypes'],
					urlschemewhitelist: ['app-ios', 'distribute', 'urlschemewhitelist'],
					UIBackgroundModes: ['app-ios', 'distribute', 'UIBackgroundModes'],
					associatedDomains: ['app-ios', 'distribute', 'capabilities', 'entitlements', 'com.apple.developer.associated-domains'],
					appstore: ['app-ios', 'distribute', 'icons', 'appstore'],
					iosStoryboard: ['app-ios', 'distribute', 'splashScreens', 'storyboard'],
					modulesUniLocation: ['app-ios', 'distribute', 'modules', 'uni-location'],
					modulesUniLocationSystem: ['app-ios', 'distribute', 'modules', 'uni-location', 'system'],
					modulesUniLocationTencent: ['app-ios', 'distribute', 'modules', 'uni-location', 'tencent'],
					modulesUniLocationTencentKey: ['app-ios', 'distribute', 'modules', 'uni-location', 'tencent', 'key'],
					modulesUniMap: ['app-ios', 'distribute', 'modules', 'uni-map'],
					modulesUniMapTencent: ['app-ios', 'distribute', 'modules', 'uni-map', 'tencent'],
					modulesUniMapTencentKey: ['app-ios', 'distribute', 'modules', 'uni-map', 'tencent', 'key'],
					modulesUniPayment: ['app-ios', 'distribute', 'modules', 'uni-payment'],
					modulesUniPaymentAlipay: ['app-ios', 'distribute', 'modules', 'uni-payment', 'alipay'],
					modulesUniPaymentWxpay: ['app-ios', 'distribute', 'modules', 'uni-payment', 'wxpay'],
					modulesUniPaymentWxpayAppid: ['app-ios', 'distribute', 'modules', 'uni-payment', 'wxpay', 'appid'],
					modulesUniPaymentWxpayUniversalLink: ['app-ios', 'distribute', 'modules', 'uni-payment', 'wxpay', 'universalLink'],
					modulesuniBarcodeScanning: ['app-ios', 'distribute', 'modules', 'uni-barcode-scanning']
				},
				privacyDescriptionList: [{
					inputLableText: '相册-读(NSPhotoLibraryUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSPhotoLibraryUsageDescription']
				}, {
					inputLableText: '相册-写(NSPhotoLibraryAddUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSPhotoLibraryAddUsageDescription']
				}, {
					inputLableText: '摄像头(NSCameraUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSCameraUsageDescription']
				}, {
					inputLableText: '麦克风(NSMicrophoneUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSMicrophoneUsageDescription']
				}, {
					inputLableText: '运行期访问位置(NSLocationWhenInUseUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSLocationWhenInUseUsageDescription']
				}, {
					inputLableText: '后台运行访问位置(NSLocationAlwaysUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSLocationAlwaysUsageDescription']
				}, {
					inputLableText: '访问位置(NSLocationAlwaysAndWhenInUseUsageDescription)',
					inputLableSubText: "iOS11.3及更高版本",
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSLocationAlwaysAndWhenInUseUsageDescription']
				}, {
					inputLableText: '日历(NSCalendarsUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSCalendarsUsageDescription']
				}, {
					inputLableText: '通讯录(NSContactsUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSContactsUsageDescription']
				}, {
					inputLableText: '蓝牙(NSBluetoothPeripheralUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSBluetoothPeripheralUsageDescription']
				}, {
					inputLableText: '蓝牙(NSBluetoothAlwaysUsageDescription)',
					inputLableSubText: "iOS13及更高版本",
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSBluetoothAlwaysUsageDescription']
				}, {
					inputLableText: '系统语音识别(NSSpeechRecognitionUsageDescription)',
					inputLableSubText: "iOS10及更高版本",
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSSpeechRecognitionUsageDescription']
				}, {
					inputLableText: '提醒事项(NSRemindersUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSRemindersUsageDescription']
				}, {
					inputLableText: '运动与健身(NSMotionUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSMotionUsageDescription']
				}, {
					inputLableText: '健康更新(NSHealthUpdateUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSHealthUpdateUsageDescription']
				}, {
					inputLableText: '健康分享(NSHealthShareUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSHealthShareUsageDescription']
				}, {
					inputLableText: '媒体资料库(NSAppleMusicUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSAppleMusicUsageDescription']
				}, {
					inputLableText: '使用NFC(NFCReaderUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NFCReaderUsageDescription']
				}, {
					inputLableText: '访问临床记录(NSHealthClinicalHealthRecordsShareUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSHealthClinicalHealthRecordsShareUsageDescription']
				}, {
					inputLableText: '访问HomeKit数据(NSHomeKitUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSHomeKitUsageDescription']
				}, {
					inputLableText: '访问Siri(NSSiriUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSSiriUsageDescription']
				}, {
					inputLableText: '使用Face ID(NSFaceIDUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSFaceIDUsageDescription']
				}, {
					inputLableText: '访问本地网络(NSLocalNetworkUsageDescription)',
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSLocalNetworkUsageDescription']
				}, {
					inputLableText: '跟踪用户的活动(NSUserTrackingUsageDescription)',
					inputLableSubText: "iOS14及更高版本",
					key: ['app-ios', 'distribute', 'privacyDescription', 'NSUserTrackingUsageDescription']
				}],
				manifestJson: {},
				workspaceFolder: {},
				error: {}
			}
		},
		methods: {
			setVueDataInfo2(e) {
				e.target.text = e.target?.text?.split(',').filter(Boolean)
				this.setVueDataInfo(e)
			},
			arrayToString(arr) {
				try {
					return arr?.join?.(',')
				} catch (err) {
					return arr
				}
			}
		}
	}
</script>


<style lang='qss'>
	* {}
</style>