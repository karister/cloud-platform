<template>
	<SubTitle :titleText="titleText" :descriptionTitle="descriptionTitle"></SubTitle>
	<slot></slot>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: ['titleText', 'descriptionTitle']
	}
</script>
