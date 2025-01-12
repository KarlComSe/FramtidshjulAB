<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import { bikeSyncService } from "$lib/services/bikeSync.svelte";
    import MockGpsControls from "./MockGPSControls.svelte";
    import SyncControl from "./SyncControl.svelte";
    import CreateBikes from "./CreateBikes.svelte";
    import Mapped from "./Mapped.svelte";
    import { onDestroy, onMount } from "svelte";

    let throttledStats = $state({
        movingBikes: 0,
        totalBikes: 0,
        syncingBikes: 0,
        speedLimitBikes: 0,
        inSpeedZone: 0,
    });

    let isMovingOpen = $state(false);
    let isSyncingOpen = $state(false);
    let isAllBikesOpen = $state(false);
    let isOverSpeedLimitOpen = $state(false);
    let isWithSpeedLimitOpen = $state(false);

    const bikes = $derived(bikeStore.bikes);
    const bikesList = $derived(Array.from(bikes.values()));
    const UPDATE_INTERVAL = 1000;

    const syncStats = $derived({
        syncing: bikeSyncService.getRunningSyncs(),
        syncingCount: bikeSyncService.getRunningSyncs().length,
    });
    const bikeStats = $derived({
        all: Array.from(bikes.values()),
        total: bikes.size,
        moving: bikesList.filter((bike) => bike.moving),
        movingCount: bikesList.filter((bike) => bike.moving).length,
        speedLimit: bikesList.filter(
            (bike) =>
                bike.speedlimit &&
                bike.speed !== undefined &&
                bike.speed > bike.speedlimit,
        ),
        inSpeedZone: bikesList.filter((bike) => bike.speedlimit),
    });

    let updateInterval: number;

    onMount(() => {
        updateInterval = setInterval(() => {
            const currentBikes = Array.from(bikes.values());

            throttledStats.movingBikes = currentBikes.filter(
                (bike) => bike.moving,
            ).length;
            throttledStats.totalBikes = bikes.size;
            throttledStats.syncingBikes =
                bikeSyncService.getRunningSyncs().length;
            throttledStats.speedLimitBikes = currentBikes.filter(
                (bike) =>
                    bike.speedlimit &&
                    bike.speed !== undefined &&
                    bike.speed > bike.speedlimit,
            ).length;
            throttledStats.inSpeedZone = currentBikes.filter(
                (bike) => bike.speedlimit,
            ).length;
        }, UPDATE_INTERVAL);
    });

    onDestroy(() => {
        if (updateInterval) clearInterval(updateInterval);
    });
</script>

<div
    class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4"
>
    <p class="font-bold">Warning:</p>
    <p>
        This page is intended for debugging purposes only. It consumes a
        significant amount of resources and <strong>WILL</strong> slow down your
        browser if there is a large number of bikes.
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

<details class="mb-4" bind:open={isMovingOpen}>
    <summary class="cursor-pointer text-lg font-semibold">
        Moving bikes <span class="text-blue-500"
            >{throttledStats.movingBikes}</span
        >
    </summary>
    {#if isMovingOpen}
        <div class="grid grid-cols-1 gap-4 mt-2">
            {#each bikeStats.moving as bike (bike.id)}
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
    {/if}
</details>

<details class="mb-4" bind:open={isSyncingOpen}>
    <summary class="cursor-pointer text-lg font-semibold"
        >Syncing bikes <span class="text-blue-500"
            >{throttledStats.syncingBikes}</span
        ></summary
    >
    {#if isSyncingOpen}
        <div class="grid grid-cols-1 gap-4">
            {#each syncStats.syncing as bike (bike)}
                <div class="p-4 border rounded shadow">
                    <span class="font-semibold">ID:</span>
                    {bike}
                </div>
            {/each}
        </div>
    {/if}
</details>

<details class="mb-4" bind:open={isAllBikesOpen}>
    <summary class="cursor-pointer text-lg font-semibold"
        >All bikes <span class="text-blue-500">{throttledStats.totalBikes}</span
        ></summary
    >
    {#if isAllBikesOpen}
        <div class="grid grid-cols-1 gap-4">
            {#each bikeStats.all as bike (bike.id)}
                <div class="p-4 border rounded shadow">
                    <span class="font-semibold">ID:</span>
                    {bike.id}
                </div>
            {/each}
        </div>
    {/if}
</details>

<details class="mb-4" bind:open={isWithSpeedLimitOpen}>
    <summary class="cursor-pointer text-lg font-semibold">
        Bikes over speed limit <span class="text-blue-500"
            >{throttledStats.speedLimitBikes}</span
        >
    </summary>
    {#if isWithSpeedLimitOpen}
        <div class="grid grid-cols-1 gap-4 mt-2">
            {#each bikeStats.speedLimit as bike (bike.id)}
                <div class="p-4 border rounded shadow">
                    <span class="font-semibold">ID:</span>
                    {bike.id}
                    <pre class="bg-gray-100 p-2 rounded mt-2">{bike.speed}</pre>
                    <pre
                        class="bg-gray-100 p-2 rounded mt-2">{bike.speedlimit}</pre>
                    <pre
                        class="bg-gray-100 p-2 rounded mt-2">{bike.latitude?.toFixed(
                            4,
                        )}..., {bike.longitude?.toFixed(4)}...</pre>
                </div>
            {/each}
        </div>
    {/if}
</details>
<details class="mb-4" bind:open={isOverSpeedLimitOpen}>
    <summary class="cursor-pointer text-lg font-semibold">
        Bikes in speed zone <span class="text-blue-500"
            >{throttledStats.inSpeedZone}</span
        >
    </summary>
    {#if isOverSpeedLimitOpen}
        <div class="grid grid-cols-1 gap-4 mt-2">
            {#each bikeStats.inSpeedZone as bike (bike.id)}
                <div class="p-4 border rounded shadow">
                    <span class="font-semibold">ID:</span>
                    {bike.id}
                    <pre
                        class="bg-gray-100 p-2 rounded mt-2">{bike.speedlimit}</pre>
                    <pre
                        class="bg-gray-100 p-2 rounded mt-2">{bike.latitude?.toFixed(
                            4,
                        )}..., {bike.longitude?.toFixed(4)}...</pre>
                </div>
            {/each}
        </div>
    {/if}
</details>
