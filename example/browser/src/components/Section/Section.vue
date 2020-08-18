<template>
	<div class="wrapper">
		<div class="header">
			<div class="header-controls">
				<select class="custom-select" v-model="inputs.method">
					<option v-for="option in options" :value="option.key">{{ option.label }}</option>
				</select>
				<div class="input-container" v-if="selected.inputs && selected.inputs.length > 0">
					<input v-for="input in selected.inputs" :id="input" :class="{ 'form-control': true, 'custom-input': true }" type="text" :placeholder="input" v-model.trim="inputs[input]" v-on:keyup.enter="send()" />
				</div>
				<Button :disabled="loading" :action="() => send()" :text="'Send'" class="header-btn"></Button>
			</div>
		</div>

		<div class="content">
			<SectionLoader v-if="loading"></SectionLoader>
			<div v-if="!loading && response" class="response">
				<json-viewer
						:value="response"
						:expand-depth="5"
				>
				</json-viewer>
			</div>
		</div>

	</div>
</template>

<script src="./Section.js"></script>
<style scoped src="./Section.css"></style>
