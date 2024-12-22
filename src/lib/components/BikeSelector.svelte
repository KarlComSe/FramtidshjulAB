<script lang="ts">
	import { bikeStore } from "$lib/stores/bikeStore.svelte";
    let bikes = $derived([...bikeStore.bikes.values()]);
    let selectedBikeId = $derived(bikeStore.selectedBikeId);

	function handleSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        bikeStore.selectBike(select.value);
    }
</script>

<div>
    Vilken cykel är du:
	<select value={selectedBikeId ?? ''} onchange={handleSelect}>
		{#each bikes as bike, i}
			<option value={bike.id}>{i + 1} : {bike.id}</option>
		{/each}
	</select>
</div>
