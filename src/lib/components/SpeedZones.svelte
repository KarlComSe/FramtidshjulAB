<script lang="ts">
    import { speedZoneStore } from "$lib/stores/speedZoneStore.svelte";
    import { bikeStore} from "$lib/stores/bikeStore.svelte";
    import ZoneMap from "./ZoneMap.svelte";
</script>

<div class="bg-white rounded-lg shadow-md p-4 my-2">
    <div class="text-lg font-semibold text-gray-800 py-2">Hastighetszoner</div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each speedZoneStore.getSpeedZones() as speedZone}
            <div class="bg-white rounded-lg shadow-md p-4">
                <div class="text-lg font-semibold text-gray-800 py-2">
                    {speedZone.name}
                </div>
                <div class="text-gray-600 py-2">
                    Hastighetsbegränsning: {speedZone.speedLimit} km/h
                </div>
                <div class="text-gray-600 py-2">
                    <ZoneMap polygon={speedZone.polygon.geometry.coordinates} />
                </div>
            </div>
        {/each}
    </div>
</div>
<div class="bg-white rounded-lg shadow-md p-4 my-2">
    <div class="text-lg font-semibold text-gray-800 py-2">
        Cyklar i hastighetszon
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each Array.from(bikeStore.bikes.values()) as bike}
            {#if bike.speedlimit}
                <div class="bg-white rounded-lg shadow-md p-4">
                    <div class="text-lg font-semibold text-gray-800 py-2">
                        {bike.id}
                    </div>
                    <div class="text-gray-600 py-2">
                        Hastighetsbegränsning: {bike.speedlimit} km/h
                    </div>
                </div>
            {/if} 
        {/each}
    </div>
</div>
