<script lang="ts">
	import BikeSelector from "$lib/components/BikeSelector.svelte";
	import QrCode from "$lib/components/QrCode.svelte";
	import BikeStatus from "$lib/components/BikeStatus.svelte";
	import { bikeStore } from "$lib/stores/bikeStore.svelte";
	import BatterySlider from "$lib/components/BatterySlider.svelte";
	import { bikeSyncService } from "$lib/services/bikeSync";
	import { BrowserGPS } from "$lib/providers/BrowserGPS";
	import { MockGPS } from "$lib/providers/MockGPS";
	import Map from "$lib/components/Map.svelte";

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
	<QrCode data={selectedBikeId} />
	{#if selectedBike}
		<BikeStatus {selectedBike} />

		<BatterySlider />

		<div class="flex flex-col sm:flex-row gap-3">
			<button
				class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
				onclick={syncOngoing ? stopSync : startSync}
				disabled={!selectedBikeId}
			>
				{syncOngoing ? "Stop sync" : "Start sync"}
			</button>

			<button
				class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
				onclick={() =>
					bikeStore.setGPSProvider(selectedBikeId, new BrowserGPS())}
			>
				Start GPS from device
			</button>

			<button
				class="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
				onclick={() => bikeStore.stopGPSProvider(selectedBikeId)}
			>
				Stop GPS
			</button>

			<button
				class="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
				onclick={() =>
					bikeStore.setGPSProvider(
						selectedBikeId,
						new MockGPS({
							route: MockGPS.goteborgRoute,
							loop: true,
						}),
					)}
			>
				Mock route in Göteborg
			</button>
		</div>

		<div class="py-4">
			<Map />
		</div>
	{/if}
</div>

<style>
</style>
