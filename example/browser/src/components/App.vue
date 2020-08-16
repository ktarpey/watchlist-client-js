<template>
	<div class="app">
		<Header></Header>

		<Section v-if="!loading" class="content"></Section>

		<Footer v-if="!loading"></Footer>
	</div>
</template>

<script src="./App.js"></script>
<style scoped src="./App.css"></style>

<style>
	:root {
		--main-dark-bg-color: rgb(0, 79, 136);
		--main-light-bg-color: white;

		--main-dark-font-color: black;
		--main-light-font-color: white;
	}

	html, body {
		margin: 0;
		padding: 0;
	}
</style>
