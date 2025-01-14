<script lang="ts">
  import BikeStatus from '$lib/components/BikeStatus.svelte';
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import BatterySlider from '$lib/components/BatterySlider.svelte';
  import { bikeSyncService } from '$lib/services/bikeSync.svelte';
  import { BrowserGPS } from '$lib/providers/BrowserGPS';
  import { MockGPS } from '$lib/providers/MockGPS';
  import Map from '$lib/components/Map.svelte';
  import TripControls from '$lib/components/TripControls.svelte';

  const selectedBikeId = $derived(bikeStore.selectedBikeId);
  const selectedBike = $derived(bikeStore.selectedBike());
  let syncOngoing = $state(false);

  $effect(() => {
    if (selectedBikeId) {
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
    }
  });

  function stopSync(): void {
    if (selectedBikeId) {
      bikeSyncService.stopSync(selectedBikeId);
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
    }
  }

  function startSync(): void {
    if (selectedBikeId) {
      bikeSyncService.startSync(selectedBikeId);
      syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
    }
  }
</script>

<div class="">
  {#if selectedBike}
    <BikeStatus {selectedBike} />
    <TripControls />
    <BatterySlider />

    <div class="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-md sm:flex-row">
      <button
        class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
        onclick={syncOngoing ? stopSync : startSync}
        disabled={!selectedBikeId}
      >
        {syncOngoing ? 'Stop sync' : 'Start sync'}
      </button>

      <button
        class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        onclick={() => bikeStore.setGPSProvider(selectedBikeId, new BrowserGPS())}
      >
        Start GPS from device
      </button>

      <button
        class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onclick={() => bikeStore.stopGPSProvider(selectedBikeId)}
      >
        Stop GPS
      </button>

      <button
        class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onclick={() =>
          bikeStore.setGPSProvider(
            selectedBikeId,
            new MockGPS({
              route: MockGPS.goteborgRoute,
              loop: true,
            })
          )}
      >
        Mock route in Göteborg
      </button>
    </div>

    <div class="py-4">
      <Map />
    </div>
  {/if}
</div>

<style>
</style>
