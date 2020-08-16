<template>
	<button v-on:click="() => action()" :disabled="disabled" :class="{ btn: true, 'btn-outline-light': theme === 'Dark', light: theme === 'Light', 'btn-active': active }">
		{{ text }}
	</button>
</template>

<script src="./Button.js"></script>
<style scoped src="./Button.css"></style>
