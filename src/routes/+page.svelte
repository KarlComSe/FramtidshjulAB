<script lang="ts">
	import BikeSelector from '$lib/components/BikeSelector.svelte';
	import QrCode from '$lib/components/QrCode.svelte';
	import { bikeStore } from '$lib/stores/bikeStore.svelte';
	import BatterySlider from '$lib/components/BatterySlider.svelte';
	import { bikeSyncService } from '$lib/services/bikeSync';
    import { BrowserGPS } from '$lib/providers/BrowserGPS';

	let selectedBikeId = $derived(bikeStore.selectedBikeId);
	let selectedBike = $derived(bikeStore.selectedBike());

  let syncOngoing = $state(false);

  $effect(() => {
		if (selectedBikeId) {
			bikeSyncService.startSync(selectedBikeId); // Start syncing this bike
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
		}
	});

  function stopSync() {
    if (selectedBikeId) {
      bikeSyncService.stopSync(selectedBikeId);
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
    }
  }

  function startSync() {
    if (selectedBikeId) {
      bikeSyncService.startSync(selectedBikeId);
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
    }
  }

</script>

<div class="container">
	<h1>Hyr mig</h1>
	<QrCode data={selectedBikeId} />
	<BikeSelector />
	{#if selectedBike}
		<pre>{selectedBike?.toString()}</pre>
	{/if}
	<BatterySlider />
  <div>
    { syncOngoing ? 'Syncing...' : 'Not syncing' }
  </div>
  
	<button 
	  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:text-gray-500"
	  onclick={syncOngoing ? stopSync : startSync} disabled={!selectedBikeId}>
	  { syncOngoing ? 'Stop sync' : 'Start sync' }
	</button>

	{#if selectedBikeId}
	<button 
	  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300"
	  onclick={() => bikeStore.setGPSProvider(selectedBikeId, new BrowserGPS())}>
	  Start GPS
	</button>
	{/if}


</div>

<style>
</style>
