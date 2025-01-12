<script lang="ts">
  import { BACKEND_URL } from '../../config';
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import type { BikeType } from '$lib/types/Bike';
  let numberOfBikes = $state(100);

  function createBikes() {
    console.log(`Creating ${numberOfBikes} bikes`);
    createBikesInBackend();
  }

  async function createBikesInBackend() {
    const bikes = Array(numberOfBikes).fill({ latitude: 57.7, longitude: 11.9753 });
    try {
      const response = await fetch(`${BACKEND_URL}/bike/create-many`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bikes),
      });
      if (response.ok) {
        console.log(`Created ${numberOfBikes} bikes`);
        const newBikes = (await response.json()) as BikeType[];
        newBikes.forEach((bike) => {
          bikeStore.addOrUpdateBike(bike);
        });
      } else {
        throw new Error(`Failed to create bikes: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error creating bikes:`, error);
    }
  }
</script>

<div class="my-2 space-y-8 rounded-lg bg-white p-6 shadow-md">
  <div class="flex space-x-4">
    <button
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      onclick={createBikes}
    >
      Create {numberOfBikes} bikes
    </button>
  </div>
  <div class="mt-6 space-y-2">
    <label for="numberOfBikes" class="block text-sm font-medium text-gray-700"
      >Number of bikes</label
    >
    <input type="range" min="1" max="100" bind:value={numberOfBikes} />
  </div>
</div>
