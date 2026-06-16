
<template>
	<q-scroll-view layout='vbox' id="scrollView">
		<q-view layout='vbox' layout-spacing='5'>
			

			<q-view layout="hbox">
				<q-label text="产品:<span style='color: red;'> * </span>" id="labelView" stretch-factor='1'></q-label>
				<q-radio-group layout="hbox" layout-spacing='20' stretch-factor='1'>
					<q-radio id="HXRadioButton" text="HBuilderX" @clicked="setReportType" 
						:checked="reportType.label === 'HBuilderX'" :data-value="4" />
					<q-radio id="HXRadioButton" text="uni-app x" @clicked="setReportType"
						:checked="reportType.label === 'uni-app x'" :data-value="6" />
					<!-- 		<q-radio id="HXRadioButton" text="uni-app" @clicked="setReportType"
					:checked="reportType.label === 'uni-app'" data-value="1" /> -->
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-radio-group>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-view>

			<q-view layout="vbox">
				<q-view layout="hbox" id="reportTypeView">
					<q-label text="所属模块:<span style='color: red;'> *</span>" id="labelView" stretch-factor='1'></q-label>
					<q-view layout="hbox">
						<q-combox :items='moduleList' :currentIndex='moduleIndex' :currentText='moduleName' :focus='true' :stretch-factor='1' placeholderText="选择一个模块"
							@currentIndexChanged="setModule"></q-combox>
					</q-view>
					<q-view></q-view>
				</q-view>
				<q-view layout='hbox' v-if='error.module'>
					<q-label id="labelView"></q-label>
					<q-view  v-if='error.module'>
						<q-label id="error" text="请选择一个模块" alignment="AlignTop"></q-label>
					</q-view>
				</q-view>
			</q-view>
			
			<q-view layout='vbox'>
				<q-view layout='hbox' id="reportTypeView">
					<q-label text="标题:<span style='color: red;'> * </span>" id="labelView"></q-label>
					<q-input :text='title' id="HXInput"   @textChanged="setTitle"></q-input>
					<q-view></q-view>
				</q-view>
				<q-view v-if="error.title" layout='hbox'>
					<q-label id="labelView"></q-label>
					<q-label text="请输入标题" id="error" alignment="AlignTop"></q-label>
				</q-view>
				<q-view layout='hbox' v-if='internal'>
					<q-label id="labelView" text="Release 预览："></q-label>
					<q-label :text='issuesReview' alignment="AlignTop"></q-label>
				</q-view>
			</q-view>
			
			<q-view layout="hbox" :visible='isUniAppX' id="reportTypeView">
				<q-label text="控制台选择:<span style='color: transparent;'> * </span>" id="labelView" stretch-factor='1'></q-label>
				<q-view layout="hbox">
					<q-combox  :currentIndex='currentConsoleIndex'  :items='consoleList'  @currentIndexChanged="setConsoleView" :editable='false' placeholderText="真机运行后选择运行控制台，自动加载相关信息" :stretch-factor='1'></q-combox>
				</q-view>
				<q-view></q-view>
			</q-view>
				
			<q-view :visible='isUniAppX' layout='vbox' >
				<!-- <q-view layout='hbox'> -->
					<q-view layout='vbox' layout-spacing='5'>
						<q-view layout='hbox' id="reportTypeView"  >
							<q-label text="平台:<span style='color: red;'> *</span>" id="labelView" ></q-label>
							<q-checkbox id="HXCheckBox"  text="Android" :checked='phoneOsPlatform.includes(1)' data-value="1"  @clicked="setPlatform"  style="margin-right: 10px;"/>
							<q-checkbox id="HXCheckBox"  text="iOS" :checked='phoneOsPlatform.includes(2)' data-value="2" @clicked="setPlatform"  style="margin-right: 10px;"/>
                            <q-checkbox id="HXCheckBox"  text="鸿蒙" :checked='phoneOsPlatform.includes(5)' data-value="5" @clicked="setPlatform" style="margin-right: 10px;"/>
							<q-checkbox id="HXCheckBox"  text="web" :checked='phoneOsPlatform.includes(3)' data-value="3" @clicked="setPlatform"  style="margin-right: 10px;"/>
							<q-checkbox id="HXCheckBox"  text="微信小程序" :checked='phoneOsPlatform.includes(4)' data-value="4" @clicked="setPlatform"  style="margin-right: 10px;"/>
                            <q-checkbox id="HXCheckBox"  text="支付宝小程序" :checked='phoneOsPlatform.includes(6)' data-value="6" @clicked="setPlatform" />
							<q-view horizontal-size-policy="Expanding"></q-view>
						</q-view>
						<q-view layout='hbox' v-if='error.platform'>
							<q-label id="labelView"></q-label>
							<q-view  v-if='error.platform'>
								<q-label id="error" text="请选择平台" alignment="AlignTop"></q-label>
							</q-view>
						</q-view>
                        <q-view  layout='hbox' id="reportTypeView">
                                <q-label id="labelView" text="是否蒸汽模式:"></q-label>
                        		<q-checkbox id="HXCheckBox" :checked='isVaporMode'  @clicked="setVaporMode" text="是" style="margin-right: 10px;"/>
                        </q-view> 
                        
						<q-view layout='hbox' id="reportTypeView">
							<q-label id="labelView" text="手机品牌:"></q-label>
							<q-combox :items='phoneBrandList' :currentText='phoneBrand' currentIndex='-1'
								@currentIndexChanged="setBrand" @editTextChanged="brandEditTextChange" stretch-factor="1"></q-combox>
                           <q-view  layout='hbox' stretch-factor="1">
                                  <q-label alignment="AlignVCenter|AlignRight" text="<span style='color: transparent;'> * </span>型号:"></q-label>
                                   <q-input :text='phoneModel' id="HXInput"  @textChanged="setPhoneModel"></q-input>
                            </q-view>
                            
                            <q-view layout='hbox' stretch-factor="1">
                            		<q-label alignment="AlignVCenter|AlignRight" text="<span style='color: transparent;'> * </span>版本:"></q-label>
                            		<q-input :text='phoneOsVersion'  id="HXInput"  @textChanged="setPhoneOsVersion"></q-input>
                            </q-view>
						</q-view>
					</q-view>
                    
			</q-view>
			
			<q-view layout='vbox' id="reportTypeView" style="min-height: 320px; margin-top: 10px;">
				<q-view layout='vbox' id="reportTypeView">
					<q-label style="font-weight: bold;" text="复现步骤:<span style='color: red;'> * </span>"></q-label>
					<q-label text="<span style='color: #666;fonts-size: 12;'>markdown 格式，可粘贴图片</span>"></q-label>
					<q-view layout='hbox' id="reportTypeView">
						<q-source-editor font-size="13" :text='step' languageId='markdown' :word-wrap='true'
							:line-number-visible='false' end-at-last-line="true" @modified="setStep"></q-source-editor>
					</q-view>

				</q-view>
				<q-view v-if="error.step" layout='hbox'>
					<!-- <q-label id="labelView"></q-label> -->
					<q-label text="请输入复现步骤" id="error" alignment="AlignTop"></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
			</q-view>
			
			<q-view :visible='!isHX' layout='vbox'>
				<q-view layout='hbox' id="reportTypeView">
					<q-label text="<span style='color: transparent;'></span>复现项目:" id="labelView"></q-label>
					<q-view layout="hbox">
						<q-combox :items='projectTypeList' :currentIndex='reportTypeViewIndex' :stretch-factor='1' :editable='false'
							@currentIndexChanged="setprojectTypeList"></q-combox>
					</q-view>
					<q-view horizontal-size-policy="Expanding" ></q-view>
					<q-view layout="hbox">
						<q-label text="是否公开:" :enabled='!isGitProject' id="reportTypeView"></q-label>
					</q-view>
					<q-radio-group layout="hbox"   layout-spacing='5'>
						<q-radio id="HXRadioButton" text="是" :enabled='!isGitProject' :checked="projectPublic == true"
							@clicked="setProjectPublic" data-value="true" />
						<q-radio id="HXRadioButton" text="否" :enabled='!isGitProject' :checked="projectPublic == false" @clicked="setProjectPublic"
							data-value="false" />
					</q-radio-group>
					<q-view></q-view>
				</q-view>
				<q-view></q-view>
			</q-view>
			
			<q-view :visible='!isHX' layout="vbox" layout-spacing='10'>
				<q-view layout="hbox" layout-spacing='20'>
					<q-view v-if='isGitProject' layout='hbox'>
						<q-label id="labelView" text="Git地址:"
							:stretch-factor='1'></q-label>
						<q-input  placeholderText="可复现工程的Git地址" id="HXInput" :text="sampleProjectGit" 
							@textChanged="setSampleProjectGit"></q-input>
					</q-view>
					
					<q-view v-else layout='hbox'>
						<q-label id="labelView" text="工程目录:<span style='color: transparent;'> * </span>"
							:stretch-factor='1'></q-label>
						<q-input id="HXInput" horizontal-size-policy="Expanding"  :text='localProjectPath' @textChanged="localProjectPathUpdate" placeholderText="提供复现工程才能提高问题的解决效率"></q-input>
						<q-button id="HXButton" horizontal-size-policy="Preferred"  vertical-size-policy="Preferred" text='选择工程' @clicked="setlocalProjectPath" ></q-button>
						<q-view></q-view>
					</q-view>
				</q-view>
				
			<!-- 	<q-view v-if='!isHX & !isGitProject' layout='hbox' >
					<q-label text="<span style='color: transparent;'></span>" id="labelView"></q-label>
					<q-radio-group layout="hbox"   layout-spacing='5'>
						<q-radio id="HXRadioButton" text="工程全部文件"  :checked="!isProjectPartfile" 
							@clicked="setProjectPartfile" data-value="false" />
						<q-radio id="HXRadioButton" text="仅包括编辑器打开的页面及相关文件" :checked="isProjectPartfile" @clicked="setProjectPartfile"
							data-value="true" />
					</q-radio-group>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view> -->
				
				<q-view v-if='error.sampleProjectGit' layout='hbox'>
					<q-label id="labelView"></q-label>
					<q-view :visible="error.sampleProjectGit">
						<q-label :text="sampleProjectTips" id="error" alignment="AlignTop"></q-label>
					</q-view>
				</q-view>
			</q-view>


			<q-view layout='vbox' id="reportTypeView" style="min-height: 100px; max-height: 100px; margin-top: 10px;">
				<q-view layout='vbox' id="reportTypeView">
					<q-label style="font-weight: bold;" text="<span style='color: transparent;'></span>你认为正确的做法:"
						id="labelView2"></q-label>
					<q-label text="<span style='color: #666;fonts-size: 12;'>markdown 格式，可粘贴图片</span>"></q-label>
					<q-view layout='hbox' id="reportTypeView">
						<q-source-editor font-size="13" :text='wantResult' languageId='markdown' :word-wrap='true'
							:line-number-visible='false' end-at-last-line="true"
							@modified="setWantResult"></q-source-editor>
					</q-view>
				</q-view>
				<q-view v-if="error.wantResult" layout='hbox'>
					<!-- <q-label  id="labelView"></q-label> -->
					<q-label text="请输入预期结果" id="error" alignment="AlignTop"></q-label>
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-view>
			</q-view>


			<!-- <q-label v-if='!isHX' style="margin-left: 100px;" :text='compactStatus'></q-label> -->
			<q-view style="min-height: 50px;" layout='hbox' :visible='isUniAppX' id="reportTypeView">
				<!-- <q-button id="HXButton" text="添加截图"  @clicked='addPic'></q-button> -->
				<!-- <q-button id="HXButton" text="上传附件" @clicked='addPic'></q-button> -->
				<q-button :visible='isUniAppX' id="HXButton" text="真机截图" :enabled='!!(isUniAppX && sessionId)' @clicked='addScreencap'></q-button>
				<q-label id='reportTypeView'  text="uni-app x项目运行后，选择一个控制台点击可截取手机屏幕截图"></q-label>
				<q-view horizontal-size-policy="Expanding"></q-view>
				<q-view layout="hbox">
					<q-view horizontal-size-policy="Preferred"></q-view>
					<q-label id='reportTypeView' :enabled='!!(isUniAppX  && sessionId)' text="是否公开截图:"></q-label>
					<q-radio-group layout="hbox" layout-spacing='5'>
						<q-radio id="HXRadioButton" :enabled='!!(isUniAppX && sessionId)' text="是" :checked="screenshotPublic == true"
							@clicked="setscreenshotPublic" data-value="true" />
						<q-radio id="HXRadioButton" :enabled='!!(isUniAppX && sessionId)' text="否" :checked="screenshotPublic == false" @clicked="setscreenshotPublic"
							data-value="false" />
					</q-radio-group>
				</q-view>
				<q-view></q-view>
			</q-view>
			
			<q-scroll-view layout='hbox' id="scrollView" v-if='picPath.length || isLoading' style="min-height: 255px;">
				<q-view v-for="(pic, index) in picPath" :key="index" layout='vbox' style="max-height: 230px;">
					<q-label v-if="pic.endsWith('.png') ||pic.endsWith('.jpg')" scaledContents :text="`<img height='230' src='${pic}'>`"></q-label>
					<q-label v-else scaledContents :text='(getFileName(pic))'></q-label>
					<q-label text="&lt;a href='void(0)' &gt; 删除&lt;/a&gt;" id="deleteBtn" @linkActivated='removePic'
						:data-index="index"></q-label>
					<!-- <q-button text="删除"  @clicked='removePic' :data-index="index"></q-button> -->
				</q-view>
				<q-view v-if="isLoading" layout='vbox' style="max-height: 225px;">
					<q-label style="max-width: 300px;" text="截图中..."></q-label>
				</q-view>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-scroll-view>
			
			<q-view layout="vbox">
				<q-view layout="hbox" layout-spacing='20'>						
					<q-view layout='hbox'>
						<q-label id="labelView" text="<span style='color: transparent;'></span>选择附件:"
							:stretch-factor='1'></q-label>
						<q-input id="HXInput" horizontal-size-policy="Expanding"  :text='attachmentPath' @textChanged="attachmentPathUpdate" placeholderText="可选择一个附件"></q-input>
						<q-button id="HXButton" horizontal-size-policy="Preferred"  vertical-size-policy="Preferred" text='选择附件' @clicked="setAttachmentPath" ></q-button>
						<q-view></q-view>
					</q-view>
				</q-view>
				
				<q-view layout='hbox'>
					<q-label id="labelView"></q-label>
					<q-view :visible="error.attachmentPath">
						<q-label :text="attachmentPathTips" id="error" alignment="AlignTop"></q-label>
					</q-view>
				</q-view>
			</q-view>
			   

			<q-view layout="hbox" style="max-height:25px;">
				<q-checkbox v-if='isHX' id="HXCheckBox" style="max-width: 130px;" text="包含运行日志"
					:checked='isRunLogChecked' @stateChanged='setRunLogChkState' />
				<q-checkbox v-else id="HXCheckBox" style="max-width: 130px;" text="App运行日志" :checked='isRunLogChecked'
					@stateChanged='setRunLogChkState' />
				<q-label id="labelInfo" :text="`&lt;a href='void(0)'
						&gt;${isRunLogBtnShow ? '隐藏' : '显示'}&lt;/a&gt;`" @linkActivated="clickRunLogBtn"></q-label>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-view>
			<q-view layout='vbox' style="min-height:180px;" v-if="isRunLogBtnShow">
				<q-source-editor font-size="13" :text='runLog' languageId='log' :word-wrap='true'
					:line-number-visible='false' :end-at-last-line='true' :read-only='true'></q-source-editor>
			</q-view>
			<q-view layout="hbox" style="max-height:25px;" v-if='reportType.label == reportTypeList[0].label'>
				<q-checkbox id="HXCheckBox" style="max-width: 170px;" text="包含当前激活的插件列表" :checked='isExtensionChecked'
					@stateChanged='setExtensionChkState' />
				<q-label id="labelInfo" :text="`&lt;a href='void(0)'
						&gt;${isExtensionBtnShow ? '隐藏' : '显示'}&lt;/a&gt;`" @linkActivated="clickExtensionBtn"></q-label>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-view>
			<q-view layout='vbox' style="min-height:180px;" v-if="isExtensionBtnShow">
				<q-source-editor font-size="13" :text='activeExtensions' languageId='' :word-wrap='true'
					:line-number-visible='false' :end-at-last-line='true' :read-only='true'></q-source-editor>
			</q-view>
			
		
			
			<q-view layout='vbox' style="max-height: 125px;border: 1px solid #e5e5e5;">
				<q-view layout='hbox' id="reportTypeView" style="padding-left: 10px; min-height: 35px;">
					<q-label
						:text="`<span>系统: </span>${system.os === 1 ? 'windows' : 'Mac'}@${system.pcOsVersion}`"></q-label>
					<!-- <q-label  :text="`<span>PC开发环境操作系统版本号: </span>${system.pcOsVersion}`" ></q-label> -->
					<q-label style="padding-left: 1px;" :text="`<span>HBuilderX版本: </span>${hxVersion}`"></q-label>
				</q-view>
				<q-view layout='hbox' id="reportTypeView" style="padding-left: 10px; padding-top: -10px; min-height: 35px;">
					<q-label  style="padding-top: 0px;" 
						:text="`<span>HBuilderX安装路径: </span>${appRoot}`"></q-label>
				</q-view>
			</q-view>
			
			
			<q-view v-if="internal" layout="hbox">
				<q-label text="Bug级别:<span style='color: red;'> *</span>" id="labelView" stretch-factor='1'></q-label>
				<q-radio-group layout="hbox" layout-spacing='20' stretch-factor='1'>
					<q-radio  id="HXRadioButton" text="立即处理" :checked="severity == 4"
						@clicked="setBugLevel" data-value="4" />
					<q-radio id="HXRadioButton" text="严重" :checked="severity == 3" @clicked="setBugLevel"
						data-value="3" />
					<q-radio id="HXRadioButton" text="中等" :checked="severity == 2" @clicked="setBugLevel"
						data-value="2" />
					<q-radio id="HXRadioButton" text="低优先" :checked="severity == 1" @clicked="setBugLevel"
						data-value="1" />
					<q-view horizontal-size-policy="Expanding"></q-view>
				</q-radio-group>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-view>
			
		</q-view>
	</q-scroll-view>
</template>

<script>
	const hx = require('hbuilderx');
	const vscode = require('vscode')
	const os = require('os');
	const fs = require('fs')
	const path = require('path')
	const {
		execSync
	} = require('child_process')

	// 临时目录
	const tmpDir = path.join(os.tmpdir(), 'issue-reporter');
	if (!fs.existsSync(tmpDir)) {
		fs.mkdirSync(tmpDir);
	}
	console.log('tmpDir: ', hx.env);

	const AndroidBrand = ['华为', '小米', 'OPPO', 'vivo', '三星', '模拟器', '其它']
    
    const harmonyBrand = ['华为','模拟器']
    
	const IosBrand = ['苹果', '模拟器']

	const getPhoneInfo = hx.extensions.getExtension('uniapp-extension')

	export default {
		data() {
			return {
				initReportInfo: {},
				errorMsg: '',
				issueTypeList: ['Bug提交'],
				reportTypeList: [{
						label: 'HBuilderX',
						data: 4
					},
					{
						label: 'uni-app x',
						data: 6
					},
					{
						label: 'uni-app',
						data: 5
					}
				],
				
				sampleProjectName:"",
				
				browserVersion: '',
				projList: [], // 动态从hx获取
				issueType: 'Bug提交',
				
				reportType: {
					label: 'HBuilderX',
					data: 4
				},
				platform: {
					label: '微信',
					data: 1
				},
				brand: {
					label: 'VIVO',
					data: 11
				},
				cliVersion: '',
				renderMode: 1,
				moduleApi: '',
				proj: '',
                isVaporMode:false,
                
                reportTypeViewIndex:0,
				
				projectTypeList: [{
						label: '本地项目',
						data: 1
					},
					{
							label: 'Git地址',
							data: 2
				   }
				],
				
				sessions:[],
				currentConsoleIndex:-1,
				consoleList: [],
				consoleSessions:[],
				devToolVersion: '',
				baseVersion: '',

				title: '',
				step: '',
				internal: false,
				severity: 1,
				
				issuesReview:"",
				
				isDirty:false,

				isSystemBtnShow: false,
				isRunLogBtnShow: false,
				isExtensionBtnShow: false,
				isSystemChecked: true,
				isRunLogChecked: true,
				isExtensionChecked: true,
				
				screenshotPublic:true,
				projectPublic:true,
				isGitProject:false,
				
				sampleProjectTips:"请选择可复现项目",
				attachmentPathTips:"请选择附件",
				
				isHX:true,
				isUniAppX:false,
				
				hxmodule:'',
				hxmoduleIndex:'',
				unixmodule:'',
				unixmoduleIndex:'',
				
				error: {
					title: false,
					step: false,
					wantResult: false,
					runResult: false,
					phoneOsVersion: false,
					phoneModel: false,
					sampleProjectGit: false,
					phoneBrandOther: false,
					browserVersion: false,
					devToolVersion: false,
					baseVersion: false,
					cliVersion: false,
					attachmentPath:false,
					module: false,
					platform:false
				},

				system: {
					cpu: '',
					memory: '',
					loadavg: '',
					platform: '',
					os: '',
					pcOsVersion: ''
				},
				// phoneSystem: {
				// 	phoneOsPlatform: '',
				// 	phoneOsVersion: '',
				// 	phoneBrand: '',
				// 	phoneModel: ''	
				// },
				phoneOsPlatform:[],
				phoneOsVersion: '',
				phoneBrand: '',
				phoneBrandOther: '',
				phoneModel: '',
				phoneBrandList:[],
				hxVersion: '',
				systemInfo: '',
					
				runPlatform:'',
				systemInfoJson: {},
				runLog: '',
				hxrunLog: '',
				unixrunLog: '',
				activeExtensions: '',
				projCompressTargetFilePath: '',
				compactStatus: '',
				wantResult: '',
				runResult: {
					text: '',
					version: 0
				},
				ticket: '',
				sampleProjectGit: '',
				localProjectPath: '',
				isProjectPartfile:false,
				attachmentPath:'',
				picPath: [],
				sessionId: '',
				reportUrl: '',
				isLoading: false,
				appRoot: '',
				distribution: 1,
				modtree: '',
				moduleList: [],
				module: "",
				moduleName:"",
				moduleIndex: -1
			}
		},
		async mounted() {

			if (this.internal) {
				this.severity = 2;
			} else {
				this.severity = 0;
			}

			//const editor = vscode.window.activeTextEditor
			//this.isCli = this.getIsCli(editor.document.workspaceFolder?.uri?.path)
			//this.vueVersion = editor.document.workspaceFolder?.vueVersion || 2
			//console.log('editor: ', editor.document.workspaceFolder);

			this.deleteFilesInDirectory(tmpDir)
			let cpus = os.cpus()
			let memory = os.totalmem()
			let loadavg = os.loadavg()
			let platform = os.platform()

			if(hx.env.appArch){
				this.hxVersion = hx.env.appVersion + "(" + hx.env.appArch + ")";
			}else{
				this.hxVersion = hx.env.appVersion;
			}
			
			this.appRoot = hx.env.appRoot

			//this.phoneOsPlatform = this.platformList[0]
			//this.phoneBrand = this.phoneBrandList[0]

			this.getRunLog()
			this.getExtension()
			this.initPhoneInfo()
			if (cpus) {
				let cpuModel = cpus[0].model
				let cpuSpeed = cpus[0].speed
				let cpuNum = cpus.length
				this.system.cpu = `${cpuModel} (${cpuNum} x ${cpuSpeed})`

			}
			if (memory) {
				this.system.memory = `${memory / (1024 ** 3)}GB`
			}
			if (loadavg) {
				let loadavgArr = []
				loadavg.forEach(item => {
					loadavgArr.push(item.toFixed(0))
				})
				this.system.loadavg = loadavgArr.join(',')
			}
			if (platform) {
				this.system.platform = platform
				// windows: 1     mac: 2
				if (platform === 'darwin') {
					this.system.os = 2
					const macVersion = execSync('sw_vers -productVersion', {
						encoding: 'utf-8'
					})

					this.system.pcOsVersion = macVersion.replace(/\n/g, "")

				} else {
					this.system.os = 1
					this.system.pcOsVersion = os.release()
				}
				console.log('hx version: ', hx.env.appVersion);
				// console.log('this.system.platform', os.release());
			}
			this.systemInfoJson = {
				"osName": platform,
				"osVersion": this.system.pcOsVersion
			}
		
			this.getModtree()
			
			var lowerPlatform = this.runPlatform.toLowerCase();
			if(lowerPlatform == "android"){
				this.phoneOsPlatform.push(1);
			}
			if(lowerPlatform == "ios"){
				this.phoneOsPlatform.push(2);
			}
			if(lowerPlatform == "web"){
				this.phoneOsPlatform.push(3);
			}
			if(lowerPlatform == "weapp"){
				this.phoneOsPlatform.push(4);
			}
			
			await this.updatePhonePlatform()
			await this.updateUi()
		},
		computed: {
			isUniApp() {
				return this.reportType.label === this.reportTypeList[2].label
			},
			isApp() {
				return this.distribution == 1
			},
			isH5() {
				return this.distribution == 2
			},
			isApplet() {
				return this.distribution == 3
			},
			isFastApp() {
				return this.distribution == 6
			}
		},
		methods: {

			getIsCli(project) {
				// console.log('getIsCli', project);
				if(project == undefined){
					return false;
				}
				const packageJson = path.resolve(project, './package.json')

				const nodeModules = path.resolve(project, './node_modules')

				const manifestJson = path.resolve(project, './src/manifest.json')

				const pagesJson = path.resolve(project, './src/pages.json')

				const appVue = path.resolve(project, './src/App.vue')

				const appNVue = path.resolve(project, './src/App.nvue')

				const mainJs = path.resolve(project, './src/main.js')

				const mainTs = path.resolve(project, './src/main.ts')

				if (fs.existsSync(packageJson) && fs.existsSync(nodeModules) && fs.existsSync(manifestJson) && fs
					.existsSync(pagesJson) && (fs.existsSync(appVue) || fs.existsSync(appNVue)) && (fs.existsSync(
						mainJs) || fs.existsSync(mainTs))) {

					return true

				}

				return false

			},
			clearValidate() {
				this.error = {
					title: false,
					step: false,
					wantResult: false,
					runResult: false,
					phoneOsVersion: false,
					phoneModel: false,
					sampleProjectGit: false,
					phoneBrandOther: false,
					browserVersion: false,
					devToolVersion: false,
					baseVersion: false,
					cliVersion: false,
					module:false,
					platform:false
				}
			},
			setCurrentProjectType(projectType){
				if(projectType == 4){
					this.isHX = true;
					this.isUniAppX = false;
				}
				if(projectType == 6){
					this.isHX = false;
					this.isUniAppX = true;
				}
			},
			
			deleteFilesInDirectory(directoryPath, fileNameToDelete = null) {
				fs.readdirSync(directoryPath).forEach((file) => {
					const filePath = path.join(directoryPath, file);
					if (fs.statSync(filePath).isFile()) {
						if (fileNameToDelete === null || file === fileNameToDelete) {
							fs.unlinkSync(filePath); // 删除文件
						}
					}
				});
			},
			deleteAllFile() {
				this.deleteFilesInDirectory(tmpDir)
			},
			async setConsoleView(e) {
				this.isDirty = true
				let value = e.target['currentData'];
				if(this.sessionId !== value){
					this.sessionId = value;
					await this.initPhoneInfo();
				}
			},
			async initPhoneInfo() {
				if (!getPhoneInfo) return
				if (!this.sessionId) return;
				let devicesInfo = await getPhoneInfo.devicesInfo(this.sessionId)
				if (!devicesInfo) return
				const {
					platform,
					version
				} = devicesInfo
				
				let product = devicesInfo['ro.product.product.brand'] || devicesInfo['ro.product.brand']
				let phoneModel = devicesInfo['ro.product.product.model'] || devicesInfo['ro.product.model']
				this.phoneOsVersion = version
				this.phoneModel = phoneModel
				if (this.phoneBrandList.includes(product)) {
					// this.phoneBrand = platform
					this.phoneBrand = product
				} else {
					this.phoneBrand = '其它'
					this.phoneBrandOther = product
				}
				// this.platformList.forEach(item => {
				// 	if (item.label === platform) {
				// 		this.phoneOsPlatform = item
				// 	}
				// })
				await this.updateUi()
				//console.log('devicesInfo: ', devicesInfo);
			},
			async setProjectPublic(e){
				this.isDirty = true
				let value = e.target['data-value'];
				if(value.toLowerCase() === "true"){
					this.projectPublic = true;
				}else{
					this.projectPublic = false;
				}
			},
			async setscreenshotPublic(e){
				this.isDirty = true
				let value = e.target['data-value'];
				if(value.toLowerCase() === "true"){
					this.screenshotPublic = true;
				}else{
					this.screenshotPublic = false;
				}
			},
			async setBugLevel(e) {
				this.isDirty = true
				let value = e.target['data-value'];
				this.severity = parseInt(value);
			},
			async validateAttachmentPath(){
				var ret = true;
				this.error.attachmentPath = false
				this.attachmentPathTips = ""
				if(this.attachmentPath){
					if(!fs.existsSync(this.attachmentPath)){
						this.error.attachmentPath= true
						ret = false
						this.attachmentPathTips = "附件不存在"
					}
				}
				return ret;
			},
			async validateLocalProject(){
				var ret = true;
				this.error.sampleProjectGit = false
				this.sampleProjectTips = ""
				if(this.localProjectPath){
					if(!fs.existsSync(this.localProjectPath)){
						this.error.sampleProjectGit = true
						ret = false
						this.sampleProjectTips = "项目路径不存在"
					}
				}
				return ret;
			},
			async validate() {
				this.clearValidate()
				let isOk = true
				if (this.isHX) {
					if(!this.module){
						isOk = false
						this.error.module = true;
					}
				} else if (this.isUniAppX) {
					// uni-app x
					// if (!this.phoneOsVersion) {
					// 	this.error.phoneOsVersion = true
					// 	isOk = false
					// }
					// if (!this.phoneModel) {
					// 	this.error.phoneModel = true
					// 	isOk = false
					// }
					if (this.isGitProject) {
						// if(!this.sampleProjectGit){
						// 	this.error.sampleProjectGit = true
						// 	isOk = false
						// 	this.sampleProjectTips =  "请输入复现工程的git地址"
						// }
					}else{
						var sampleProject = await this.validateLocalProject();
						if(!sampleProject){
							isOk = false
						}
					}
					if(!this.module){
						isOk = false
						this.error.module = true;
					}
				} else if (this.isUniApp) {
					// uni-app
					if (this.isH5) {
						if (!this.browserVersion) {
							this.error.browserVersion = true
							isOk = false
						}
					}
					if (this.isApplet) {
						if (!this.baseVersion) {
							this.error.baseVersion = true
							isOk = false
						}
						if (!this.devToolVersion) {
							this.error.devToolVersion = true
							isOk = false
						}
					}
					if (!this.sampleProjectGit) {
						this.error.sampleProjectGit = true
						isOk = false
					}
					if (!this.cliVersion) {
						this.error.cliVersion = true
						isOk = false
					}
					// if (!this.phoneOsVersion) {
					// 	this.error.phoneOsVersion = true
					// 	isOk = false
					// }
					// if (!this.phoneModel) {
					// 	this.error.phoneModel = true
					// 	isOk = false
					// }
					if (!this.sampleProjectGit) {
						this.error.sampleProjectGit = true
						isOk = false
					}
					// if (this.phoneBrand === '其它' && !this.phoneBrandOther) {
					// 	this.error.phoneBrandOther = true
					// 	isOk = false
					// }
				}
				if (!this.title) {
					this.error.title = true
					isOk = false
				}
				if (!this.step) {
					this.error.step = true
					isOk = false
				}else{
					var step = this.step.trim();
					if(step === ''){
						this.error.step = true
						isOk = false
					}
				}
				
				var attachmentStaus= await this.validateAttachmentPath();
				if(!attachmentStaus){
					isOk = false
				}
				// if (!this.wantResult) {
				// 	this.error.wantResult = true
				// 	isOk = false
				// }
				if (!this.runResult) {
					this.error.runResult = true
					isOk = false
				}
				this.updateUi()
				return isOk
			},
			setIssueType(e) {
				this.issueType = e.target.currentText
				console.log('setIssueType:', this.issueType)
			},
			getmoduleList(node, path = []) {
				let result = [];
				if (node.name) {
					let currentPath = [...path, node.name];
					result.push({
						label: currentPath.join('/'),
						data: node.id,
						group_only:node?.group_only
					});
				}

				if (node.items) {
					node.items.forEach(subNode => {
						let childrenPaths = this.getmoduleList(subNode, [...path, node.name]);
						result = result.concat(childrenPaths);
					});
				}
				
				return result;
			},
			async setReportType(e) {
				this.isDirty = true;
				let value = e.target['data-value']
				// this.reportType = e.target.currentText
				this.reportType = {
					label: e.target.text,
					data: value
				}
				this.clearValidate()
				this.setCurrentProjectType(parseInt(this.reportType.data));
				if (this.reportType.label === 'uni-app x') {
					this.module = ''
					this.moduleName =''
					this.checkModtree();
				}else if(this.reportType.label === 'HBuilderX'){
					this.module = ''
					this.moduleName =''
					this.checkModtree();
				}
				if (this.isHX) {
					this.hxrunLog  = await this.getRunLog()
					this.runLog =  this.hxrunLog
				} else {
					if (getPhoneInfo && this.sessionId) {
						let appLog = await getPhoneInfo.getViewLog(this.sessionId)
						this.unixrunLog = appLog
					} else {
						this.unixrunLog = ''
					}
					this.runLog =  this.unixrunLog
					this.isExtensionBtnShow = false
				}
				await this.updateIssuesReview();
				await this.updateUi()
			},
			async setTitle(e) {
				this.title = e.target.text
				this.isDirty = true;
				this.error.title = false;
				await this.updateIssuesReview();
				await this.updateUi()
			},
			getunixCheckedText(){
				if(!this.phoneOsPlatform  || this.phoneOsPlatform.length === 0 || this.phoneOsPlatform.length === 6) {
					return ''
				}
				
				var ret="";
				if(this.phoneOsPlatform.includes(1) && this.phoneOsPlatform.includes(2)) {
					ret = ret + "、App平台"
				}else {
					if(this.phoneOsPlatform.includes(1)) {
						ret = ret + "、App-Android平台"
					}
					if(this.phoneOsPlatform.includes(2)) {
						ret = ret + "、App-iOS平台"
					}
				}
                if(this.phoneOsPlatform.includes(5)) {
                	ret = ret + "、鸿蒙"
                }
				if(this.phoneOsPlatform.includes(3)) {
					ret = ret + "、Web平台"
				}
				if(this.phoneOsPlatform.includes(4)) {
					ret = ret + "、微信小程序"
				}
                if(this.phoneOsPlatform.includes(6)) {
                	ret = ret + "、支付宝小程序"
                }
				
				const regex = new RegExp('^' + "、"); 
				ret =  ret.replace(regex, ""); 
				return ret;
			},
			async updateIssuesReview(){
				if(!this.internal) return;
				const regex = /[\u3002|\.]+$/;
				if (this.reportType.label === 'uni-app x') {
					const moduleArr = this.moduleName?.split("/")
					var name = moduleArr?.length >0 ? moduleArr[0] :'';
					this.issuesReview = "* " + this.getunixCheckedText() + " 修复 " + name + " " + this.title?.replace(regex, '');
	
				}else if(this.reportType.label === 'HBuilderX'){
					this.issuesReview = "* 修复 " +  this.title?.replace(regex, '');
				}
			},
			async setStep(e) {
				if(this.step !== e.target.text){
					this.isDirty = true;
					this.step = e.target.text;
				}
				this.error.step = false
				await this.updateUi()
			},
			async addPic() {
				// this.picPath = '/Users/guoyang/Documents/1.png'
				if (this.picPath.length >= 6) return
				this.isLoading = true
				this.updateUi()
				// if (getPhoneInfo && this.sessionId && !this.isHX) {
				// 	let screencap = await getPhoneInfo.screencap(this.sessionId, tmpDir)
				// 	if (screencap) {
				// 		this.picPath.push(screencap)
				// 	}
				// } else {
				// 	let [file] = await hx.window.showOpenDialog({filters: '*.jpg;*.png;'})
				// 	if (file) {
				// 		this.picPath.push(file)
				// 	}

				// }
				this.isLoading = true
				let [file] = await hx.window.showOpenDialog({
					filters: '*.*'
				})
				if (file) {
					this.picPath.push(file)
				}
				this.isLoading = false
				await this.updateUi()
			},
			async addScreencap() {
				this.isLoading = true
				await this.updateUi()
				if (getPhoneInfo && this.sessionId && !this.isHX) {
					let screencap = await getPhoneInfo.screencap(this.sessionId, tmpDir)
					if (screencap) {
						this.picPath.push(screencap)
					}
				}
				this.isLoading = false
				await this.updateUi()
			},
			async removePic(e) {
				let index = e.target['data-index']
				this.picPath.splice(index, 1)
				this.deleteFilesInDirectory(tmpDir, this.picPath[index])
				this.updateUi()
			},
			updatePhonePlatform(){
				if(!this.phoneOsPlatform  || this.phoneOsPlatform.length === 0){
					this.phoneBrandList =[];
					return;
				}
				this.phoneBrandList =[];
				if(this.phoneOsPlatform.length === 1){
					if(this.phoneOsPlatform.includes(1)){
						this.phoneBrandList = AndroidBrand; 
						return;
					}
                    if(this.phoneOsPlatform.includes(5)){
                    	this.phoneBrandList = harmonyBrand; 
                    	return;
                    }
					if(this.phoneOsPlatform.includes(2)){
						this.phoneBrandList = IosBrand; 
						return;
					}
				}
                
                var arr1 = AndroidBrand;
                var arr2 = IosBrand;
                if(this.phoneOsPlatform.length === 2){
                    if(this.phoneOsPlatform.includes(5)){
                        arr2 = harmonyBrand;
                        if(this.phoneOsPlatform.includes(1)){
                            arr1 = AndroidBrand;
                        }
                        if(this.phoneOsPlatform.includes(2)){
                            arr1 = IosBrand;
                        }
                    }
                }
				
				var arr = arr1.concat(arr2); 
				let arrNew= new Set(arr); 
				this.phoneBrandList = Array.from(arrNew); 
			},
			async setPlatform(e) {
				let value = parseInt(e.target['data-value'])
				if(e.target.checked) {
					this.phoneOsPlatform.push(value)
				}else {
					this.phoneOsPlatform.splice(this.phoneOsPlatform.indexOf(value),1)
				}
				if(this.phoneOsPlatform.length === 0 ) {
					await this.updateUi()
					this.phoneOsPlatform.push(value)
					await this.updateUi()
				}
								
				this.isDirty = true
				this.updatePhonePlatform();
				this.error.platform = false
				
				await this.updateIssuesReview();
				await this.updateUi();
			},
            async setVaporMode(e){
                if(e.target.checked) {
                   this.isVaporMode = true; 
                }else{
                    this.isVaporMode = false;
                }
                await this.updateUi()
            },
			async setprojectTypeList(e){
				this.isDirty = true
				if (e.target.currentData === 2) {
					this.isGitProject = true;
				} else {
					this.isGitProject = false;
				}
				this.error.sampleProjectGit = ''
				await this.updateUi()
			},
			async setModule(e) {
				if(this.module !== e.target.currentData){
					this.isDirty = true;
				}
				
				this.module = e.target.currentData;
				this.moduleIndex = e.target.currentIndex;
				
				if (this.isHX) {
					this.hxmodule = e.target.currentData;
					this.hxmoduleIndex = e.target.currentIndex;
				}
				
				if (this.isUniAppX) {
					this.unixmodule = e.target.currentData;
					this.unixmoduleIndex = e.target.currentIndex;
					this.moduleName = e.target.currentText
				}
				this.error.module = false
				await this.updateIssuesReview();
				await this.updateUi()
			},
			async setBrand(e) {
				this.phoneBrand = e.target.currentText
				await this.updateUi()
			},
			async brandEditTextChange(e) {
				this.phoneBrand = e.target.currentText
				await this.updateUi()
			},
			setModuleApi(e) {
				this.moduleApi = e.target.currentText
				console.log('setModuleApi', this.moduleApi)
			},
			setProj(e) {
				this.proj = e.target.currentText
				console.log('setProj', this.proj)
			},
			setSystemChkState(e) {
				this.isSystemChecked = e.target.checked
				console.log('setSystemChkState:' + e.target.checked)
			},
			setRunLogChkState(e) {
				this.isDirty = true
				this.isRunLogChecked = e.target.checked
				console.log('setRunLogChkState:' + e.target.checked)
			},
			setExtensionChkState(e) {
				this.isDirty = true
				this.isExtensionChecked = e.target.checked
				console.log('setExtensionChkState:' + e.target.checked)
			},
			initSystemInfo() {
				if (this.systemInfo.length == 0) {
					this.systemInfo += 'CPU    \t\t' + this.system.cpu + '\n'
					this.systemInfo += '内存   \t\t' + this.system.memory + '\n'
					this.systemInfo += '平均负载\t\t' + this.system.loadavg + '\n'
					this.systemInfo += '系统平台\t\t' + this.system.platform
				}
			},
			async clickSystemBtn() {
				if (!this.isSystemBtnShow) {
					this.initSystemInfo()
				}
				this.isSystemBtnShow ? this.isSystemBtnShow = false : this.isSystemBtnShow = true
				await this.updateUi()
			},
			setSystemInfo(e) {
				console.log(e.target.text)
				this.systemInfo = e.target.text
			},
			setPhoneOsVersion(e) {
				this.phoneOsVersion = e.target.text
			},
			setPhoneModel(e) {
				this.phoneModel = e.target.text
			},
			setPhoneBrandOther(e) {
				this.phoneBrandOther = e.target.text
			},
			async getRunLog() {
				return new Promise((resolve, reject) => {
					let logPath = hx.env.appData;
					logPath = path.join(logPath,".log")
					try {
						fs.readFile(logPath, 'utf-8', (err, data) => {
							// console.log(err ,data)
							if (err) {
								console.log(err)
								resolve('')
							} else {
								this.hxrunLog = data
								resolve(data)
							}
						})
					} catch (e) {
						console.log(e)
						resolve('')
					}
				})
			},
			async clickRunLogBtn() {
				this.isDirty = true
				if (!this.isRunLogBtnShow) {
					if (this.isHX) {
						this.hxrunLog  = await this.getRunLog()
						this.runLog =  this.hxrunLog
					} else {
						if (getPhoneInfo) {
							let appLog = await getPhoneInfo.getViewLog(this.sessionId)
							this.unixrunLog = appLog
						} else {
							this.unixrunLog = ''
						}
						this.runLog =  this.unixrunLog
					}
					// console.log('clickRunLogBtn',ret)
				}
				this.isRunLogBtnShow ? this.isRunLogBtnShow = false : this.isRunLogBtnShow = true
				await this.updateUi()
			},
			async getExtsList() {
				return new Promise((resolve, reject) => {
					try {
						let exts = hx.extensions.all()
						let extIdArray = []
						for (let i = 0; i < exts.length; ++i) {
							let ext = exts[i]
							let extPackage = ext.packageJSON
							extIdArray.push(`${ext['id']}@${extPackage.version}`)
						}
						// console.log('getExtsList',extIdArray)
						resolve(extIdArray)
					} catch (e) {
						console.log(e)
						resolve([])
					}
				})
			},
			async getExtension() {
				const exts = await this.getExtsList()
				this.activeExtensions = ''
				for (let i = 0; i < exts.length; ++i) {
					this.activeExtensions += exts[i] + '\n'
				}
			},
			async clickExtensionBtn() {
				this.isDirty = true;
				if (!this.isExtensionBtnShow) {
					await this.getExtension()
				}
				this.isExtensionBtnShow ? this.isExtensionBtnShow = false : this.isExtensionBtnShow = true
				await this.updateUi()
			},
			async getModtree() {
				try {
					let result = await hx.http.request({
						url: this.reportUrl + '/get-modtree',
						method: 'post',
						serviceOptions: {
							serviceRequest: true
						}
					})

					if (result && result.service.code === 1001) {
						this.modtree = result.service.body.data.products;
						this.moduleList = []
						
						this.checkModtree();
						await this.updateIssuesReview();
						await this.updateUi()
					}
				} catch (e) {
					console.log("get-modtree e:",e);
				}
			},
			checkModtree(){
				if(!this.modtree) return;
				this.moduleList = [];
				for (var item of this.modtree) {
					if (this.isHX) {
						if (item.id === "HBuilderX") {
							var hxItem = {
								"label": item.id,
								"data": item.name,
								"group_only":item?.group_only
							}
							var tmpModuleList =[];
							console.log("HBuilderX")
							for (var tmp of item.items) {
								tmpModuleList = tmpModuleList.concat(this.getmoduleList(tmp));
							}
							tmpModuleList.unshift(hxItem);
							this.moduleList = tmpModuleList.filter((item) => {
								if (item && !item?.group_only) {
									return true;
								}
							});
							break;
						}
					}
					if (this.isUniAppX) {
						if (item.id === "uni-app-x") {
							var unixItem = {
								"label": item.id,
								"data": item.name,
								"group_only":item?.group_only
							}
							var tmpModuleList =[];
							console.log("uni-app-x")
							for (var tmp of item.items) {
								tmpModuleList = tmpModuleList.concat(this.getmoduleList(tmp));
							}
							tmpModuleList.unshift(unixItem);
							this.moduleList = tmpModuleList.filter((item) => {
								if (item && !item?.group_only) {
									return true;
								}
							});
							break;
						}
					}
				}
				if (this.isHX) {
					if(this.hxmodule){
						this.module = this.hxmodule;
						var data = this.moduleList.find((item, index) => {
						    return item.data === this.module;
						})
						if(data){
							this.moduleIndex = this.moduleList.indexOf(data)
							this.moduleName  = data.label
						}
					}else{
						this.moduleIndex = -1
					}
				}
				
				if (this.isUniAppX) {
					if(this.unixmodule){
						this.module = this.unixmodule;
						var data = this.moduleList.find((item, index) => {
						    return item.data === this.module;
						})
						if(data){
							this.moduleIndex = this.moduleList.indexOf(data)
							this.moduleName  = data.label
						}
					}else{
						this.moduleIndex = -1
					}
				}
			},
			async setWantResult(e) {
				if(this.wantResult !== e.target.text){
					this.isDirty = true;
					this.wantResult = e.target.text;
				}
				
				this.error.wantResult = false
				await this.updateUi()
			},
			async setRunResult(e) {
				this.runResult = {
					text: e.target.text,
					version: e.target.editorVersion
				}
				this.error.runResult = false
				await this.updateUi()
			},
			async attachmentPathUpdate(e){
				this.attachmentPath = e.target.text
				await this.validateAttachmentPath()
				await this.updateUi()
			},
			async setAttachmentPath(e){
				 let [file] = await hx.window.showOpenDialog({
				 	filters: '*.*'
				 })
				 if (file) {
				 	this.attachmentPath = file;
				 }
				 await this.validateAttachmentPath()
				 await this.updateUi()
			},
			async setProjectPartfile(e){
				let value = e.target['data-value'];
				if(value.toLowerCase() === "true"){
					this.isProjectPartfile = true;
				}else{
					this.isProjectPartfile = false;
				}
				await this.updateUi()
			},
			async setlocalProjectPath(e){
				
				var workspaceFolders = await hx.workspace.getWorkspaceFolders();
				var projectId ;
				if(Array.isArray(this.consoleSessions)){
					for (var item of this.consoleSessions){
						if(item.sessionId === this.sessionId){
							projectId = item?.document?.workspaceFolder?.id
						}
					}
				}
				
				var projectItems = [];
				const extension =  hx.extensions.getExtension('uniapp-extension');
				
				var currentProject = 0;
				
				if(extension){
					for (var item of workspaceFolders) {
						if (item && item.nature == 'UniApp_Vue') {
							var columns;
							const isUnix = await extension.isUniAppx(item?.uri?.fsPath);							
							if(isUnix){
								projectItems.push({
									columns: [{
										label: item.name,
										data: item.uri.fsPath,
										projectId:item.id
									}]
								});
							}
						}
					}
				}
				
				for(var index = 0; index < projectItems.length; index ++){
					var tmpItem = projectItems[index];
					var columns = tmpItem?.columns;
					if(projectId && columns[0].projectId === projectId){
						currentProject = index;
						break;
					}
				}
				
				var res = await hx.window.showFormDialog({
					title: "选择uni-app x项目",
					width:480,
					height:360,
					formItems: [{
						"type": "list",
						"title": "项目列表",
						"name": "projectList",
						"columnStretches": [1],
						"items": projectItems,
						"value": currentProject,
						"multiSelection": false,
						"searchable": false
					}]
				});
				
				if(res && res.hasOwnProperty("projectList") && parseInt(res.projectList) >= 0  && projectItems.length > 0){
					var selectItem = projectItems[parseInt(res.projectList)];
					if(selectItem && selectItem?.columns[0]?.data){
						this.sampleProjectName = selectItem?.columns[0]?.label;
						this.localProjectPath = selectItem?.columns[0]?.data;
						await this.validateLocalProject()
						await this.updateUi()
					}
				}
			},
			async setSampleProjectGit(e) {
				this.isDirty = true
				this.sampleProjectGit = e.target.text
			},
			async localProjectPathUpdate(e){
				this.isDirty = true
				this.localProjectPath = e.target.text
				await this.validateLocalProject()
				await this.updateUi()
			},
			getFileName(filePath) {
				const fileName = path.basename(filePath);
				return fileName
			}
		}
	}

</script>

<style>
	* {
		font-family: 'microsoft yahei';
		color: #405E42;
		font-size: 13px;
	}
	
	*:disabled{
	    color: #B1B1B1;
	}
	

	#scrollView {
		width: 100%;
		background: transparent;
		border: none;
	}

	#scrollView QFrame {
		width: 100%;
		background: transparent;
		border: none;
	}

	#reportTypeView {
		width: 100%;
		min-height: 40px;
		background-color: transparent;
	}
	
	#titleInput {
		height: 28px;
		border: 1px solid #ccc;
	}

	#labelInfo {
		margin-left: 10px;
	}

	QComboBox {
		height: 26px;
		border: 1px solid #e5e5e5;
		background: #FFFEFA;
	}

	QComboBox:hover,
	QComboBox:focus {
		border: 1px solid #43C45B;
	}

	QComboBox::down-arrow {
		/* image: url(:/hxui/resource/branch-open.png) */
		image: url(:/login/icons/down-arrow-fill.png);
	}

	QComboBox::drop-down {
		subcontrol-position: top right;
		width: 32px;
		border: none;
	}

	QComboBox QAbstractItemView {
		background: #FFFEFA;
		color: #405E42;
		selection-color: #405E42;
	}

	QComboBox QAbstractItemView::item {
		min-height: 26px;
		background: #FFFEFA;
		border-left: 1px solid #e5e5e5;
		border-right: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
	}

	QComboBox QAbstractItemView::item:hover,
	QComboBox QAbstractItemView::item:selected {
		background: #FAFFFA;
	}

	#HXButton {
		border: 1px solid #009944;
		background: #fafffa;
		color: #54ae6c;
		padding: 2px 5px;
		height: 20px;
	}
	
	#HXButton:hover{
	    background: #EDFDED;
	    border-color: #009944;
	}
	
	#HXButton:pressed{
	    background: #E1F0E1;
	    border-color: #0D9E4D;
	}
	
	#HXButton:disabled{
	    border:1px solid #DCDCDC;
	    background: #F3F3F3;
	    color: #B1B1B1;
	}

	#HXInput {
		height: 26px;
		border: 1px solid #e5e5e5;
		background: transparent;
	}

	#HXInput:hover,
	#HXInput:focus {
		background: transparent;
		border-color: #43c45b;
	}

	#error {
		color: #de0000;
		font-size: 13px;
	}

	#HXRadioButton {
		max-width: 100px;
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

	#labelView {
		min-width: 10px;
		max-width: 10px;
		color: #405E42;
		font-size: 13px;
	}
	
	#labelView2 {
		min-width: 200px;
		max-width: 200px;
		color: #405E42;
		font-size: 13px;
	}

	#HXCheckBox {
		font-size: 13px;
		color: #405E42;
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
	
	#HXRadioButton::indicator::unchecked{
	    image:url(:/hxui/resource/rdbt.png);
	}
	
	#HXRadioButton::indicator::unchecked:hover{
	    image:url(:/hxui/resource/rdbt-hover.png);
	}
	
	#HXRadioButton::indicator::checked{
	    image:url(:/hxui/resource/rdbt-checked.png);
	}
	
	#HXRadioButton::indicator::unchecked:pressed,
	#HXRadioButton::indicator::checked:pressed{
	    image:url(:/hxui/resource/rdbt-pressed.png);
	}
	
	#HXRadioButton::indicator:disabled{
	    image:url(:/hxui/resource/rdbt.png);
	}
	#HXRadioButton::indicator:checked:disabled{
	    image:url(:/hxui/resource/rdbt-check-disabled.png);
	}

	/* #systemInfo {
		border: 1px solid #e5e5e5;
		height: 100px;
	} */

</style>
