<script lang="ts">
	import { Bike } from '$lib/models/bike.svelte';
	import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { bikeSyncService } from '$lib/services/bikeSync';
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
	});
</script>

<div class="container mx-auto p-4">
	<nav class="mb-8">
		<ul class="flex gap-4">
			<li><a href="/" class="hover:underline">Home</a></li>
			<li><a href="/map" class="hover:underline">Map</a></li>
			<li><a href="/simulate" class="hover:underline">Simulate</a></li>
			<li><a href="/about" class="hover:underline">About</a></li>
		</ul>
	</nav>
</div>

{@render children()}
