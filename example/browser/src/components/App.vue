<template>
	<div class="app">
		<Header></Header>

		<template v-if="authorized">
			<Section class="content"></Section>

			<Footer></Footer>
		</template>

		<template v-else>
			<Login class="content"></Login>
		</template>
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
		font-size: 14px;
		margin: 0;
		padding: 0;
	}
</style>
