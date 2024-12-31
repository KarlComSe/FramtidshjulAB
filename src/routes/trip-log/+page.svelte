<script lang="ts">
    import { tripStore } from '$lib/stores/tripStore.svelte';
    let trips = $derived(tripStore.trips);
</script>

<div class="">
	Här ska man kunna se alla loggar!
    {#each trips as trip}
        <div>
            <pre>{JSON.stringify(trip, null, 2)}</pre>
        </div>
    {/each}
</div>

<style>
</style>
