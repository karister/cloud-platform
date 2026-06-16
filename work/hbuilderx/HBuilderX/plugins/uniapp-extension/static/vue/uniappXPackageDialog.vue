<template>
	<q-scroll-view layout="vbox" id="navigationScrollView">
		<q-view layout="hbox" style="max-height: 30px">
			<q-view layout="hbox">
				<q-label style="border: 4px solid #39A444;max-height: 14px;max-width: 0px;border-bottom: none;border-top: none;border-right: none;"></q-label>
				<q-label style="color: #39A444;font-size: 14px;" :text="joinAppName"></q-label>
				<q-view horizontal-size-policy="Preferred"></q-view>
			</q-view>
			<q-view layout="hbox">
				<q-label style="color: #505050 ;font-size: 12px;" :text="joinVersionCode"></q-label>
			</q-view>
			<q-view horizontal-size-policy="Preferred"></q-view>
			<q-view layout="hbox" id="ManifestJson">
				<q-view horizontal-size-policy="Preferred"></q-view>
				<q-label @linkActivated="openManifestFile" :text="`&lt;a style='color: #3094FF;' href='void(0)'
						&gt;${i18n.modifyManifestJson}&lt;/a&gt;`"></q-label>
			</q-view>
		</q-view>
		<q-view layout="hbox" id="line" style="max-height: 10px;">
			<q-label style="border-top: 1px solid #e5e5e5"></q-label>
		</q-view>
		<q-view layout="vbox" :layout-spacing="0">
			<q-view layout="vbox" style="max-height: 32px">
				<q-radio-group layout="hbox" style="max-height: 30px">
					<q-view layout="hbox" style="max-width: 96px; min-width: 96px; padding: 0 2px 3px">
						<q-radio id="HXRadioButton" text="  Android" @clicked="checkPackChange" :checked="android.enable" data-value="Android" />
					</q-view>
					<q-view layout="hbox" style="max-width: 96px; min-width: 96px; padding: 0 2px 3px">
						<q-radio id="HXRadioButton" text="   iOS" @clicked="checkPackChange" :checked="ios.enable" data-value="iOS" />
					</q-view>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-radio-group>
				<q-view layout="hbox" :layout-spacing="0" style="max-height: 2px; min-height: 2px;">
					<q-view :style="{'max-width': '100px','min-width': '100px',' background-color': androidTabActivated }"></q-view>
					<q-view style="max-width:5px;min-width:5px;background-color: #e5e5e5;"></q-view>
					<q-view :style="{'max-width': '100px','min-width': '100px',' background-color': iosTabActivated }"></q-view>
					<q-view style="background-color: #e5e5e5;"></q-view>
				</q-view>
			</q-view>
			<q-view layout="vbox" id="androidBar" :layout-spacing="14" :enabled="android.enable" :visible="currentBar == 'Android'">
				<q-view layout="hbox" style="max-height: 30px">
					<q-label :text="i18n.androidPackName" id="android-packname-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-input id="HXInput" :text="android.packageName" @textChanged="setAndroidPackageName" :placeholderText="i18n.inputAndroidPackName"></q-input>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.name">
					<q-label id="android-packname-lable"></q-label>
					<q-label :text="error.name" id="errorColor" alignment="AlignTop" :wordWrap="true"></q-label>
				</q-view>
				<q-radio-group layout="hbox" style="max-height: 30px">
					<q-label :text="i18n.certType" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-radio id="HXRadioButton" :text="i18n.cloudCert" @clicked="setAndroidCertificateType" :checked="android.certificate.type === 'ANDROID-CLC'" data-value="ANDROID-CLC" />
					<q-label @linkActivated="openCloudCertificate" :text="`&lt;a style='color: #3094FF;' href='void(0)'&gt;${i18n.details}&lt;/a&gt;`" style="margin-right: 20px;"></q-label>
					<q-radio id="HXRadioButton" :text="i18n.selfCert" @clicked="setAndroidCertificateType" :checked="android.certificate.type === 'ANDROID-GOOGLEPLAY'"
						data-value="ANDROID-GOOGLEPLAY" />
					<q-label @linkActivated="openGenerateCertificate" :text="`&lt;a style='color: #3094FF;' href='void(0)'&gt;${i18n.details}&lt;/a&gt;`" style=""></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-radio-group>
				<q-view :layout-spacing="6" layout="vbox" :visible="android.certificate.type == 'ANDROID-GOOGLEPLAY'">
					<q-view layout="hbox" style="max-height: 30px;">
						<q-label :text="i18n.certFile" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
						<q-input id="HXInput" :text="android.certificate.file" @textChanged="setAndroidCertificateFile" :placeholderText="i18n.inputCertFile"></q-input>
						<q-button id="HXButton" @clicked="openFileDialog" :text="`${i18n.browse}...`"></q-button>
					</q-view>
					<q-view layout="hbox" style="max-height: 30px" :visible="error.file">
						<q-label id="android-googleplay-lable"></q-label>
						<q-label id="errorColor" :text="error.file"></q-label>
					</q-view>
					<q-view layout="hbox" style="max-height: 30px" id="marginTop">
						<q-view layout="hbox" stretch-factor="3">
							<q-label :text="i18n.storePassword" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
							<q-input id="HXInput" :text="android.certificate.storePassword" @textChanged="setAndroidStorePassword" :placeholderText="i18n.inputStorePassword"
								echoMode="Password"></q-input>
						</q-view>
						<q-view layout="hbox" stretch-factor="2">
							<q-label :text="i18n.certAlias" id="android-googleplay-alias-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
							<q-combox id="HXCombox" :items='aliasList' :placeholderText="i18n.inputCertAlias" @editTextChanged="setAndroidCertificateAlias" :editable="true"
								:currentText='android.certificate.alias' @currentIndexChanged="setAndroidCertificateAlias"></q-combox>
						</q-view>
					</q-view>
					<q-view layout="hbox" style="max-height: 30px" :visible="error.storePassword || error.alias">
						<q-view layout="hbox" stretch-factor="1">
							<q-label id="android-googleplay-lable"></q-label>
							<q-label :text="error.storePassword" id="errorColor"></q-label>
						</q-view>
						<q-view layout="hbox" stretch-factor="1">
							<q-label id="android-googleplay-lable"></q-label>
							<q-label :text="error.alias" id="errorColor"></q-label>
						</q-view>
					</q-view>
					<q-view layout="hbox" style="max-height: 30px" id="marginTop">
						<q-view layout="hbox">
							<q-label :text="i18n.certPassword" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
							<q-input id="HXInput" :text="android.certificate.password" @textChanged="setAndroidCertificatePassword" :placeholderText="i18n.inputCertPassword"
								echoMode="Password"></q-input>
						</q-view>
					</q-view>
					<q-view layout="hbox" style="max-height: 30px" :visible="error.password">
						<q-view layout="hbox">
							<q-label id="android-googleplay-lable"></q-label>
							<q-label :text="error.password" id="errorColor"></q-label>
						</q-view>
					</q-view>
					<q-view layout="hbox"></q-view>
				</q-view>
				<q-view layout="hbox" :layout-spacing="5">
					<q-label :text="i18n.packagingFormat" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-view layout="hbox" :layout-spacing="20">
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="`${i18n.apk}`" :checked="android.channel['__NONE__']" data-value="__NONE__" @clicked="setAndroidChannelSettings"
								:enabled="packType !== 'debug'" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="`${i18n.aab}(${i18n.aabDescribe})`" :checked="android.aabChannel['__NONE__']" data-value="__NONE__"
								@clicked="setAndroidChannelAabSettings" :enabled="packType !== 'debug'" />
						</q-view>
					</q-view>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.packFormat">
					<q-label id="android-packname-lable"></q-label>
					<q-label :text="error.packFormat" id="errorColor" alignment="AlignTop" :wordWrap="true"></q-label>
				</q-view>
				<q-view layout="hbox" :layout-spacing="5">
					<q-label :text="`APK${i18n.channelSettings}`" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-view layout="hbox" :layout-spacing="30">
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelNone" :checked="android.channel['NONE']" data-value="NONE" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelHuawei" :checked="android.channel.huawei" data-value="huawei" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelOppo" :checked="android.channel.oppo" data-value="oppo" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelVivo" :checked="android.channel.vivo" data-value="vivo" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelXiaomi" :checked="android.channel.xiaomi" data-value="xiaomi" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelHonor" :checked="android.channel.honor" data-value="honor" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
						<q-view layout="hbox">
							<q-checkbox id="HXCheckBox" :text="i18n.channelYyb" :checked="android.channel.yyb" data-value="yyb" @clicked="setAndroidChannelSettings"
								:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
						</q-view>
					</q-view>
					<q-view layout="hbox">
						<q-label @linkActivated="channelProductionGuide" :text="`&lt;a style='color: #3094FF;' href='void(0)'
						&gt;${i18n.channelProductionGuide}&lt;/a&gt;`" style="margin-right: 20px;"></q-label>
					</q-view>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="vbox" :visible="customChannelList && customChannelList.length>0">
					<q-view layout="hbox" :layout-spacing="5" v-for="grouped in groupedArray">
						<q-label text="" id="android-googleplay-lable" alignment="AlignVCenter|AlignRight"></q-label>
						<q-view layout="hbox" :layout-spacing="30">
							<q-view layout="hbox" v-for="channel in grouped" :key="channel?.id">
								<q-checkbox id="HXCheckBox" :text="channel.name" :checked="android.channel[channel.id]" :data-value="channel.id" @clicked="setAndroidChannelSettings"
									:enabled="!(packType === 'debug' || !android.channel['__NONE__'])" />
							</q-view>
						</q-view>
						<q-view horizontal-size-policy="Expanding"></q-view>
					</q-view>
				</q-view>
				<q-view vertical-size-policy="Expanding"></q-view>
			</q-view>
			<q-view layout="vbox" id="iOSBar" :layout-spacing="14" :enabled="ios.enable" :visible="currentBar == 'iOS'">
				<q-view layout="hbox" style="max-height: 30px">
					<q-label :text="i18n.iOSPackName" id="ios-packname-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-input id="HXInput" :text="ios.bundleID" @textChanged="setiOSBundleID" :placeholderText="i18n.inputiOSBundleID"></q-input>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.bundleID">
					<q-label id="ios-packname-lable"></q-label>
					<q-label :text="error.bundleID" id="errorColor" alignment="AlignTop" :wordWrap="true"></q-label>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px;">
					<q-label id="ios-packname-lable"></q-label>
					<q-checkbox id="HXCheckBox" :text="i18n.supportIphone" :checked="ios.supportIphone" data-value="iphone" @clicked="supportDeviceChange" />
					<q-view style="max-width: 20px;min-width: 20px;"></q-view>
					<q-checkbox id="HXCheckBox" :text="i18n.supportIpad" :checked="ios.supportIpad" data-value="ipad" @clicked="supportDeviceChange" />
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px">
					<q-label id="ios-packname-lable" :text="i18n.iOSCert" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-label @linkActivated="openiOSCertificate" :text="`&lt;a style='color: #3094FF;' href='void(0)'
				&gt;${i18n.applyForCertificate}&lt;/a&gt;`" style="margin-right: 20px;"></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px;">
					<q-label :text="i18n.privateKeyPassword" id="ios-packname-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-input id="HXInput" :text="ios.privateKey.password" @textChanged="setiOSPrivateKeyPassword" :placeholderText="i18n.inputPrivateKeyPassword" echoMode="Password"></q-input>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.privateKeyPassword">
					<q-label id="ios-packname-lable"></q-label>
					<q-label :text="error.privateKeyPassword" id="errorColor"></q-label>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px;">
					<q-label :text="i18n.privateKeyCertificate" id="ios-packname-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-input id="HXInput" :text="ios.privateKey.certificate" @textChanged="setPrivateKeyCertificateFile" :placeholderText="i18n.inputPrivateKeyCertificate"></q-input>
					<q-button id="HXButton" @clicked="openPrivateKeyCertificateFileDialog" :text="`${i18n.browse}...`"></q-button>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.privateKeyCertificate">
					<q-label id="ios-packname-lable"></q-label>
					<q-label :text="error.privateKeyCertificate" id="errorColor"></q-label>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px;">
					<q-label :text="i18n.privateKeyProfile" id="ios-packname-lable" alignment="AlignVCenter|AlignRight" style="font-size: 13px;"></q-label>
					<q-input id="HXInput" :text="ios.privateKey.profile" @textChanged="setPrivateKeyProfileFile" :placeholderText="i18n.inputPrivateKeyProfile"></q-input>
					<q-button id="HXButton" @clicked="openPrivateKeyProfileFileDialog" :text="`${i18n.browse}...`"></q-button>
				</q-view>
				<q-view layout="hbox" style="max-height: 30px" :visible="error.privateKeyProfile">
					<q-label id="ios-packname-lable"></q-label>
					<q-label :text="error.privateKeyProfile" id="errorColor"></q-label>
				</q-view>
				<q-view vertical-size-policy="Expanding"></q-view>
			</q-view>
		</q-view>
		<q-view layout="hbox" style="max-height: 30px;" id="customBase">
			<q-checkbox id="HXCheckBox" :text="i18n.generatesourcemap" @clicked="setSourceMap" :checked="sourcemap"></q-checkbox>
			<q-label @linkActivated="openSourceMapDetail" :text="`&lt;a style='color: #3094FF;' href='void(0)'
				&gt;${i18n.details}&lt;/a&gt;`"></q-label>
			<q-view horizontal-size-policy="Preferred"></q-view>
		</q-view>
		<q-view layout="hbox" style="max-height: 30px;" id="customBase">
			<!-- 	<q-checkbox id="HXCheckBox" :text="i18n.releasePackage" @clicked="setPackType" :checked="packType === 'release'" data-value="release"></q-checkbox> -->
			<q-checkbox id="HXCheckBox" :text="i18n.publishCustomBase" @clicked="setPackType" :checked="packType === 'debug'" data-value="debug"></q-checkbox>
			<q-label @linkActivated="openCustomBaseDetail" :text="`&lt;a style='color: #3094FF;' href='void(0)'
				&gt;${i18n.details}&lt;/a&gt;`"></q-label>
			<q-view style="max-width: 20px;min-width: 20px;"></q-view>
			<q-checkbox id="HXCheckBox" :text="i18n.supportRealMachine" :checked="ios.supportRealMachine" data-value="realMachine" @clicked="supportDeviceChange"
				:visible="packType === 'debug' && !isWin && currentBar=='iOS'" />
			<q-view style="max-width: 20px;min-width: 20px;"></q-view>
			<q-checkbox id="HXCheckBox" :text="i18n.supportSimulator" :checked="ios.supportSimulator" data-value="simulator" @clicked="supportDeviceChange"
				:visible="packType === 'debug' && !isWin && currentBar == 'iOS'" />
			<q-view horizontal-size-policy="Preferred"></q-view>
		</q-view>
		<q-view layout="hbox" style="max-height: 10px">
			<q-label style="border-top: 1px solid #e5e5e5"></q-label>
		</q-view>
		<q-view layout="vbox" id="adBar">
			<q-view layout="hbox">
				<q-label :text="i18n.adUnion" style="color: green;font-size: 14px"></q-label>
			</q-view>
			<q-view layout="hbox">
				<q-label style="color: green;font-size: 13px" @linkActivated="openjoinUniadDetail"
					:text="`${i18n.joinUniad}&lt;a style='color: #3094FF;' href='void(0)' &gt;${i18n.joinUniadDetailLink}&lt;/a&gt;`"></q-label>
			</q-view>
			<q-view layout="vbox" style="padding-left: 10px;" :layout-spacing="14">
				<q-view layout="hbox" :layout-spacing="5">
					<!-- <q-label @linkActivated="openManageDetail" :text="`${i18n.openDCloudAd} &lt;a style='color: #3094FF;' href='void(0)' &gt;[${i18n.manage}]&lt;/a&gt;`"></q-label> -->
					<q-label style="font-weight:bold;font-size: 11px" :text="`●`"></q-label>
					<q-label style="font-weight:bold;font-size: 12.5px" @linkActivated="openMoreSettingDetail"
						:text="`${i18n.openDCloudAd} &lt;a style='color: #3094FF;' href='void(0)' &gt;${i18n.manage}&lt;/a&gt;`"></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.splash" :checked="ad.quick.splash" data-value="splash" @clicked="quickAdChange" :enabled="ad.enabled.splash" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.uniMpReward" :checked="ad.quick.uniMpReward" data-value="uniMpReward" @clicked="quickAdChange" :enabled="ad.enabled.uniMpReward" />
					</q-view>
				</q-view>
				<q-view layout="hbox" :layout-spacing="5">
					<q-label style="font-weight:bold;font-size: 11px" :text="`●`"></q-label>
					<q-label style="font-weight:bold;font-size: 12.5px" @linkActivated="openAdUnitDetail"
						:text="`${i18n.integratedChannel} &lt;a style='color: #3094FF;' href='void(0)' &gt;${i18n.adUnit}&lt;/a&gt;`"></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;">
					<q-label :text="`${i18n.domesticAd}`" style="font-weight:bold;font-size: 12.5px"></q-label>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.gdt" :checked="ad.mf.gdt" data-value="gdt" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.gm" :checked="ad.mf.gm" data-value="gm" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.ks" :checked="ad.mf.ks" data-value="ks" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.bd" :checked="ad.mf.bd" data-value="bd" @clicked="adChange" />
					</q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.hw" :checked="ad.mf.hw" data-value="hw" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.sigmob" :checked="ad.mf.sigmob" data-value="sigmob" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.zy" :checked="ad.mf.zy" data-value="zy" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.bz" :checked="ad.mf.bz" data-value="bz" @clicked="adChange" />
					</q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.fl" :checked="ad.mf.fl" data-value="fl" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.jl" :checked="ad.mf.jl" data-value="jl" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.yt" :checked="ad.mf.yt" data-value="yt" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
					</q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;">
					<q-label :text="`${i18n.internationalAd}`" style="font-weight:bold;font-size: 12.5px"></q-label>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.pg" :checked="ad.mf.pg" data-value="pg" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.gg" :checked="ad.mf.gg" data-value="gg" @clicked="adChange" />
					</q-view>
					<!-- 					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.meta" :checked="ad.mf.meta" data-value="meta" @clicked="adChange" />
					</q-view> -->
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.unity" :checked="ad.mf.unity" data-value="unity" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.liftoff" :checked="ad.mf.liftoff" data-value="liftoff" @clicked="adChange" />
					</q-view>
				</q-view>
				<q-view layout="hbox" style="padding-left: 15px;" :layout-spacing="5">
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.inmobi" :checked="ad.mf.inmobi" data-value="inmobi" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.ironsource" :checked="ad.mf.ironsource" data-value="ironsource" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.mintegral" :checked="ad.mf.mintegral" data-value="mintegral" @clicked="adChange" />
					</q-view>
					<q-view layout="hbox">
						<q-checkbox id="HXCheckBox" :text="i18n.applovin" :checked="ad.mf.applovin" data-value="applovin" @clicked="adChange" />
					</q-view>
				</q-view>
			</q-view>
		</q-view>
	</q-scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				isWin: true,
				appid: '',
				timer: null,
				appName: ' ',
				versionCode: '',
				androidTabActivated: '',
				iosTabActivated: '',
				aliasList: [],
				needGoogleAds: [],
				customChannelList: [],
				ad: {
					quick: {},
					enabled: {
						splash: true,
						uniMpReward: true,
						rp: true
					},
					mf: {}
				},
				error: {
					name: '',
					packFormat: '',
					alias: '',
					password: '',
					storePassword: '',
					file: '',
					bundleID: '',
					privateKeyPassword: '',
					privateKeyProfile: '',
					privateKeyCertificate: ''
				},
				packType: '',
				sourcemap: false,
				currentBar: '',
				android: {
					enable: false,
					packageName: '',
					certificate: {
						type: '',
						alias: '',
						password: '',
						storePassword: '',
						file: ''
					},
					channel: {},
					aabChannel: {}
				},
				ios: {
					enable: false,
					bundleID: '',
					privateKey: {
						password: '',
						profile: '',
						certificate: ''
					},
					debuggingSymbols: false,
					supportIphone: true,
					supportIpad: false,
					supportRealMachine: true,
					supportSimulator: false
				}
			};
		},
		async updated() {
			// await this.updateUi();
		},
		computed: {
			joinAppName() {
				return `${this.i18n.appName}: ${this.appName}`;
			},
			joinVersionCode() {
				return `${this.i18n.appVersion}: ${this.versionCode}`;
			},
			groupedArray() {
				const groupSize = 5;
				let grouped = [];
				for (let i = 0; i < this.customChannelList.length; i += groupSize) {
					grouped.push(this.customChannelList.slice(i, i + groupSize));
				}
				return grouped;
			}
		},
		methods: {
			setAd({
				quick,
				enabled,
				adid,
				adStatus
			}) {
				this.ad.quick = quick
				this.ad.enabled = enabled
				this.ad.adid = adid
				this.ad.adStatus = adStatus
				this.updateUi();
			},
			validatePackageName() {
				if (!this.android.packageName) {
					return this.i18n.needPackname;
				}
				if (!/([a-z]+[a-zA-Z0-9_]*)(\.[a-zA-Z]+[a-zA-Z0-9_]*)+/.test(this.android.packageName)) {
					return this.i18n.checkPackname
				}
				return ''
			},
			validateBundleID() {
				if (!this.ios.bundleID) {
					return this.i18n.needBundleID;
				}
				if (!/^[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*$/.test(this.ios.bundleID)) {
					return this.i18n.checkBundleID
				}
				return ''
			},
			async validateAndroid() {
				let v = true;
				const packageNameResult = this.validatePackageName()
				if (this.error.packFormat) {
					v = false;
				}
				if (packageNameResult) {
					this.error.name = packageNameResult
					v = false;
				}
				if (this.android.certificate.type == 'ANDROID-GOOGLEPLAY') {
					const certificate = this.android.certificate
					if (!certificate.password) {
						this.error.password = this.i18n.needCertPassword
						v = false;
					}
					if (!certificate.storePassword) {
						this.error.storePassword = this.i18n.needStorePassword
						v = false;
					}
					if (!certificate.file) {
						this.error.file = this.i18n.needCertFile
						v = false;
					}
					if (!certificate.alias) {
						this.error.alias = this.i18n.needCertAlias
						v = false;
					}
					if (certificate.password && certificate.storePassword && certificate.file && certificate.alias) {
						const res = await this.verifyAndroidCert()
						if (!res) {
							v = false
						}
					}
				}
				this.updateUi();
				return v;
			},
			async validateIos() {
				let v = true;
				const bundleIDResult = this.validateBundleID()
				if (bundleIDResult) {
					this.error.bundleID = bundleIDResult
					v = false;
				}
				const privateKey = this.ios.privateKey
				if (!privateKey.password) {
					this.error.privateKeyPassword = this.i18n.needPrivateKeyPassword
					v = false;
				}
				if (!privateKey.profile) {
					this.error.privateKeyProfile = this.i18n.needPrivateKeyProfile
					v = false;
				}
				if (!privateKey.certificate) {
					this.error.privateKeyCertificate = this.i18n.needPrivateKeyCertificate
					v = false;
				}
				if (privateKey.password && privateKey.profile && privateKey.certificate) {
					const res = await this.verifyIOSCert()
					if (!res) {
						v = false
					}
				}
				this.updateUi();
				return v;
			},
			async validate() {
				if (this.android.enable) {
					const res = await this.validateAndroid()
					return res
				}
				if (this.ios.enable) {
					const res = await this.validateIos()
					return res
				}
			},
			async openManifestFile() {
				this.$mitt.emit('openManifestFile')
			},
			async openGenerateCertificate() {
				this.$mitt.emit('openGenerateCertificate');
			},
			async opendebuggingSymbolsDetail() {
				this.$mitt.emit('opendebuggingSymbolsDetail');
			},
			async openChannelDetail() {
				this.$mitt.emit('openChannelDetail');
			},
			async openCloudCertificate() {
				this.$mitt.emit('openCloudCertificate');
			},
			async openCustomBaseDetail() {
				this.$mitt.emit('openCustomBaseDetail');
			},
			async openSourceMapDetail() {
				this.$mitt.emit('openSourceMapDetail');
			},
			async openAdUnitDetail() {
				this.$mitt.emit('openAdUnitDetail');
			},
			async openjoinUniadDetail() {
				this.$mitt.emit('openjoinUniadDetail');
			},
			async openManageDetail() {
				this.$mitt.emit('openManageDetail');
			},
			async openMoreSettingDetail() {
				this.$mitt.emit('openMoreSettingDetail', {
					appid: this.appid
				});
			},
			async openiOSCertificate() {
				this.$mitt.emit('openiOSCertificate');
			},
			async channelProductionGuide() {
				this.$mitt.emit('channelProductionGuide');
			},
			async openFileDialog() {
				const that = this
				this.$mitt.emit('openFileDialog', async (file) => {
					if (file) {
						that.android.certificate.file = file;
						that.error.file = '';
						await that.updateUi();
						that.getAlias()
					}
				});
			},
			async verifyAndroidCert() {
				const that = this
				return new Promise((r, j) => {
					this.$mitt.emit('verifyAndroidCert', {
						data: that.android.certificate,
						cb(certCheck) {
							if (certCheck && certCheck.size > 0) {
								that.setCertificateError(certCheck)
								r(false)
							} else {
								r(true)
							}
						}
					});
				})

			},
			async verifyIOSCert() {
				const that = this
				return new Promise((r, j) => {
					this.$mitt.emit('verifyIOSCert', {
						data: that.ios.privateKey,
						bundleID: that.ios.bundleID,
						cb(certCheck) {
							if (certCheck && certCheck.size > 0) {
								that.setPrivateKeyError(certCheck)
								r(false)
							} else {
								r(true)
							}
						}
					});
				})
			},
			async setAndroidPackageName(e) {
				this.android.packageName = e.target.text;
				const packageNameResult = this.validatePackageName()
				this.error.name = packageNameResult
				await this.updateUi();
			},
			async setiOSBundleID(e) {
				this.ios.bundleID = e.target.text;
				const bundleIDResult = this.validateBundleID()
				this.error.bundleID = bundleIDResult
				await this.updateUi();
			},
			async checkPackChange(e) {
				this.currentBar = e.target['data-value'];
				if (this.currentBar == 'Android') {
					this.android.enable = true
					this.ios.enable = false
					this.androidTabActivated = 'green';
					this.iosTabActivated = '#e5e5e5';
				}
				if (this.currentBar == 'iOS') {
					this.android.enable = false
					this.ios.enable = true
					this.androidTabActivated = '#e5e5e5';
					this.iosTabActivated = 'green';
				}
				await this.updateUi();
			},
			async quickAdChange(e) {
				const data = e.target['data-value'];
				this.ad.quick[data] = e.target.checked
				await this.updateUi();
			},
			async adChange(e) {
				const data = e.target['data-value'];
				this.ad.mf[data] = e.target.checked
				// 国内国外穿山甲
				if (data === 'gm' && e.target.checked && this.ad.mf['pg']) {
					this.ad.mf['pg'] = false
				}
				if (data === 'pg' && e.target.checked && this.ad.mf['gm']) {
					this.ad.mf['gm'] = false
				}
				// 国内国外穿山甲 end
				// 国外gg广告
				if (data === 'gg' && !e.target.checked) { // 取消选中
					for (let ad of this.needGoogleAds) {
						this.ad.mf[ad] = false
					}
				}
				if (this.needGoogleAds.includes(data) && e.target.checked) { // 选中其他，需要被动选中
					if (!this.ad.mf['gg']) {
						this.ad.mf['gg'] = true
					}
				}
				// 国外gg广告 end
				await this.updateUi();
			},
			async supportDebuggingSymbolsChange(e) {
				this.ios.debuggingSymbols = e.target.checked
			},
			async supportDeviceChange(e) {
				const data = e.target['data-value'];
				let checked = e.target.checked
				if (data === 'iphone') {
					this.ios.supportIphone = checked
				}
				if (data === 'ipad') {
					this.ios.supportIpad = checked
				}
				if (data === 'realMachine') {
					this.ios.supportRealMachine = checked
				}
				if (data === 'simulator') {
					this.ios.supportSimulator = checked
				}
				await this.updateUi();
				if (data === 'iphone' && !checked && !this.ios.supportIpad) {
					this.ios.supportIphone = true
				}
				if (data === 'ipad' && !checked && !this.ios.supportIphone) {
					this.ios.supportIpad = true
				}
				if (data === 'realMachine' && !checked && !this.ios.supportSimulator) {
					this.ios.supportRealMachine = true
				}
				if (data === 'simulator' && !checked && !this.ios.supportRealMachine) {
					this.ios.supportSimulator = true
				}
				await this.updateUi();
			},
			async setPackType(e) {
				this.packType = e.target.checked ? "debug" : "release";
				await this.updateUi();
			},
			async setSourceMap(e) {
				this.sourcemap = e.target.checked
				await this.updateUi();
			},
			async setAndroidCertificateAlias(e) {
				this.android.certificate.alias = e.target.currentText;
				if (!this.android.certificate.alias) {
					this.error.alias = this.i18n.needCertAlias;
				} else {
					this.error.alias = '';
				}
				await this.updateUi();
			},
			async setAndroidCertificateType(e) {
				this.error = {
					name: this.error.name
				};
				this.android.certificate.type = e.target['data-value'];
				await this.updateUi();
			},
			hasCheckChannel() {
				// this.android.channel 和this.android.aabChannel 的值如果全为false了，则不能取消
				let res = false
				for (let v of Object.values({
						...this.android.channel,
						...{
							"__NONE__": false,
							'NONE': false
						}
					})) {
					if (v) {
						res = true
						break;
					}
				}
				return res
			},
			showPackFormatError() {
				if (!this.android.aabChannel["__NONE__"] && !this.android.channel["__NONE__"]) {
					this.error.packFormat = this.i18n.needPackFormat
				} else {
					this.error.packFormat = ''
				}
			},
			async setAndroidChannelSettings(e) {
				const data = e.target['data-value'];
				if (!this.android.channel) {
					this.android.channel = {}
				}
				this.android.channel[data] = e.target.checked
				this.showPackFormatError()
				await this.updateUi();
				if (data !== '__NONE__' && !e.target.checked) {
					// 勾选渠道包，取消的情况下,如果全取消了需要把无勾选上
					const res = this.hasCheckChannel()
					if (!res) {
						this.android.channel['NONE'] = !e.target.checked
						await this.updateUi();
					}
				}
				if (data === '__NONE__' && e.target.checked) {
					// 勾选apk格式，如果渠道没有勾选的自动勾选无，有则不做操作
					const res = this.hasCheckChannel()
					if (!res) {
						this.android.channel['NONE'] = e.target.checked
						await this.updateUi();
					}

				}
			},
			async setAndroidChannelAabSettings(e) {
				const data = e.target['data-value'];
				if (!this.android.aabChannel) {
					this.android.aabChannel = {}
				}
				this.android.aabChannel[data] = e.target.checked
				this.showPackFormatError()
				await this.updateUi();
			},
			async setAndroidCertificatePassword(e) {
				this.android.certificate.password = e.target.text;
				if (!this.android.certificate.password) {
					this.error.password = this.i18n.needCertPassword;
				} else {
					this.error.password = '';
				}
				await this.updateUi();
			},
			async setAndroidStorePassword(e) {
				this.android.certificate.storePassword = e.target.text;
				if (!this.android.certificate.storePassword) {
					this.error.storePassword = this.i18n.needStorePassword;
				} else {
					this.error.storePassword = '';
				}
				await this.updateUi();
				this.getAlias()
			},
			async setiOSPrivateKeyPassword(e) {
				this.ios.privateKey.password = e.target.text;
				if (!this.ios.privateKey.password) {
					this.error.privateKeyPassword = this.i18n.needPrivateKeyPassword;
				} else {
					this.error.privateKeyPassword = '';
				}
				await this.updateUi();
			},
			async setAndroidCertificateFile(e) {
				this.android.certificate.file = e.target.text;
				if (!this.android.certificate.file) {
					this.error.file = this.i18n.needCertFile;
				} else {
					this.error.file = '';
				}
				await this.updateUi();
				this.getAlias()
			},
			async setPrivateKeyProfileFile(e) {
				this.ios.privateKey.profile = e.target.text;
				if (!this.ios.privateKey.profile) {
					this.error.privateKeyProfile = this.i18n.needPrivateKeyProfile;
				} else {
					this.error.privateKeyProfile = '';
				}
				await this.updateUi();
			},
			async setPrivateKeyCertificateFile(e) {
				this.ios.privateKey.certificate = e.target.text;
				if (!this.ios.privateKey.certificate) {
					this.error.privateKeyCertificate = this.i18n.needPrivateKeyCertificate;
				} else {
					this.error.privateKeyCertificate = '';
				}
				await this.updateUi();
			},
			async openPrivateKeyProfileFileDialog() {
				const that = this
				this.$mitt.emit('openPrivateKeyProfileFileDialog', async (file) => {
					if (file) {
						that.ios.privateKey.profile = file;
						that.error.privateKeyProfile = '';
						await that.updateUi();
					}
				});
			},
			async openPrivateKeyCertificateFileDialog() {
				const that = this
				this.$mitt.emit('openPrivateKeyCertificateFileDialog', async (file) => {
					if (file) {
						that.ios.privateKey.certificate = file;
						that.error.privateKeyCertificate = '';
						await that.updateUi();
					}
				});
			},
			getAliasCallBack(err, data) {
				if (!err) {
					this.aliasList = data
					this.android.certificate.alias = data[0]
				}
				this.setCertificateError(err)
				this.updateUi()
			},
			setCertificateError(data = new Map()) {
				try {
					this.error.alias = data.get('manifest.plus.distribute.google.aliasname')
					this.error.file = data.get('manifest.plus.distribute.google.keystore')
					this.error.password = data.get('manifest.plus.distribute.google.keypwd')
					this.error.storePassword = data.get('manifest.plus.distribute.google.storepwd')
				} catch (e) {}
			},
			setPrivateKeyError(data = new Map()) {
				try {
					this.error.bundleID = data.get('manifest.plus.distribute.apple.appid')
					this.error.privateKeyPassword = data.get('manifest.plus.distribute.apple.password')
					this.error.privateKeyProfile = data.get('manifest.plus.distribute.apple.mobileprovision')
					this.error.privateKeyCertificate = data.get('manifest.plus.distribute.apple.p12')
				} catch (e) {}
			},
			getAlias() {
				let that = this;
				if (!(this.android.certificate.file && this.android.certificate.storePassword)) {
					return
				}
				if (this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					that.$mitt.emit('getAlias', {
						file: that.android.certificate.file,
						pwd: that.android.certificate.storePassword,
						cb: that.getAliasCallBack
					});
				}, 1000)
			}
		}
	};
</script>


<style>
	#android-packname-lable,
	#android-googleplay-lable {
		min-width: 85px;
		max-width: 85px;
	}

	#ios-packname-lable {
		min-width: 125px;
		max-width: 125px;
	}

	#android-googleplay-alias-lable {
		min-width: 70px;
		max-width: 70px;
	}

	#activateBtn {
		text-align: top left;
		border: none;
		min-height: 25px;
	}

	#errorColor {
		font-size: 11px;
		color: #D41515;
		min-height: 16px;
		max-height 16px;
	}

	#HXButtonBar {
		background-color: #009944;
		color: #fff;
		padding: 2px 5px;
		margin-left: 10px;
	}

	#HXButton {
		border: 1px solid #009944;
		background: #fafffa;
		color: #54ae6c;
		padding: 2px 5px;
		height: 20px;
	}


	QComboBox {
		height: 26px;
		border: 1px solid #e5e5e5;
		color: #282828;
		background: transparent;
	}

	QComboBox:hover,
	QComboBox:focus {
		background: transparent;
		border-color: #43c45b;
	}

	QComboBox::drop-down {
		subcontrol-position: top right;
		width: 32px;
		border: none;
	}

	QComboBox::down-arrow {
		image: url(:/login/icons/down-arrow-fill.png);
	}

	QComboBox QAbstractItemView {
		border: 1px solid #43C45B;
		background: #FFFEFA;
		color: #405E42;
		selection-color: #4EAB57;
		selection-background-color: #FFFEFA;
	}

	QComboBox QAbstractItemView::item {
		/* 		height: 100px;
		padding: 10px 10px;
		border: 1px solid red; */
	}

	#QLineEdit {
		height: 26px;
		color: #282828;
		font-size: 10pt;
		border: 1px solid #dcd0a8;
		padding-left: 5px;
		padding-right: 5px;
		background-color: #fffdf5;
	}

	#QLineEdit:focus {
		border: 1px solid #41A863;
	}

	#HXInput {
		padding: 0px;
		color: #282828;
		height: 26px;
		border: 1px solid #e5e5e5;
		background: transparent;
	}

	#HXInput:hover,
	#HXInput:focus {
		background: transparent;
		border-color: #43c45b;
	}

	#androidBar,
	#iOSBar {
		border: 1px solid #e5e5e5;
		/* border-top: none; */
		padding: 10px;
	}

	#androidBar QFrame,
	#iOSBar QFrame {
		background: transparent;
	}

	#adBar {
		/* border: 1px solid #e5e5e5; */
		/* border-top: none; */
		/* padding: 10px; */
	}

	#HXCheckBox::indicator::unchecked {
		image: url(:/hxui/resource/chbx.png);
	}

	#HXCheckBox::indicator::unchecked:hover {
		image: url(:/hxui/resource/chbx-hover.png);
	}

	#HXCheckBox::indicator::checked {
		image: url(:/hxui/resource/chbx-checked.png);
	}

	#HXCheckBox::indicator::checked:disabled {
		image: url(:/hxui/resource/chbx-checked-disable.png);
	}

	#HXCheckBox::indicator::unchecked:pressed,
	#HXCheckBox::indicator::checked:pressed {
		image: url(:/hxui/resource/chbx-pressed.png);
	}

	#HXCheckBox::indicator:disabled {
		image: url(:/hxui/resource/chbx.png);
	}

	#HXCheckBox:disabled {
		color: #c0c4cc;
	}

	#HXRadioButton::indicator::unchecked {
		image: url(:/hxui/resource/rdbt.png);
	}

	#HXRadioButton::indicator::unchecked:hover {
		image: url(:/hxui/resource/rdbt-hover.png);
	}

	#HXRadioButton::indicator::checked {
		image: url(:/hxui/resource/rdbt-checked.png);
	}

	#marginTop {
		margin-top: 5px
	}

	#navigationScrollView {
		border: none;
	}

	#navigationScrollView,
	#navigationScrollView QFrame {
		background: transparent;
	}

	#line {
		margin-top: 5px;
	}
</style>

<style when="screen.devicePixelRatio >= 150 && isWindows">
	#activateBtn {
		text-align: center left;
		border: none;
		min-height: 25px;
	}
</style>
<style when="isMac">
	HXBaseDialog[qt_version="5"] * {
		font-family: "Microsoft YaHei";
		font-size: 12px;
	}

	HXBaseDialog[qt_version="6"] * {
		font-family: "Microsoft YaHei", "Consolas", "Lucida Grande", "PingFang SC";
		font-size: 12px;
	}
</style>
<style when="isWindows">
	HXBaseDialog[qt_version="5"] * {
		font-family: "Microsoft YaHei";
		font-size: 10px;
	}

	HXBaseDialog[qt_version="6"] * {
		font-family: "Microsoft YaHei", "Consolas", "Lucida Grande", "PingFang SC";
		font-size: 10px;
	}

	#marginTop {
		margin-top: 8px
	}

	#customBase {
		padding-top: 10px;
		padding-bottom: 5px;
	}

	#line {
		margin-top: 10px;
	}
</style>
<style when="localeId == 'en'">
	#android-packname-lable,
	#android-googleplay-lable {
		min-width: 150px;
		max-width: 150px;
	}

	#ios-packname-lable {
		min-width: 180px;
		max-width: 180px;
	}

	#android-googleplay-alias-lable {
		min-width: 80px;
		max-width: 80px;
	}
</style>