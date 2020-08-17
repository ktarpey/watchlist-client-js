<template>
	<div class="wrapper">
		<div class="header-left">
			<div class="header-logo"></div>
			<div class="header-title">[Barchart Watchlist Client API]</div>
		</div>
		<div class="header-right">
			<Button v-if="$store.authorized" :text="'Logout'" :action="disconnect" :theme="'Dark'">
			</Button>
		</div>
	</div>
</template>

<script src="./Header.js"></script>
<style scoped src="./Header.css"></style>
