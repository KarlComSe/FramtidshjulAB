<script lang="ts">
  export let data;
  import QRCode from '@castlenine/svelte-qrcode';

  const size: number = 100;
</script>

{#if data}
  <div class="qr-code my-2 h-auto w-min rounded-lg bg-slate-50 p-4 shadow-sm">
    {#key data}
      <QRCode logoPath="https://avatars.githubusercontent.com/u/169550?v=4" {size} {data} />
    {/key}
    <div class="rounded-b-lg bg-slate-900 text-center text-sm font-semibold text-emerald-400">
      Hyr mig
    </div>
  </div>
{/if}

<style>
</style>
