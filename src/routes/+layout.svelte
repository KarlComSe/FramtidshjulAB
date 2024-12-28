<script lang="ts">
    import Toaster from '$lib/components/Toaster.svelte';
    import { setupGlobalErrorHandler } from '$lib/errorHandler';
	import { Bike } from '$lib/models/bike.svelte';
	import { bikeStore } from '$lib/stores/bikeStore.svelte';
	import type { BikeAPIDto } from '$lib/types/BikeAPIDto';
	import '../app.css';
	import { BACKEND_URL } from '../config';
	let { children } = $props();
	async function initializeBikes() {
		try {
			const response = await fetch(`${BACKEND_URL}/bike`);
			const bikes: BikeAPIDto[] = await response.json();

			bikes.forEach((bikeData) => {
				const bike = new Bike(bikeData);
				bikeStore.addOrUpdateBike(bike);
			});

			return true;
		} catch (err) {
			console.error('Failed to load bikes:', err);
			return false;
		}
	}

	$effect(() => {
		initializeBikes();
		setupGlobalErrorHandler();
	});
</script>

<div class="flex p-3 justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-screen-xl p-6 bg-white rounded-lg shadow-md">
		<nav class="mb-6">
			<ul class="flex justify-start gap-6 text-lg font-bold text-gray-700">
				<li><a href="/" class="hover:underline hover:text-blue-500 transition">Home</a></li>
				<li><a href="/map" class="hover:underline hover:text-blue-500 transition">Map</a></li>
				<li><a href="/simulate" class="hover:underline hover:text-blue-500 transition">Simulate</a></li>
				<li><a href="/about" class="hover:underline hover:text-blue-500 transition">About</a></li>
			</ul>
		</nav>
		<main>
			{@render children()}
			<Toaster />
		</main>	
	</div>
</div>
