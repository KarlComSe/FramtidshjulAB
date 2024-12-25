<script lang="ts">
	export let data;
	import QRCode from '@castlenine/svelte-qrcode';

	const size: number = 100;
</script>
{#if data}
<div class="qr-code p-4 my-2 bg-slate-50 w-min h-auto rounded-lg shadow-sm">

        {#key data}
            <QRCode logoPath="https://avatars.githubusercontent.com/u/169550?v=4" {size} {data} />
        {/key}
        <div class="text-center text-sm font-semibold bg-slate-900 text-emerald-400 rounded-b-lg">
            Hyr mig
        </div>

</div>
{/if}
<style>
</style>
