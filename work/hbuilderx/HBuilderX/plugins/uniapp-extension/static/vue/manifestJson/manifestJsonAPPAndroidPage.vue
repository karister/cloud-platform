<template>
	<NavigationScrollView>
		<q-view layout="vbox" style="min-width:40px; max-width:40px;"> </q-view>
		<q-view layout="vbox" layout-spacing="10">
			<q-view layout="vbox" layout-spacing="0">
				<Title titleText='安卓App配置' descriptionTitle="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html'>配置指南</a>"></Title>
			</q-view>

			<q-view layout="vbox">
				<!-- 布局使用 -->
			</q-view>
			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="图标配置"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.iconsAndroidhdpi' :inputLableSubText='i18n.iconsAndroidhdpiTitle' :btnText='i18n.browse'
						:text="manifestJsonValue(formItem.androidIconsHdpi)" :dataKey="formItem.androidIconsHdpi" :errorText="error?.[formItem.androidIconsHdpi.join('.')]">
					</Input>

				</JsonelementGroup>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.iconsAndroidxhdpi' :inputLableSubText='i18n.iconsAndroidxhdpiTitle' :btnText='i18n.browse'
						:text="manifestJsonValue(formItem.androidIconsxHdpi)" :dataKey="formItem.androidIconsxHdpi" :errorText="error?.[formItem.androidIconsxHdpi.join('.')]"></Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.iconsAndroidxxhdpi' :inputLableSubText='i18n.iconsAndroidxxhdpiTitle' :btnText='i18n.browse'
						:text="manifestJsonValue(formItem.androidIconsxxHdpi)" :dataKey="formItem.androidIconsxxHdpi" :errorText="error?.[formItem.androidIconsxxHdpi.join('.')]"></Input>
				</JsonelementGroup>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.iconsAndroidxxxhdpi' :inputLableSubText='i18n.iconsAndroidxxxhdpiTitle'
						:btnText='i18n.browse' :text="manifestJsonValue(formItem.androidIconsxxxHdpi)" :dataKey="formItem.androidIconsxxxHdpi"
						:errorText="error?.[formItem.androidIconsxxxHdpi.join('.')]">
					</Input>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="启动界面配置"></JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0" style="margin-left: 10px;">
				<q-view layout="vbox" layout-spacing="0">
					<JsonFormTitle titleText="启动图配置" :descriptionTitle="i18n.distributeSplashscreenDescription"></JsonFormTitle>
				</q-view>

				<q-view layout="vbox" layout-spacing="0">
					<JsonelementGroup>
						<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroidXhdpi'
							:inputLableSubText='i18n.splashscreensAndroidXhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.androidSplashScreensxHdpi)"
							:dataKey="formItem.androidSplashScreensxHdpi" :errorText="error?.[formItem.androidSplashScreensxHdpi.join('.')]"></Input>
					</JsonelementGroup>

					<JsonelementGroup>
						<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroidXxhdpi'
							:inputLableSubText='i18n.splashscreensAndroidXxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.androidSplashScreensxxHdpi)"
							:dataKey="formItem.androidSplashScreensxxHdpi" :errorText="error?.[formItem.androidSplashScreensxxHdpi.join('.')]"></Input>
					</JsonelementGroup>

					<JsonelementGroup>
						<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroidXxxhdpi'
							:inputLableSubText='i18n.splashscreensAndroidXxxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.androidSplashScreensxxxHdpi)"
							:dataKey="formItem.androidSplashScreensxxxHdpi" :errorText="error?.[formItem.androidSplashScreensxxxHdpi.join('.')]"></Input>
					</JsonelementGroup>
				</q-view>
			</q-view>
			<q-view layout="vbox" layout-spacing="0" style="margin-left: 10px;">
				<q-view layout="vbox" layout-spacing="0">
					<JsonFormTitle :titleText="i18n.splashscreensAndroid12Title" :descriptionTitle="i18n.splashscreensAndroid12Description"></JsonFormTitle>
				</q-view>
				<q-view layout="vbox" layout-spacing="0" style="margin-left: 10px;">
					<q-view layout="vbox" layout-spacing="0">
						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" :inputLableText='i18n.splashscreensAndroid12BackgroundTitle' inputLableSubText='配置了启动图时仅在Android12及以上设备生效，格式为#RRGGBB，默认系统设置亮色模式下为白色、暗色模式下为黑色'
								:text="manifestJsonValue(formItem.android12Background)" :dataKey="formItem.android12Background" :errorText="error?.[formItem.android12Background.join('.')]"></Input>
						</JsonelementGroup>
					</q-view>

					<q-view layout="vbox" layout-spacing="0">
						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" inputLableText='暗色模式背景颜色配置' inputLableSubText='仅在Android10及以上设备系统设置为暗色模式时生效，格式为#RRGGBB，默认值为设置的背景颜色'
								:text="manifestJsonValue(formItem.android12BackgroundNight)" :dataKey="formItem.android12BackgroundNight" :errorText="error?.[formItem.android12BackgroundNight.join('.')]"></Input>
						</JsonelementGroup>
					</q-view>
					
					<q-view layout="vbox" layout-spacing="0">
						<JsonFormTitle :titleText="i18n.splashscreensAndroid12IconTitle"></JsonFormTitle>
					</q-view>

					<q-view layout="vbox" layout-spacing="0">
						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12IconXhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12IconXhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12IconxHdpi)"
								:dataKey="formItem.android12IconxHdpi" :errorText="error?.[formItem.android12IconxHdpi.join('.')]"></Input>
						</JsonelementGroup>

						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12IconXxhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12IconXxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12IconxxHdpi)"
								:dataKey="formItem.android12IconxxHdpi" :errorText="error?.[formItem.android12IconxxHdpi.join('.')]"></Input>
						</JsonelementGroup>

						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12IconXxxhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12IconXxxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12IconxxxHdpi)"
								:dataKey="formItem.android12IconxxxHdpi" :errorText="error?.[formItem.android12IconxxxHdpi.join('.')]"></Input>
						</JsonelementGroup>
					</q-view>

					<q-view layout="vbox" layout-spacing="0">
						<JsonFormTitle :titleText="i18n.splashscreensAndroid12BrandTitle"></JsonFormTitle>
					</q-view>

					<q-view layout="vbox" layout-spacing="0">
						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12BrandXhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12BrandXhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12BrandxHdpi)"
								:dataKey="formItem.android12BrandxHdpi" :errorText="error?.[formItem.android12BrandxHdpi.join('.')]"></Input>
						</JsonelementGroup>

						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12BrandXxhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12BrandXxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12BrandxxHdpi)"
								:dataKey="formItem.android12BrandxxHdpi" :errorText="error?.[formItem.android12BrandxxHdpi.join('.')]"></Input>
						</JsonelementGroup>

						<JsonelementGroup>
							<Input @sendTextChanged="setVueDataInfo" @sendBtnclick="btnClick" :inputLableText='i18n.splashscreensAndroid12BrandXxxhdpi'
								:inputLableSubText='i18n.splashscreensAndroid12BrandXxxhdpiDescription' :btnText='i18n.browse' :text="manifestJsonValue(formItem.android12BrandxxxHdpi)"
								:dataKey="formItem.android12BrandxxxHdpi" :errorText="error?.[formItem.android12BrandxxxHdpi.join('.')]"></Input>
						</JsonelementGroup>
					</q-view>
				</q-view>
			</q-view>
			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="可选模块配置"
					descriptionTitle="编译器会 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-modules.html'>[摇树]</a> 自动添加需要的模块，但以下模块需手动选择provider或配置三方SDK参数。">
				</JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-location（定位）"
						lableText="应用中使用定位功能需要配置以下Provider <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#modulesLocation'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniLocation)" :dataKey="formItem.modulesUniLocation">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="系统定位" lableText="由设备厂商提供定位服务（无需商业授权）" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniLocationSystem)" :dataKey="formItem.modulesUniLocationSystem">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="腾讯定位" @sendClick="setVueDataInfo"
							lableText="由<a style='color:#298bdb' href='https://lbs.qq.com/'>[腾讯位置服务]</a>提供定位服务（需商业授权） <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#locationTencent'>[详情]</a>"
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
							lableText="由<a style='color:#298bdb' href='https://lbs.qq.com/'>[腾讯位置服务]</a>提供地图功能（需商业授权） <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#mapTencent'>[详情]</a>"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniMapTencent)" :dataKey="formItem.modulesUniMapTencent">
							<Input @sendTextChanged="setVueDataInfo" inputLableText="key" inputLableSubText="腾讯位置服务后台申请的Key" :text="manifestJsonValue(formItem.modulesUniMapTencentKey)"
								:dataKey="formItem.modulesUniMapTencentKey"></Input>
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-payment（支付）"
						lableText="应用中使用支付功能需配置以下Provider <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#modulesPayment'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniPayment)" :dataKey="formItem.modulesUniPayment">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="支付宝支付" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentAlipay)" :dataKey="formItem.modulesUniPaymentAlipay">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="微信支付" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPaymentWxpay)" :dataKey="formItem.modulesUniPaymentWxpay">
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-barcode-scanning（相机组件扫码）"
						lableText="<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/component/camera.html'>[camera]</a>相机组件支持扫码模式（mode属性设置为scanCode）时需勾选此模块 <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#modulesscan'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesuniBarcodeScanning)" :dataKey="formItem.modulesuniBarcodeScanning">
					</CheckBox>
				</JsonelementGroup>
				<JsonelementGroup>
					<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="uni-push（消息推送）"
						lableText="应用中使用<a style='color:#298bdb' href='https://uniapp.dcloud.net.cn/unipush-v2.html'>[统一推送服务]</a>需配置以下厂商推送SDK <a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#modulespush'>[详情]</a>"
						@sendClick="setVueDataInfo" :checked="manifestJsonValueCheckbox(formItem.modulesUniPush)" :dataKey="formItem.modulesUniPush">
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="华为厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushHms)" :dataKey="formItem.modulesUniPushHms">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="OPPO厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushOppo)" :dataKey="formItem.modulesUniPushOppo">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="VIVO厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushVivo)" :dataKey="formItem.modulesUniPushVivo">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="小米厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushXiaomi)" :dataKey="formItem.modulesUniPushXiaomi">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="魅族厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushMeizu)" :dataKey="formItem.modulesUniPushMeizu">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="荣耀厂商推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushHonor)" :dataKey="formItem.modulesUniPushHonor">
						</CheckBox>
						<CheckBox :useDefault="false" :checkedValue="{}" unCheckedValue="deleteSelf" text="Google FCM推送SDK" @sendClick="setVueDataInfo"
							:checked="manifestJsonValueCheckbox(formItem.modulesUniPushFcm)" :dataKey="formItem.modulesUniPushFcm">
						</CheckBox>
					</CheckBox>
				</JsonelementGroup>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonFormTitle titleText="权限配置"
					descriptionTitle="云打包默认会自动根据App引擎、原生插件所声明的权限打包。您也可以额外添加或强制移除某些权限。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#permissions'>[详情]</a>">
				</JsonFormTitle>
			</q-view>

			<q-view layout="vbox" layout-spacing="0">
				<JsonelementGroup>
					<Editor titleText="额外添加的权限" :text="manifestJsonValue(formItem.permissions)" :dataKey="formItem.permissions" @sendTextChanged="setVueDataInfo"
						:errorText="error?.[formItem.permissions.join('.')]"></Editor>
				</JsonelementGroup>

				<JsonelementGroup>
					<Editor titleText="强制移除的权限" :text="manifestJsonValue(formItem.excludePermissions)" :dataKey="formItem.excludePermissions" @sendTextChanged="setVueDataInfo"
						:errorText="error?.[formItem.excludePermissions.join('.')]"></Editor>
				</JsonelementGroup>

				<JsonFormTitle titleText="minSdkVersion"></JsonFormTitle>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo"
						inputLableSubText="应用兼容的最低Android版本（API等级）。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#minsdkversion'>详情</a>"
						:text="manifestJsonValue(formItem.minSdkVersion)" :dataKey="formItem.minSdkVersion" :errorText="error?.[formItem.minSdkVersion.join('.')]">
					</Input>
				</JsonelementGroup>

				<JsonFormTitle titleText="targetSdkVersion"></JsonFormTitle>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo"
						inputLableSubText="应用适配的目标Android版本（API等级），部分应用市场要求设置较高的targetSdkVersion才能提交审核。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#targetsdkversion'>详情</a>"
						:text="manifestJsonValue(formItem.targetSdkVersion)" :dataKey="formItem.targetSdkVersion" :errorText="error?.[formItem.targetSdkVersion.join('.')]">
					</Input>
				</JsonelementGroup>
				
				<JsonFormTitle titleText="URL Schemes"></JsonFormTitle>

				<JsonelementGroup>
					<Input @sendTextChanged="setVueDataInfo"
						inputLableSubText="注册 URL Scheme 实现在其它App中打开当前App，多个 scheme 使用“,”分割，如：myapp,mytest。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#urlSchemes'>详情</a>"
						:text="manifestJsonValue(formItem.UrlSchemes)" :dataKey="formItem.UrlSchemes" :errorText="error?.[formItem.UrlSchemes.join('.')]">
					</Input>
				</JsonelementGroup>

				<JsonFormTitle titleText="应用支持CPU类型（abiFilters）"></JsonFormTitle>

				<JsonelementGroup>
					<JsonFormItem descriptionTitle="应用使用 so 库支持的 CPU 类型。<a style='color:#298bdb' href='https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-android.html#abifilters'>详情</a>">
						<q-view layout="vbox" id="checkBoxBorder" layout-spacing="8">
							<CheckBox text="armeabi-v7a" :checked="manifestJsonValueCheckbox(formItem.abiFilters,'armeabi-v7a')" :dataKey="formItem.abiFilters" @sendClick="setVueDataInfoCheckBoxArray"
								dataValue="armeabi-v7a">
							</CheckBox>
							<CheckBox text="arm64-v8a" :checked="manifestJsonValueCheckbox(formItem.abiFilters,'arm64-v8a')" :dataKey="formItem.abiFilters" @sendClick="setVueDataInfoCheckBoxArray"
								dataValue="arm64-v8a">
							</CheckBox>
							<CheckBox text="x86" :checked="manifestJsonValueCheckbox(formItem.abiFilters,'x86')" :dataKey="formItem.abiFilters" @sendClick="setVueDataInfoCheckBoxArray"
								dataValue="x86">
							</CheckBox>
							<CheckBox text="x86_64" :checked="manifestJsonValueCheckbox(formItem.abiFilters,'x86_64')" :dataKey="formItem.abiFilters" @sendClick="setVueDataInfoCheckBoxArray"
								dataValue="x86_64">
							</CheckBox>
						</q-view>
					</JsonFormItem>
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
					androidIconsHdpi: ['app-android', 'distribute', 'icons', 'hdpi'],
					androidIconsxHdpi: ['app-android', 'distribute', 'icons', 'xhdpi'],
					androidIconsxxHdpi: ['app-android', 'distribute', 'icons', 'xxhdpi'],
					androidIconsxxxHdpi: ['app-android', 'distribute', 'icons', 'xxxhdpi'],
					androidSplashScreensxHdpi: ['app-android', 'distribute', 'splashScreens', 'default', 'xhdpi'],
					androidSplashScreensxxHdpi: ['app-android', 'distribute', 'splashScreens', 'default', 'xxhdpi'],
					androidSplashScreensxxxHdpi: ['app-android', 'distribute', 'splashScreens', 'default', 'xxxhdpi'],
					android12Background: ['app-android', 'distribute', 'splashScreens', 'background'],
					android12BackgroundNight: ['app-android', 'distribute', 'splashScreens', 'background@night'],
					android12IconxHdpi: ['app-android', 'distribute', 'splashScreens', 'icon', 'xhdpi'],
					android12IconxxHdpi: ['app-android', 'distribute', 'splashScreens', 'icon', 'xxhdpi'],
					android12IconxxxHdpi: ['app-android', 'distribute', 'splashScreens', 'icon', 'xxxhdpi'],
					android12BrandxHdpi: ['app-android', 'distribute', 'splashScreens', 'brand', 'xhdpi'],
					android12BrandxxHdpi: ['app-android', 'distribute', 'splashScreens', 'brand', 'xxhdpi'],
					android12BrandxxxHdpi: ['app-android', 'distribute', 'splashScreens', 'brand', 'xxxhdpi'],
					modulesUniLocation: ['app-android', 'distribute', 'modules', 'uni-location'],
					modulesUniLocationSystem: ['app-android', 'distribute', 'modules', 'uni-location', 'system'],
					modulesUniLocationTencent: ['app-android', 'distribute', 'modules', 'uni-location', 'tencent'],
					modulesUniLocationTencentKey: ['app-android', 'distribute', 'modules', 'uni-location', 'tencent', 'key'],
					modulesUniMap: ['app-android', 'distribute', 'modules', 'uni-map'],
					modulesUniMapTencent: ['app-android', 'distribute', 'modules', 'uni-map', 'tencent'],
					modulesUniMapTencentKey: ['app-android', 'distribute', 'modules', 'uni-map', 'tencent', 'key'],
					modulesUniPayment: ['app-android', 'distribute', 'modules', 'uni-payment'],
					modulesuniBarcodeScanning: ['app-android', 'distribute', 'modules', 'uni-barcode-scanning'],
					modulesUniPaymentAlipay: ['app-android', 'distribute', 'modules', 'uni-payment', 'alipay'],
					modulesUniPaymentWxpay: ['app-android', 'distribute', 'modules', 'uni-payment', 'wxpay'],
					modulesUniPush: ['app-android', 'distribute', 'modules', 'uni-push'],
					modulesUniPushHms: ['app-android', 'distribute', 'modules', 'uni-push', 'hms'],
					modulesUniPushOppo: ['app-android', 'distribute', 'modules', 'uni-push', 'oppo'],
					modulesUniPushVivo: ['app-android', 'distribute', 'modules', 'uni-push', 'vivo'],
					modulesUniPushXiaomi: ['app-android', 'distribute', 'modules', 'uni-push', 'xiaomi'],
					modulesUniPushMeizu: ['app-android', 'distribute', 'modules', 'uni-push', 'meizu'],
					modulesUniPushHonor: ['app-android', 'distribute', 'modules', 'uni-push', 'honor'],
					modulesUniPushFcm: ['app-android', 'distribute', 'modules', 'uni-push', 'fcm'],
					permissions: ['app-android', 'distribute', 'permissions'],
					excludePermissions: ['app-android', 'distribute', 'excludePermissions'],
					minSdkVersion: ['app-android', 'distribute', 'minSdkVersion'],
					targetSdkVersion: ['app-android', 'distribute', 'targetSdkVersion'],
					UrlSchemes: ['app-android', 'distribute', 'schemes'],
					abiFilters: ['app-android', 'distribute', 'abiFilters']
				},
				manifestJson: {},
				workspaceFolder: {},
				error: {},
				step: ''
			}
		},
		methods: {

		}
	}
</script>


<style lang='qss'>
	* {}

	#checkBoxBorder {
		border: 1px solid @settings.textInputBorder@;
		padding: 5px;
	}
</style>