<template>
	<q-view layout="hbox" layout-spacing="20">
		<!-- <q-radio-group layout="hbox"  stretch-factor='1'> -->
		<q-checkbox id="HXCheckBox" text='Android' :checked="android" @clicked="setPlatformType" data-value="android" />
		<q-checkbox id="HXCheckBox" text='iOS' :checked="ios" @clicked="setPlatformType" data-value="ios" />
		<q-view horizontal-size-policy="Expanding"></q-view>
		<!-- </q-radio-group> -->
		<!-- <q-view horizontal-size-policy="Expanding"></q-view> -->
	</q-view>
</template>

<script>
export default {
	data() {
		return {
			android: true,
			ios: true,
		};
	},
	async updated() {},
	computed: {},
	methods: {
		async setPlatformType(e) {
			if (e.target['data-value'] === 'android') {
				this.android = !this.android
				if (!this.android) {
					this.ios = true
				}
			}
			if (e.target['data-value'] === 'ios') {
				this.ios = !this.ios
				if (!this.ios) {
					this.android = true
				}
			}
			await this.updateUi();
		}
	}
};
</script>

<style>
* {
	font-family: 'microsoft yahei';
	color: #405e42;
	font-size: 13px;
}

*:disabled {
	color: #b1b1b1;
}

#HXCheckBox {
	font-size: 13px;
	color: #405e42;
}
#HXCheckBox:!enabled
{
   color: #b1b1b1;
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
</style>
