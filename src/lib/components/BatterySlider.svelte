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
			selectedBike.batteryLevel = parseInt(slider.value, 10);
			bikeStore.addOrUpdateBike(selectedBike);
		}
	}

	function getBatteryColor(level: number): string {
        if (level > 70) return 'text-green-500';
        if (level > 30) return 'text-yellow-500';
        return 'text-red-500';
    }
</script>

{#if selectedBike}
    <div class="bg-white rounded-lg shadow-md p-4 my-2">
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Battery Level</span>
            <span class="text-sm font-medium {getBatteryColor(selectedBike.batteryLevel)}">
                {selectedBike.batteryLevel}%
            </span>
        </div>
        <input
            id="battery-slider"
            type="range"
            min="0"
            max="100"
            value={selectedBike.batteryLevel}
            oninput={handleSliderChange}
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
    </div>
{/if}
