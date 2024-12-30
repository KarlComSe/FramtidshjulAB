<script lang="ts">
	import BikeSelector from "$lib/components/BikeSelector.svelte";
	import { bikeStore } from "$lib/stores/bikeStore.svelte";
	import { bikeSyncService } from "$lib/services/bikeSync.svelte";
    import Bike from "$lib/components/Bike.svelte";

	let selectedBikeId = $derived(bikeStore.selectedBikeId);
	let selectedBike = $derived(bikeStore.selectedBike());
	let syncOngoing = $state(false);

	$effect(() => {
		if (selectedBikeId) {
			bikeSyncService.startSync(selectedBikeId); // Start syncing this bike
			syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
		}
	});

	function stopSync() {
		if (selectedBikeId) {
			bikeSyncService.stopSync(selectedBikeId);
			syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
		}
	}

	function startSync() {
		if (selectedBikeId) {
			bikeSyncService.startSync(selectedBikeId);
			syncOngoing = bikeSyncService.isSyncRunning(selectedBikeId);
		}
	}
</script>

<div class="">
	<BikeSelector />
	<Bike />
</div>

<style>
</style>
