<template>
	<SubTitle :titleText="inputLableText" :descriptionTitle="inputLableSubText"></SubTitle>
	<q-combox :items="items" :placeholderText="placeholderText" @editTextChanged="editTextChanged" :editable="editable" :currentText='currentText' @currentIndexChanged="currentIndexChanged"
		:data-key="dataKey"></q-combox>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		emits: ['editTextChanged', 'currentIndexChanged'],
		props: ['items', 'editable', 'currentText', 'dataKey', 'inputLableText', 'inputLableSubText', 'placeholderText'],
		methods: {
			async editTextChanged(e) { // 修改文本出发
				e.target.text = e.target.currentText
				this.$emit('editTextChanged', e);
			},
			async currentIndexChanged(e) { // 选择触发
				e.target.text = e.target.currentText
				this.$emit('currentIndexChanged', e);
			}
		}
	}
</script>


<style lang='qss'>
	/* 用id不生效,不知道啥问题 */
	QComboBox {
		height: 26px;
		color: @settings.dropdownForeground@;
		font-size: 10pt;
		border: 1px solid @settings.dropdownListBorder@;
		background-color: @settings.dropdownBackground@;
		padding-left: 5px;
		padding-right: 5px;
	}

	QComboBox:on {
		background-color: @settings.dropdownBackground@;
	}

	QComboBox::drop-down {
		background-color: @settings.dropdownBackground@;
		border: none;
	}

	QComboBox::down-arrow {
		image: url(@icon.folder@arrow-down.png);
	}

	QComboBox QAbstractItemView {
		border: 1px solid @settings.dropdownListBorder@;
		font-size: 10pt;
		padding: 0px;
		outline: none;
	}

	QComboBox QAbstractItemView::item {
		border-bottom: 1px solid @inputList.border@;
		padding: 2px;
		color: @settings.dropdownForeground@;
	}

	QComboBox QAbstractItemView::item:hover {
		background-color: @list.hoverBackground@;
		color: @settings.dropdownForeground@;
	}

	QComboBox QListView::Item {
		background-color: @settings.dropdownBackground@;
		border-bottom: 1px solid @settings.dropdownListBorder@;
		border-left: 1px solid @settings.dropdownListBorder@;
		border-right: 1px solid @settings.dropdownListBorder@;
	}

	QComboBox QListView::Item:hover {
		background: @inputList.hoverBackground@;
	}

	/* 	#QComboBox QListView::Item:selected:!active,
	#QComboBox QListView::Item:selected:active {
		background: @inputList.hoverBackground@;
	} */
	QComboBox QListView::Item:selected {
		background: @inputList.hoverBackground@;
	}
</style>


<style when="isMac">
	QComboBox {
		font-size: 14pt;
	}

	QComboBox QAbstractItemView {
		font-size: 14pt;
	}
</style>