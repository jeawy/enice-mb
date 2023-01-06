
<template>
	<web-view :src="baseAppUrl+'/hybrid/html/enice-privacy.html'"></web-view>
</template>
<script>
export default {
data() {
    return {
		baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
	};
	}
}
</script>
