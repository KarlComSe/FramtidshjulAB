<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import { bikeSyncService } from "$lib/services/bikeSync.svelte";

    const DELAY_BETWEEN_SYNC_START = 50;

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function startSyncAllBikes() {
        const bikes = Array.from(bikeStore.bikes.values());
        for (const bike of bikes) {
            bikeSyncService.startSync(bike.id);
            await sleep(DELAY_BETWEEN_SYNC_START);
        }
    }
    function stopSyncAllBikes() {
        console.log("Attempting to stop all syncs");
        const runningSyncs = bikeSyncService.getRunningSyncs();
        console.log("Currently running syncs:", runningSyncs);

        runningSyncs.forEach((bikeId) => {
            console.log(`Attempting to stop sync for bike ${bikeId}`);
            try {
                bikeSyncService.stopSync(bikeId);
                console.log(`Stopped sync for bike ${bikeId}`);
            } catch (error) {
                console.warn(`Failed to stop sync for bike ${bikeId}:`, error);
            }
        });
    }

    let syncInterval = $state(2000);
</script>

<div class="space-y-8 p-6 bg-white rounded-lg shadow-md my-2">
    <div class="flex space-x-4">
        <button
            class="inline-flex items-center justify-center px-4 py-2 w-full bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
            onclick={startSyncAllBikes}
        >
            Sync All Bikes
        </button>
        <button
            class="inline-flex items-center justify-center px-4 py-2 w-full bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
            onclick={stopSyncAllBikes}
        >
            Stop Syncing
        </button>
    </div>
    <div class="mt-6 space-y-2">
        <label
            for="syncInterval"
            class="block text-sm font-medium text-gray-700">Sync Interval</label
        >
        <input
            type="range"
            bind:value={syncInterval}
            min="1000"
            max="50000"
            step="1000"
        />
        <span class="block text-sm text-gray-500">{syncInterval} ms</span>
    </div>
</div>
