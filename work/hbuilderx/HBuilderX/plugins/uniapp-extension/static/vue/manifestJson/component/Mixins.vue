<template>
	<q-view></q-view>
</template>

<script>
	const hx = require('hbuilderx');
	const path = require('path');
	const fs = require('fs');
	export default {
		data() {
			return {}
		},
		computed: {
			manifestJsonValue() {
				return (keys) => {
					let current = this.manifestJson || {};
					for (let key of keys) {
						if (current && current.hasOwnProperty(key)) {
							current = current[key];
						} else {
							return '';
						}
					}
					return current;
				}
			},
			manifestJsonValueCheckbox() {
				return (keys, value, defaultValue = '') => {
					let current = this.manifestJson;
					for (let key of keys) {
						if (current && current.hasOwnProperty(key)) {
							current = current[key];
						} else {
							return defaultValue;
						}
					}
					if (value) {
						if (current) {
							return current?.includes?.(value)
						} else {
							return false
						}
					}
					if (typeof current !== 'boolean') {
						return current !== undefined
					}
					return current;
				}
			},
		},
		methods: {
			async btnClick(e) {
				try {
					const key = e.target['data-key'];
					const filters = e.target['data-filters'] || '*.png';
					let defaultUri = this.manifestJsonValue(key)
					if (defaultUri && !path.isAbsolute(defaultUri)) {
						const absolutePath = path.join(this.workspaceFolder.uri.fsPath, defaultUri)
						if (fs.existsSync(absolutePath)) {
							defaultUri = absolutePath
						}
					}
					let [pngPath] = await hx.window.showOpenDialog({
						filters,
						defaultUri
					}) || []
					if (pngPath) {
						e.target.text = this.relativePath(pngPath)
						this.setVueDataInfo(e)
					}
				} catch (e) {
					console.log(e);
				}
			},
			async btnTemplateClick(e) {
				try {
					let [selectPath] = await hx.window.showOpenDialog({
						filters: '*'
					}) || []
					if (selectPath) {
						e.target.text = selectPath
						this.setVueDataInfo(e)
					}
				} catch (e) {
					console.log(e);
				}
			},
			relativePath(pngPath) {
				if (pngPath.startsWith(this.workspaceFolder.uri.fsPath)) {
					pngPath = path.relative(this.workspaceFolder.uri.fsPath, pngPath);
				}
				if (pngPath) {
					pngPath = pngPath.replace(/\\/g, '/');
				}
				return pngPath
			},
			setVueDataInfo(e) {
				const keys = e.target["data-key"]
				let value = e.target.text
				let current = this.manifestJson;
				keys.forEach((key, index) => {
					if (index === keys.length - 1) {
						current[key] = value;
					} else {
						current[key] = current[key] || {};
					}
					current = current[key];

				});
				let isCheckBox = e.target.isCheckBox
				if (isCheckBox && value === 'deleteParent') {
					this.removeAttribute(this.manifestJson, keys.slice(0, -1))
				}
				if (isCheckBox && value === 'deleteSelf') {
					this.removeAttribute(this.manifestJson, keys)
				}
				if (e.target.isInput && e.target.removeEmpty && value === '') {
					this.removeAttribute(this.manifestJson, keys)
				}
				this.$mitt.emit('updateJson', this.manifestJson)
			},
			async setVueDataInfoCheckBoxArray(e) { // 针对CheckBox写数组数据，当数组最后为空的时候则不能全部删除
				const keys = e.target["data-key"]
				const dataValue = e.target["data-value"]
				let check = e.target.text
				let current = this.manifestJson;
				keys.forEach((key, index) => {
					if (index === keys.length - 1) {
						if (check) {
							if (current[key]) {
								if (!current[key].includes(dataValue)) {
									current[key].push(dataValue);
								}
							} else {
								current[key] = [dataValue];
							}
						} else {
							const filterData = current[key]?.filter(item => item !== dataValue);
							current[key] = filterData
							// if (removeAll || filterData.length !== 0) {
							// } else {
							// }
						}
					} else {
						current[key] = current[key] || {};
					}
					current = current[key];
				});
				this.$mitt.emit('updateJson', this.manifestJson)
			},
			async updateData(data) {
				for (let key in data) {
					this[key] = data[key]
				}
				await this.updateUi()
			},
			removeAttribute(obj, pathArray) {
				try {
					let currentObj = obj;
					for (let i = 0; i < pathArray.length - 1; i++) {
						if (currentObj[pathArray[i]]) {
							currentObj = currentObj[pathArray[i]];
						} else {
							return;
						}
					}

					const lastKey = pathArray[pathArray.length - 1];
					delete currentObj[lastKey]
				} catch (error) {}
			},
			setFocus(key) {
				this.$refs[key].setFocus()
			}
		}
	}
</script>

<style lang='qss'>

</style>