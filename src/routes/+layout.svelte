<script lang="ts">
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
	let { children } = $props();

	let bikesInitialized = $state(false);
	let tripStoreInitialized = $state(false);
	let speedZoneStoreInitialized = $state(false);
	async function initializeBikes() {
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

	async function initializeSpeedZoneStore() {
		try {
			const response = await fetch(`${BACKEND_URL}/zone?type=speed`);
			const data = await response.json();
			const speedZones = data.zones.map((zone: any) => ({
				id: zone.id,
				name: zone.name,
				type: zone.type,
				points: zone.polygon,
				speedLimit: zone.speedZone.speedLimit
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

	function initializeTripStore() {
        try {
            // Accessing the store will trigger its constructor and loading logic.
            tripStore;
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

<div class="flex p-3 justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-screen-xl p-6 bg-white rounded-lg shadow-md">
		<nav class="mb-6">
			<ul class="flex justify-start gap-6 text-lg font-bold text-gray-700">
				<li><a href="/" class="hover:underline hover:text-blue-500 transition">Home</a></li>
				<li><a href="/map" class="hover:underline hover:text-blue-500 transition">Map and simulation</a></li>
				<li><a href="/trip-log" class="hover:underline hover:text-blue-500 transition">Trip log</a></li>
				<li><a href="/speed-zones" class="hover:underline hover:text-blue-500 transition">Speed zones</a></li>
				<li><a href="/about" class="hover:underline hover:text-blue-500 transition">About</a></li>
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
