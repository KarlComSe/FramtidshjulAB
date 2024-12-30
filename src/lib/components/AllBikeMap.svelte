<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import { bikeSyncService } from "$lib/services/bikeSync.svelte";
    import MockGpsControls from "./MockGPSControls.svelte";
    import SyncControl from "./SyncControl.svelte";
    import CreateBikes from "./CreateBikes.svelte";
    import Mapped from "./Mapped.svelte";

    const bikes = $derived(bikeStore.bikes);
    const syncingBikes = $derived(bikeSyncService.getRunningSyncs());

    const bikesList = $derived(Array.from(bikes.values()));
    const movingBikes = $derived(bikesList.filter((bike) => bike.moving));
    const numberOfSyncingBikes = $derived(syncingBikes.length);
    const numberOfBikes = $derived(bikes.size);
</script>

<div
    class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4"
>
    <p class="font-bold">Warning:</p>
    <p>
        This page is intended for debugging purposes only. It consumes a
        significant amount of resources and <strong>WILL</strong> slow down your browser 
        if there is a large number of bikes.
    </p>
</div>
<div>
    <Mapped />
</div>
<div>
    <MockGpsControls />
</div>
<div>
    <SyncControl />
</div>
<div>
    <CreateBikes />
</div>

<details class="mb-4">
    <summary class="cursor-pointer text-lg font-semibold">
        Moving bikes <span class="text-blue-500">{movingBikes.length}</span>
    </summary>
    <div class="grid grid-cols-1 gap-4 mt-2">
        {#each movingBikes as bike}
            <div class="p-4 border rounded shadow">
                <span class="font-semibold">ID:</span>
                {bike.id}
                <pre class="bg-gray-100 p-2 rounded mt-2">{bike.speed}</pre>
                <pre
                    class="bg-gray-100 p-2 rounded mt-2">{bike.latitude?.toFixed(
                        4,
                    )}..., {bike.longitude?.toFixed(4)}...</pre>
            </div>
        {/each}
    </div>
</details>

<details class="mb-4">
    <summary class="cursor-pointer text-lg font-semibold"
        >Syncing bikes <span class="text-blue-500">{numberOfSyncingBikes}</span
        ></summary
    >
    <div class="grid grid-cols-1 gap-4">
        {#each syncingBikes as bike}
            <div class="p-4 border rounded shadow">
                <span class="font-semibold">ID:</span>
                {bike}
            </div>
        {/each}
    </div>
</details>

<details class="mb-4">
    <summary class="cursor-pointer text-lg font-semibold"
        >All bikes <span class="text-blue-500">{numberOfBikes}</span></summary
    >
    <div class="grid grid-cols-1 gap-4">
        {#each bikes as bike}
            <div class="p-4 border rounded shadow">
                <span class="font-semibold">ID:</span>
                {bike}
            </div>
        {/each}
    </div>
</details>
