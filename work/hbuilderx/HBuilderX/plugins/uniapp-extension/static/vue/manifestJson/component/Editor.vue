<template>
	<q-view style="margin: 5px;" layout="vbox">
		<SubTitle :titleText="titleText" :descriptionTitle="descriptionTitle"></SubTitle>
		<q-source-editor :follow-theme="true" id="editor" :margins-visible="false" :margin-fold-visible="false" :text="editorValue" languageId="markdown" :word-wrap="true" :line-number-visible="false" end-at-last-line="true" @modified="setEditor"
			:data-key="dataKey"></q-source-editor>
		<q-view layout="vbox" id="ErrorWidgetView" :visible='!!errorText'>
			<q-label id="ErrorLabel" :text="`${titleText}: ${errorText}`"></q-label>
		</q-view>
	</q-view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			editorValue() {
				return this.text?.join?.('\n')
			},
		},
		methods: {
			async setEditor(e) {
				if (e.target.text) {
					e.target.text = [...e.target.text.split(/\r|\n|\r\n|\n\r/)]
				}
				this.$emit('sendTextChanged', e);
			}
		},
		emits: ['sendTextChanged'],
		props: {
			text: {
				default: ''
			},
			errorText: {
				default: ''
			},
			titleText: {
				default: ''
			},
			descriptionTitle: {
				default: ''
			},
			dataKey: {
				default: []
			},
		}
	}
</script>

<style lang='qss'>
	#editor {
		min-height: 100px;
		border: 1px solid @sideBar.border@;
		background: @editor.background@;
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