<script lang="ts">
	import { Bike } from '$lib/models/bike.svelte';
	import { bikeStore } from '$lib/stores/bikeStore.svelte';
	import type { BikeAPIDto } from '$lib/types/BikeAPIDto';

	// Get the selected bike
	let selectedBike = $derived(bikeStore.selectedBike());

	// Handle slider input and update battery level
	function handleSliderChange(event: Event) {
		const slider = event.target as HTMLInputElement;

		if (selectedBike) {
			// Create a proper BikeAPIDto
			const bikeData: BikeAPIDto = {
				id: selectedBike.id,
				status: selectedBike.status,
				batteryLevel: parseInt(slider.value, 10),
				latitude: selectedBike.latitude,
				longitude: selectedBike.longitude
			};

			// Create a new Bike instance
			const updatedBike = new Bike(bikeData);

			// Update other properties that aren't in the DTO
			updatedBike.renter = selectedBike.renter;
			updatedBike.name = selectedBike.name;
			updatedBike.speed = selectedBike.speed;

			bikeStore.addOrUpdateBike(updatedBike);
		}
	}
</script>

<!-- Only show slider if a bike is selected -->
{#if selectedBike}
	<label for="battery-slider">Battery Level: {selectedBike.batteryLevel}%</label>
	<input
		id="battery-slider"
		type="range"
		min="0"
		max="100"
		value={selectedBike.batteryLevel}
		oninput={handleSliderChange}
	/>
{/if}
