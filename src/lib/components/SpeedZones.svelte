<script lang="ts">
  import { speedZoneStore } from '$lib/stores/speedZoneStore.svelte';
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import ZoneMap from './ZoneMap.svelte';
</script>

<div class="my-2 rounded-lg bg-white p-4 shadow-md">
  <div class="py-2 text-lg font-semibold text-gray-800">Hastighetszoner</div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each speedZoneStore.getSpeedZones() as speedZone}
      <div class="rounded-lg bg-white p-4 shadow-md">
        <div class="py-2 text-lg font-semibold text-gray-800">
          {speedZone.name}
        </div>
        <div class="py-2 text-gray-600">
          Hastighetsbegränsning: {speedZone.speedLimit} km/h
        </div>
        <div class="py-2 text-gray-600">
          <ZoneMap polygon={speedZone.polygon.geometry.coordinates} />
        </div>
      </div>
    {/each}
  </div>
</div>
<div class="my-2 rounded-lg bg-white p-4 shadow-md">
  <div class="py-2 text-lg font-semibold text-gray-800">Cyklar i hastighetszon</div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each Array.from(bikeStore.bikes.values()) as bike}
      {#if bike.speedlimit}
        <div class="rounded-lg bg-white p-4 shadow-md">
          <div class="py-2 text-lg font-semibold text-gray-800">
            {bike.id}
          </div>
          <div class="py-2 text-gray-600">
            Hastighetsbegränsning: {bike.speedlimit} km/h
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
