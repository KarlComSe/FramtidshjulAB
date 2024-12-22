<script lang="ts">
	export let data;
	import QRCode from '@castlenine/svelte-qrcode';

	const size: number = 100;
</script>

<div class="qr-code">
	{#if data}
		{#key data}
			<QRCode logoPath="https://avatars.githubusercontent.com/u/169550?v=4" {size} {data} />
		{/key}
	{/if}
</div>

<style>
	.qr-code {
		min-width: 100px;
		min-height: 100px;
	}
</style>
