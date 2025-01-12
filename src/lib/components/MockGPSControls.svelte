<script lang="ts">
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { MockGPS } from '$lib/providers/MockGPS';
  const bikes = bikeStore.bikes;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function mockGPSForAllBikes() {
    const bikes = bikeStore.bikes.values();
    for (const bike of bikes) {
      bikeStore.setGPSProvider(
        bike.id,
        new MockGPS({
          route: MockGPS.routes[Math.floor(Math.random() * MockGPS.routes.length)],
          loop: true,
        })
      );
    }
  }

  function stopMockGPSForAllBikes() {
    bikes.forEach((bike) => {
      bikeStore.stopGPSProvider(bike.id);
    });
  }
</script>

<div class="my-2 space-y-8 rounded-lg bg-white p-6 shadow-md">
  <div class="flex space-x-4">
    <button
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      onclick={mockGPSForAllBikes}
    >
      Make all bikes move
    </button>
    <button
      class="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      onclick={stopMockGPSForAllBikes}
    >
      Stop all bikes from moving
    </button>
  </div>
</div>
