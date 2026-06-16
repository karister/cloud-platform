<template>
	<q-view layout="hbox" layout-spacing="0">
		<q-view layout="vbox" layout-spacing="0">
			<q-view layout="hbox">
				<q-label id="JsonFormTitleLabel" :text='text'></q-label>
				<Radio :items="items" :defaultValue="modulesItem.__treeShaking__" @checkChange="updateData" :dataKey="[...dataKey, '__treeShaking__']"></Radio>
				<q-view horizontal-size-policy="Expanding"></q-view>
			</q-view>
			<q-label :openExternalLinks="true" id="JsonFormAppModuleDescriptionLabel" :visible="lableText" :text="lableText"></q-label>
		</q-view>
		<q-view layout="vbox" :visible="!!modulesItem.visibleArrow">
			<q-button id="buttonClosed" @clicked="switchButton" :visible="!showDetail"></q-button>
			<q-button id="buttonOpen" @clicked="switchButton" :visible="showDetail"></q-button>
		</q-view>

	</q-view>
	<q-view style="margin-left: 10px;margin-top: 5px;" layout="vbox" layout-spacing="10" :visible="showDetail">
		<q-view layout="vbox" v-if="modulesItem.parameters">
			<q-view layout="vbox" v-for="(parameter) in modulesItem.parameters">
				<Input @sendTextChanged="updateData" :inputLableText="parameter.title" :inputLableSubText="parameter.des" :text="manifestJsonValue([...dataKey,parameter.key])"
					:dataKey="[...dataKey,parameter.key]" :errorText="error?.[[...dataKey,parameter.key].join('.')]">
				</Input>
			</q-view>
		</q-view>
		<q-view layout="vbox" v-if="modulesItem.platforms">
			<q-view layout="vbox" v-if="modulesItem.showPlatforms">
				<JsonFormItem :descriptionTitle="`支持的平台（至少选一项）${manifestJson?.app?.distribute?.modules?.[modulesItem.id]?.__platform__}`">
					<q-view layout="vbox" layout-spacing="8" id="checkBoxBorder">
						<CheckBox v-for="(platform) in modulesItem.platforms" :text="platform.platform" :checked="manifestJsonValueCheckbox([...dataKey,'__platform__'],platform.platform,true)"
							:dataKey="[...dataKey,'__platform__']" @sendClick="updateDataCheckbox" :dataValue="platform.platform">
						</CheckBox>
					</q-view>
				</JsonFormItem>
			</q-view>
			<q-view layout="vbox" layout-spacing="0" v-for="(platform) in modulesItem.platforms">
				<q-view layout="vbox" layout-spacing="0" v-for="(platformParameter) in platform.parameters">
					<Input @sendTextChanged="updateData" :inputLableText="platformParameter.title" :inputLableSubText="platformParameter.des"
						:text="manifestJsonValue([...dataKey,platformParameter.key])" :dataKey="[...dataKey,platformParameter.key]" :errorText="error?.[[...dataKey,platformParameter.key].join('.')]">
					</Input>
				</q-view>
			</q-view>
		</q-view>
		<q-view layout="vbox" v-if="modulesItem.subModules  && modulesItem.subModules.length ">
			<AppSubModule @setVueDataInfo="setVueDataInfo" @setVueDataInfoCheckBoxArray="setVueDataInfoCheckBoxArray" :subModules="modulesItem.subModules" :manifestJson="manifestJson"
				:dataKey="[...dataKey]"></AppSubModule>
		</q-view>
	</q-view>
</template>


<script>
	export default {
		data() {
			return {
				showDetail: false,
				items: [{
						name: "自动摇树",
						value: "auto"
					},
					{
						name: "强制添加",
						value: "add"
					},
					{
						name: "强制移除",
						value: "remove"
					}
				]
			}
		},
		computed: {},
		emits: ['setVueDataInfo', 'setVueDataInfoCheckBoxArray'],
		props: ['text', 'dataKey', 'checked', 'lableText', 'modulesItem', 'error', 'manifestJson'],
		methods: {
			async switchButton() {
				this.showDetail = !this.showDetail
				this.initModule()
				await this.updateUi()
			},
			updateData(e) {
				this.$emit('setVueDataInfo', e);
			},
			updateDataCheckbox(e) {
				// 最少选一项
				this.$emit('setVueDataInfoCheckBoxArray', e);
			},
			initModule() {
				if (this.showDetail) {
					if (!this?.manifestJson?.app?.distribute?.modules?.[this.modulesItem.id]?.__treeShaking__) {
						this.$emit('setVueDataInfo', {
							target: {
								"data-key": [...this.dataKey, '__treeShaking__'],
								text: this.modulesItem.__treeShaking__
							}
						});
					}
					if (!this?.manifestJson?.app?.distribute?.modules?.[this.modulesItem.id]?.__platform__) {
						this.$emit('setVueDataInfo', {
							target: {
								"data-key": [...this.dataKey, '__platform__'],
								text: this.modulesItem.__platform__
							}
						});
					}
				}
			},

		},
		computed: {},
		mounted() {},
	}
</script>


<style lang='qss'>
	#buttonClosed {
		background-repeat: no-repeat;
		background-color: transparent;
		background-image: url(@icon.folder@branch-closed.png);
		background-position: center;
	}

	#buttonOpen {
		background-repeat: no-repeat;
		background-color: transparent;
		background-image: url(@icon.folder@branch-open.png);
		background-position: center;
	}

	#JsonFormTitleLabel {
		color: @settings.checkboxForeground@;
		font-size: 10pt;
		padding: 0;
	}

	#JsonFormAppModuleDescriptionLabel {
		color: @descriptionForeground@;
		font-size: 9pt;
	}

	#navigationScrollView #ErrorWidgetView {
		background-color: @inputValidation.errorBackground@;
	}

	#ErrorLabel {
		padding: 5px 0px;
		color: @editorError.foreground@;
		font-weight: bold;
		background-color: @inputValidation.errorBackground@;
	}
</style>


<style when="isMac">
	#JsonFormTitleLabel {
		font-size: 14pt;
	}

	#JsonFormAppModuleDescriptionLabel {
		font-size: 13pt;
	}
</style>