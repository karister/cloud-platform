<template>
	<q-view id="jsonelementgroup" :focusTracking="true" :focusPolicy="2" layout="vbox" layout-spacing="0">
		<slot>
		</slot>
	</q-view>
</template>

<script>
	export default {
		data() {
			return {}
		}
	}
</script>


<style lang='qss'>
	#jsonelementgroup {
		border: 1px solid transparent;
		padding: 15px 5px;
	}
	
	#jsonelementgroup[focused="true"] {
		border: 1px solid @search.config.element.border.focus@;
		background-color: @search.config.element.background.focus@;
	}

</style>