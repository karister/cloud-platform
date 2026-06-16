<template>
	<!-- <Tab :platfroms="platfroms">
		<template v-for="(platfrom) in platfroms" v-slot:[platfrom.name]>
			<q-view layout="hbox" layout-spacing="20">
			</q-view>
		</template>
	</Tab> -->
	<!-- 把tab整个切换的都封装过来，需要用到动态 -->
	<q-view layout="hbox" layout-spacing="0">
		<template v-for="(platfrom) in platfroms">
			<q-button :visible="`${platfrom.name == showPlatfrom}`" id="TabActive" horizontal-size-policy="Preferred" vertical-size-policy="Preferred" :text='platfrom.name'
				@clicked="btnClick(platfrom.name)"></q-button>
			<q-button :visible="`${platfrom.name != showPlatfrom}`" id="Tab" horizontal-size-policy="Preferred" vertical-size-policy="Preferred" :text='platfrom.name'
				@clicked="btnClick(platfrom.name)"></q-button>
		</template>
	</q-view>
	<q-view layout="vbox" layout-spacing="8" v-for="(platfrom) in platfroms" :visible="`${platfrom.name == showPlatfrom}`">
		<slot :name="platfrom.name"></slot>
	</q-view>
</template>


<script>
	export default {
		data() {
			return {
				showPlatfrom: this.platfroms[0]?.name
			}
		},
		emits: ['sendBtnclick'],
		props: {
			btnText: {
				default: ''
			},
			enabled: {
				default: true
			},
			platfroms: {
				default: []
			},

		},
		methods: {
			async btnClick(p) {
				this.showPlatfrom = p
				this.updateUi()
			}
		},
	}
</script>

<style lang='qss'>
	#Tab {
		color: @tab.inactiveForeground@;
		background-color: @tab.inactiveBackground@;
		border: @tab.border@;
		padding: 5px 10px 5px 10px;
		font-size: 10pt;
	}

	#TabActive {
		color: @tab.activeForeground@ ;
		background-color: @tab.activeBackground@;
		border: @tab.border@;
		padding: 5px 10px 5px 10px;
		font-size: 10pt;
	}

	#Tab:hover {
		background-color: @tab.hoverBackground@;
	}
</style>


<style when="isMac">
	#Tab,
	#TabActive {
		font-size: 14pt;
	}
</style>