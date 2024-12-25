<script lang="ts">
	import { bikeStore } from "$lib/stores/bikeStore.svelte";
    let bikes = $derived([...bikeStore.bikes.values()]);
    let selectedBikeId = $derived(bikeStore.selectedBikeId);

	function handleSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        bikeStore.selectBike(select.value);
    }
</script>

<div class="bg-white rounded-lg shadow-md p-4 max-w-min">
    <span class="text-gray-600">Vilken cykel är du:</span>
    <select 
        value={selectedBikeId ?? ''} 
        onchange={handleSelect} 
        class="p-1 border border-gray-200 rounded w-auto"
    >
        {#each bikes as bike, i}
            <option value={bike.id}>{i + 1} : {bike.id.slice(0,10)}... {bike.status !== "Available" ? (bike.status == "Service" ? "(Service)" : "(Uthyrd)") : "(Tillgänglig)"}</option>
        {/each}
    </select>
</div>

<style>
	select {
		min-width: 250px;
		width: fit-content;
	}
</style>