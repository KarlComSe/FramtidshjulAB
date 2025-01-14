<script lang="ts">
  import { tripStore } from '$lib/stores/tripStore.svelte';
  let showOnlyFinalizedTrip = $state(false);
  let showOnlyOngoingTrip = $state(false);
  let filterBikeId = $state('');
  const trips = $derived(
    tripStore.trips
      .filter((trip) => {
        if (showOnlyFinalizedTrip && showOnlyOngoingTrip) {
          return false;
        }
        if (showOnlyFinalizedTrip) {
          return trip.endTime !== null;
        }
        if (showOnlyOngoingTrip) {
          return trip.endTime === null;
        }
        return true;
      })
      .filter((trip) => {
        if (filterBikeId) {
          return trip.bikeId.includes(filterBikeId);
        }
        return true;
      })
  );
</script>

<div class="my-4 space-y-4 rounded-xl bg-white p-6 shadow-md">
  <h1 class="text-2xl font-semibold text-gray-900">Trip Log</h1>
  <div class="space-y-4">
    <div>
      <input
        type="text"
        id="bikeid"
        placeholder="Filter on bike id"
        class="w-full rounded-lg border border-gray-300 p-2"
        bind:value={filterBikeId}
      />
    </div>

    <div class="mt-4 flex items-center p-2 shadow-md">
      <label class="flex items-center">
        <input class="m-2" type="checkbox" bind:checked={showOnlyFinalizedTrip} />
        <span class="ml-2 text-gray-700">Finalized trips only</span>
      </label>
    </div>
    <div class="mt-4 flex items-center p-2 shadow-md">
      <label class="flex items-center">
        <input class="m-2" type="checkbox" bind:checked={showOnlyOngoingTrip} />
        <span class="ml-2 text-gray-700">Ongoing trips only</span>
      </label>
    </div>
  </div>
</div>

<div class="my-4 space-y-4 overflow-x-auto rounded-xl bg-white p-6 shadow-md">
  <table class="w-full table-auto border-collapse border border-gray-200 text-left text-sm">
    <thead>
      <tr class="bg-gray-100">
        <th class="border border-gray-200 p-1">Trip ID</th>
        <th class="border border-gray-200 p-1">Bike ID</th>
        <th class="border border-gray-200 p-1">Start Time</th>
        <th class="border border-gray-200 p-1">End Time</th>
        <th class="border border-gray-200 p-1">Start Latitude</th>
        <th class="border border-gray-200 p-1">Start Longitude</th>
        <th class="border border-gray-200 p-1">End Latitude</th>
        <th class="border border-gray-200 p-1">End Longitude</th>
      </tr>
    </thead>
    <tbody>
      {#each trips as trip}
        <tr class="hover:bg-gray-100">
          <td class="border border-gray-200 p-2">{trip.tripId}</td>
          <td class="border border-gray-200 p-2">{trip.bikeId}</td>
          <td class="border border-gray-200 p-2">{trip.startTime}</td>
          <td class="border border-gray-200 p-2">{trip.endTime}</td>
          <td class="border border-gray-200 p-2">{trip.startLatitude}</td>
          <td class="border border-gray-200 p-2">{trip.startLongitude}</td>
          <td class="border border-gray-200 p-2">{trip.endLatitude}</td>
          <td class="border border-gray-200 p-2">{trip.endLongitude}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
