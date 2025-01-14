<script lang="ts">
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { bikeSyncService } from '$lib/services/bikeSync.svelte';

  //   const DELAY_BETWEEN_SYNC_START = 5;

  //   function sleep(ms: number) : Promise<void> {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  function startSyncAllBikes(): void {
    const bikes = Array.from(bikeStore.bikes.values());
    for (const bike of bikes) {
      bikeSyncService.startSync(bike.id);
      // await sleep(DELAY_BETWEEN_SYNC_START);
    }
  }
  function stopSyncAllBikes(): void {
    const runningSyncs = bikeSyncService.getRunningSyncs();

    runningSyncs.forEach((bikeId) => {
      try {
        bikeSyncService.stopSync(bikeId);
      } catch (error) {
        console.warn(`Failed to stop sync for bike ${bikeId}:`, error);
      }
    });
  }

  let syncInterval = $state(2000);
</script>

<div class="my-2 space-y-8 rounded-lg bg-white p-6 shadow-md">
  <div class="flex space-x-4">
    <button
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      onclick={startSyncAllBikes}
    >
      Sync All Bikes
    </button>
    <button
      class="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      onclick={stopSyncAllBikes}
    >
      Stop Syncing
    </button>
  </div>
  <div class="mt-6 space-y-2">
    <label for="syncInterval" class="block text-sm font-medium text-gray-700">Sync Interval</label>
    <input type="range" bind:value={syncInterval} min="1000" max="50000" step="1000" />
    <span class="block text-sm text-gray-500">{syncInterval} ms</span>
  </div>
</div>
