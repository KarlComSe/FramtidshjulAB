<script lang="ts">
  // @TODO : check if tripStore; on around line 64 is needed

  import Toaster from '$lib/components/Toaster.svelte';
  import { setupGlobalErrorHandler } from '$lib/errorHandler';
  import { Bike } from '$lib/models/bike.svelte';
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { tripStore } from '$lib/stores/tripStore.svelte';
  import { speedZoneStore } from '$lib/stores/speedZoneStore.svelte';
  import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
  import type { SpeedZone } from '$lib/types/Polygon';
  import '../app.css';
  import { BACKEND_URL } from '../config';
  const { children } = $props();

  let bikesInitialized = $state(false);
  let tripStoreInitialized = $state(false);
  let speedZoneStoreInitialized = $state(false);
  async function initializeBikes(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/bike`);
      const bikes: BikeAPIDto[] = await response.json();

      bikes.forEach((bikeData) => {
        const bike = new Bike(bikeData);
        bikeStore.addOrUpdateBike(bike);
      });
      bikesInitialized = true;

      return true;
    } catch (err) {
      console.error('Failed to load bikes:', err);
      return false;
    }
  }

  async function initializeSpeedZoneStore(): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/zone?type=speed`);
      const data = await response.json();

      interface ApiSpeedZone {
        id: string;
        name: string;
        type: string;
        polygon: { lat: number; lng: number }[];
        speedZone: {
          speedLimit: number;
        };
      }

      const speedZones = data.zones.map((zone: ApiSpeedZone) => ({
        id: zone.id,
        name: zone.name,
        type: zone.type,
        points: zone.polygon,
        speedLimit: zone.speedZone.speedLimit,
      })) as SpeedZone[];

      speedZones.forEach((speedZone) => {
        speedZoneStore.add(speedZone);
      });

      speedZoneStoreInitialized = true;
    } catch (err) {
      console.error('Failed to load speed zones:', err);
      throw err;
    }
  }

  function initializeTripStore(): void {
    try {
      const store = tripStore;
      if (!store) {
        throw new Error('Trip store failed to initialize');
      }
      tripStoreInitialized = true;
    } catch (err) {
      console.error('Failed to initialize tripStore:', err);
      throw err;
    }
  }

  import { onMount } from 'svelte';

  onMount(async () => {
    await initializeSpeedZoneStore();
    initializeBikes();
    setupGlobalErrorHandler();
    initializeTripStore();
  });
</script>

<div class="flex min-h-screen justify-center bg-gray-100 p-3">
  <div class="w-full max-w-screen-xl rounded-lg bg-white p-6 shadow-md">
    <nav class="mb-6">
      <ul class="flex flex-wrap justify-start gap-6 text-lg font-bold text-gray-700">
        <li><a href="/" class="transition hover:text-blue-500 hover:underline">Home</a></li>
        <li>
          <a href="/map" class="transition hover:text-blue-500 hover:underline"
            >Map and simulation</a
          >
        </li>
        <li>
          <a href="/trip-log" class="transition hover:text-blue-500 hover:underline">Trip log</a>
        </li>
        <li>
          <a href="/speed-zones" class="transition hover:text-blue-500 hover:underline"
            >Speed zones</a
          >
        </li>
        <li><a href="/about" class="transition hover:text-blue-500 hover:underline">About</a></li>
      </ul>
    </nav>
    <main>
      {#if bikesInitialized && tripStoreInitialized && speedZoneStoreInitialized}
        {@render children()} <!-- Render children only when bikes are loaded -->
      {:else}
        <p>Loading bikes, logs and speedzones...</p>
      {/if}
      <Toaster />
    </main>
  </div>
</div>
