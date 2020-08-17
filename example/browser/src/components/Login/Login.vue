<template>
	<div class="wrapper">
		<div class="login">
			<form v-on:submit.prevent="connect" class="form-horizontal login">
				<div class="form-group">
					<label for="context">Context<span class="asterisk-required">*</span></label>
					<select id="context" class="custom-select" v-model="contextType">
						<option v-for="option in contexts" :value="option">
							{{ option }}
						</option>
					</select>
				</div>
				<transition name="fade">
					<div v-if="contextType === 'CUSTOM'" class="form-group">
						<input id="contextId" class="form-control" placeholder="TEST" type="text" v-model="contextId">
					</div>
				</transition>
				<div class="form-group">
					<label for="user">User<span class="asterisk-required">*</span></label>
					<input id="user" class="form-control" placeholder="12345678" type="text" v-model="userId">
				</div>
				<div class="form-group buttons">
					<input type="submit" value="Connect" class="form-control btn btn-primary btn-connect"/>
				</div>
			</form>
		</div>
	</div>
</template>

<script src="./Login.js"></script>
<style scoped src="./Login.css"></style>
