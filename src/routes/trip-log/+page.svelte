<script lang="ts">
    import { tripStore } from "$lib/stores/tripStore.svelte";
    let showOnlyFinalizedTrip = $state(false);
    let showOnlyOngoingTrip = $state(false);
    let filterBikeId = $state("");
    let trips = $derived(
        tripStore.trips.filter((trip) => {
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
        }).filter((trip) => {
            if (filterBikeId) {
                return trip.bikeId.includes(filterBikeId);
            }
            return true;
        })
    );
</script>

<div class="p-6 bg-white rounded-xl shadow-md space-y-4 my-4">
    <h1 class="text-2xl font-semibold text-gray-900">Trip Log</h1>
    <div class="space-y-4">
        <div>
            <input
                type="text"
                id="bikeid"
                placeholder="Filter on bike id"
                class="border border-gray-300 rounded-lg p-2 w-full"
                bind:value={filterBikeId}
            />
        </div>

        <div class="flex items-center p-2 shadow-md mt-4">
            <label class="flex items-center">
            <input class="m-2" type="checkbox" bind:checked={showOnlyFinalizedTrip}/>
            <span class="ml-2 text-gray-700">Finalized trips only</span>
            </label>
        </div>
        <div class="flex items-center p-2 shadow-md mt-4">
            <label class="flex items-center">
            <input class="m-2" type="checkbox" bind:checked={showOnlyOngoingTrip}/>
            <span class="ml-2 text-gray-700">Ongoing trips only</span>
            </label>
        </div>
    </div>
</div>

<div class="p-6 bg-white rounded-xl shadow-md space-y-4 my-4 overflow-x-auto">
    <table
        class="table-auto w-full border-collapse border border-gray-200 text-left text-sm "
    >
        <thead>
            <tr class="bg-gray-100">
                <th class="border p-1 border-gray-200">Trip ID</th>
                <th class="border p-1 border-gray-200">Bike ID</th>
                <th class="border p-1 border-gray-200">Start Time</th>
                <th class="border p-1 border-gray-200">End Time</th>
                <th class="border p-1 border-gray-200">Start Latitude</th>
                <th class="border p-1 border-gray-200">Start Longitude</th>
                <th class="border p-1 border-gray-200">End Latitude</th>
                <th class="border p-1 border-gray-200">End Longitude</th>
            </tr>
        </thead>
        <tbody>
            {#each trips as trip}
                <tr class="hover:bg-gray-100">
                    <td class="p-2 border border-gray-200">{trip.tripId}</td>
                    <td class="p-2 border border-gray-200">{trip.bikeId}</td>
                    <td class="p-2 border border-gray-200">{trip.startTime}</td>
                    <td class="p-2 border border-gray-200">{trip.endTime}</td>
                    <td class="p-2 border border-gray-200">{trip.startLatitude}</td>
                    <td class="p-2 border border-gray-200">{trip.startLongitude}</td>
                    <td class="p-2 border border-gray-200">{trip.endLatitude}</td>
                    <td class="p-2 border border-gray-200">{trip.endLongitude}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
</style>
